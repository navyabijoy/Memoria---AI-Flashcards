"use client";

import { SignIn, useAuth } from "@clerk/nextjs";

export default function Home() {
  const { sessionId } = useAuth();

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-black">
      <SignIn fallbackRedirectUrl={'/dashboard'} />
    </div>
  );
}