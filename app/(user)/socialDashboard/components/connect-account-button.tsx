"use client"

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

export function ConnectAccountButton({ onAccountConnected }: { onAccountConnected: (account: any) => void }) {
  const handleConnect = async (platform: string) => {
    const result = await signIn(`${platform}-dashboard`, { callbackUrl: "/dashboard" });
    if (result?.error) {
      console.error("Error connecting account:", result.error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Connect Account</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleConnect("facebook")}>
          <Facebook className="mr-2 h-4 w-4" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleConnect("instagram")}>
          <Instagram className="mr-2 h-4 w-4" />
          Instagram
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleConnect("youtube")}>
          <Youtube className="mr-2 h-4 w-4" />
          YouTube
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleConnect("twitter")}>
          <Twitter className="mr-2 h-4 w-4" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleConnect("linkedin")}>
          <Linkedin className="mr-2 h-4 w-4" />
          LinkedIn
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}