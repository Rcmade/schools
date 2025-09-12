"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getInitials } from "@/lib/utils/stringUtils";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import LoginButton from "./LoginButton";

export const UserButton = () => {
  const user = useCurrentUser();
  const router = useRouter();

  const onClick = async () => {
    await signOut({ callbackUrl: "/" });
    router.refresh();
  };

  return (
    <React.Fragment key={`user-${user?.id}`}>
      {user?.id ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="bg-primary text-primary-foreground size-10 rounded-full cursor-pointer">
            {getInitials(user?.name || "Unknown ")}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 space-y-2" align="end">
            <DropdownMenuItem
              onClick={onClick}
              className="flex cursor-pointer gap-4"
              asChild
            >
              <Button
                type="button"
                className="flex w-full justify-start hover:border-destructive"
                variant="ghost"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <LoginButton />
      )}
    </React.Fragment>
  );
};
