import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import ReactQuesryProvider from "./ReactQuesryProvider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { fileRouter } from "./api/uploadthing/core";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Tech-Tribe",
    default: "Tech-Tribe",
  },
  description:
    "Join Tech-Tribe, the ultimate social media platform for developers! Connect with fellow tech enthusiasts, share your projects, and collaborate on innovative ideas. Whether you're a seasoned professional or a coding beginner, Tech-Tribe is your go-to community for inspiration, support, and networking in the world of technology. Dive into discussions, showcase your skills, and discover the latest trends in development. Become a part of the Tech-Tribe today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
        <ReactQuesryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Toaster />
        </ReactQuesryProvider>
        <Analytics />
      </body>
    </html>
  );
}
