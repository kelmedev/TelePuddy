"use client";

import LogoutIcon from "@mui/icons-material/Logout";
import { Button, Avatar } from "@mui/material";
import Image from "next/image";

export function Header() {
  return (
    <>
      <header className="bg-white h-16 w-full flex items-center justify-between pr-3 pl-3 md:pr-10 md:pl-10">
        <Image
          src="/telepuddy-png-dark.png"
          alt="website-logo"
          width={100}
          height={100}
        />
        <div className="flex items-center gap-2">
          <Button variant="text" startIcon={<LogoutIcon />} />
          <Avatar alt="User Name" src="https://api.dicebear.com/9.x/fun-emoji/svg?seed=Caleb" />
        </div>
      </header>
    </>
  );
}
