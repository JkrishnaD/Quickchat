"use client"

import { useState } from "react";
import { SignInFlow } from "../types";
import { SignInCard } from "./signin-card";
import { SignUpCard } from "./signup-card";

export const Authscreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn");

  return (
    <div className="h-screen flex justify-center items-center text-center bg-[#b561d9]">
      <div className="md:h-auto md:w-[420px] text-white">
        {state === "signIn" ? <SignInCard setState={setState} /> : <SignUpCard setState={setState} />}
      </div>
    </div>
  );
};
