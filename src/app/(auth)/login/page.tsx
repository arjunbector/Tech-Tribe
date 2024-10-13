import { Metadata } from "next";
import React from "react";
import loginImage from "@/assets/login-image.jpg";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "./LoginForm";
export const metadata: Metadata = {
  title: "Sign Up",
};
const SignUpPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Log in to Tech Tribe</h1>
            <p className="text-muted-foreground">
              A place where all the <span className="italic">tech nerds</span>{" "}
              meet
            </p>
          </div>
          <div className="space-y-5">
            <LoginForm />
            <Link href="/signup" className="block text-center hover:underline">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
        <Image
          src={loginImage}
          alt=""
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
};

export default SignUpPage;
