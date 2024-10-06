import { QueryCtx, query } from "./_generated/server";
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { auth } from "./auth";
import { Doc, Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

//populateThread
const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_parent_message_id", (q) =>
      q.eq("parentMessageId", messageId)
    )
    .collect();

  if (messages.length === 0) {
    return {
      count: 0,
      image: undefined,
      timeStamp: 0,
    };
  }
  const lastMessage = messages[messages.length - 1];
  const lastMessageMember = await populateMember(ctx, lastMessage.memberId);

  if (!lastMessageMember) {
    return {
      count: 0,
      image: undefined,
      timeStamp: 0,
    };
  }
  const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);

  return {
    count: messages.length,
    image: lastMessageUser?.image,
    time: lastMessage._creationTime,
  };
};

//populateRactions
const populateReactions = (ctx: QueryCtx, messageId: Id<"messages">) => {
  return ctx.db
    .query("reactions")
    .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
    .collect();
};

//populateMember
const populateMember = (ctx: QueryCtx, messageId: Id<"members">) => {
  return ctx.db.get(messageId);
};

//populateUser
const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
  return ctx.db.get(userId);
};

//helper function to get the member of the workspace
const getMember = async (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">
) => {
  return await ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId)
    )
    .unique();
};

export const get = query({
  args: {
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
    paginationOpts: paginationOptsValidator, // pagination provided by convex
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error("");
    }
    let _conversationId = args.conversationId;

    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessageId = await ctx.db.get(args.parentMessageId);

      if (!parentMessageId) {
        throw new Error("Parent Message Not Found");
      }
      _conversationId = parentMessageId.conversationId;
    }

    const results = await ctx.db
      .query("messages")
      .withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
        q
          .eq("channelId", args.channelId)
          .eq("parentMessageId", args.parentMessageId)
          .eq("conversationId", _conversationId)
      )
      .order("desc") // arranging the results in descending order
      .paginate(args.paginationOpts);

    return {
      results,
      page: (
        await Promise.all(
          results.page.map(async (message) => {
            const member = await populateMember(ctx, message.memberId);
            const user = member
              ? await populateUser(ctx, member?.userId)
              : null;
            if (!member || !user) {
              return null;
            }

            const reactions = await populateReactions(ctx, message._id);
            const thread = await populateThread(ctx, message._id);
            const image = message.image
              ? await ctx.storage.getUrl(message.image)
              : undefined;

            const reactionWithCount = reactions.map((reaction) => {
              return {
                ...reaction,
                count: reactions.filter((r) => r.value === reaction.value)
                  .length,
              };
            });

            //function to count the same reactio
            // const sameReactions = reactionWithCount.reduce(
            //   (acc, reaction) => {
            //     const existingReaction = acc.find(
            //       (r) => r.value === reaction.value
            //     );
            //     if(existingReaction){
            //       existingReaction.memberIds = Array.from(new Set([...existingReaction.memberId,reaction.memberId]))
            //     }else{
            //       acc.push({...reaction,memberIds:[reaction.memberId]})
            //     }
            //     return acc
            //   },
            //   [] as (Doc<"reactions"> & {
            //     count: number;
            //     memberId: Id<"members">[];
            //   })[]
            // );

            return {
              ...message,
              image,
              member,
              user,
              threadCount: thread.count,
              threadImage: thread.image,
              threadStamp: thread.timeStamp,
            };
          })
        )
      ).filter(
        (message): message is NonNullable<typeof message> => message !== null
      ),
    };
  },
});

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("un aurthorized");
    }

    const member = await getMember(ctx, args.workspaceId, userId);
    if (!member) {
      throw new Error("Un Authorised");
    }

    let _conversationId = args.conversationId;

    // this combination is when we are replying in 1:1 conversation
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessageId = await ctx.db.get(args.parentMessageId);

      if (!parentMessageId) {
        throw new Error("Parent message not found");
      }
      _conversationId = parentMessageId.conversationId;
    }

    const messageId = await ctx.db.insert("messages", {
      body: args.body,
      image: args.image,
      memberId: member._id,
      channelId: args.channelId,
      workspaceId: args.workspaceId,
      conversationId: _conversationId,
      parentMessageId: args.parentMessageId,
    });

    return messageId;
  },
});
