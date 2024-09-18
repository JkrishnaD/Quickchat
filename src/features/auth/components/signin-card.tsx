import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SignInFlow } from "../types";
import React, { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";

interface SigninCardProps {
  setState: (state: SignInFlow) => void;
}
export const SignInCard = ({ setState }: SigninCardProps) => {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const onAuthProvider = (value: "google" | "github") => {
    setPending(true);
    signIn(value).finally(() => {
      setPending(pending);
    });
  };

  const onPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    signIn("password", { email, password, flow: "signIn" })
      .catch(() => {
        setError("Invalid Email or Password");
      })
      .finally(() => {
        setPending(false);
      });
  };

  return (
    <Card className="w-full h-full p-8 font-medium">
      <CardHeader className="font-bold text-xl px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription className="font-semibold text-base ">
          Use your Email Or other service to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 px-0 pb-0">
        <form onSubmit={onPassword} className="space-y-3">
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={pending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          {!!error && (
            <div className="flex items-center bg-destructive/15 p-3 text-sm gap-x-2 text-destructive my-6">
              <TriangleAlert size={16} />
              <p>{error}</p>
            </div>
          )}
          <Button
            type="submit"
            className="w-full font-semibold"
            size="lg"
            disabled={pending}
            onClick={() => {}}
          >
            Continue
          </Button>
        </form>
        <Separator />
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full gap-1 relative font-semibold"
            size="lg"
            disabled={pending}
            onClick={() => onAuthProvider("google")}
          >
            <FcGoogle size={20} className="absolute left-3" /> Continue With
            Google
          </Button>
          <Button
            variant="outline"
            className="w-full gap-1 relative font-semibold"
            size="lg"
            disabled={pending}
            onClick={() => onAuthProvider("github")}
          >
            <FaGithub size={20} className="absolute left-3" /> Continue With
            Github
          </Button>
        </div>
        <p className="font-semibold pt-2">
          Already Have An Account.
          <span
            onClick={() => setState("signUp")}
            className="font-bold cursor-pointer pl-1 hover:underline "
          >
            Sign Up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
