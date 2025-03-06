"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { PartyPopperIcon } from "lucide-react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useMemo } from "react";

import { Button } from "./ui/button";

const routeButtonConfig: Record<string, Array<string>> = {
  default: ["sign-in", "sign-up"],
  "sign-up": ["sign-in", "contact"],
  "sign-in": ["sign-up", "contact"],
} as const;

export const Header = () => {
  const segment = useSelectedLayoutSegment();

  const renderButtons = useMemo(() => {
    const buttons = routeButtonConfig[segment ?? "default"];
    return buttons?.map((button) => {
      switch (button) {
        case "sign-in":
          return (
            <SignInButton key="sign-in">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </SignInButton>
          );
        case "sign-up":
          return (
            <SignUpButton key="sign-up">
              <Button variant={segment ? "outline" : "default"} size="sm">
                Sign Up
              </Button>
            </SignUpButton>
          );
        case "contact":
          return (
            <Button size="sm" key="contact" asChild>
              <Link href="/contact">Contact</Link>
            </Button>
          );
        default:
          return null;
      }
    });
  }, [segment]);

  return (
    <header className="bg-background sticky top-0 z-10 w-full px-4 shadow-sm md:px-6">
      <div className="container mx-auto flex h-20 items-center">
        <Link href="/" className="mr-6" prefetch={false}>
          <PartyPopperIcon />
          <span className="sr-only">Event Linker</span>
        </Link>
        <div className="ml-auto flex gap-2">
          <SignedOut>{renderButtons}</SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};
