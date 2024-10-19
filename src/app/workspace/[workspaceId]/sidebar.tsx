import { UserButton } from "@/features/auth/components/user-button";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { SidebarButtons } from "./sidebar-buttons";
import { Bell, Home, MessagesSquareIcon, MoreHorizontal } from "lucide-react";


export const Sidebar = () => {

  return (
    <aside className="bg-[#153377] w-[70px] flex flex-col items-center h-full overflow-hidden">
      <div className="flex-1 flex flex-col items-center">
        <WorkspaceSwitcher />
        <div className="pt-3">
          <SidebarButtons icon={Home} isActive label="Home" />
          <SidebarButtons icon={MessagesSquareIcon} label="DM's" />
          <SidebarButtons icon={Bell} label="Activity" />
          <SidebarButtons icon={MoreHorizontal} label="More" />
        </div>
      </div>

      <div className="flex items-center justify-center mb-4">
        <UserButton />
      </div>
    </aside>
  );
};
