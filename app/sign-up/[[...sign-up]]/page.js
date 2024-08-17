"use client"

import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-black overflow-x-hidden">
      <div className="mt-20">
        <SignUp />
      </div>
    </div>
  )
}