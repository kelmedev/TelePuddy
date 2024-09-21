"use client";

import React from "react";

import { useSession } from "next-auth/react";

import Skeleton from "@mui/material/Skeleton";

export function UserGreeting() {
  const { data: session, status } = useSession();

  const getUserName = () => {
    const fullName = session?.user?.name || "";
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts[nameParts.length - 1] || "";
    return `${firstName} ${lastName}`;
  };

  return (
    <div className="block">
      <div className="flex flex-col gap-3">
        {status === "loading" ? (
          <Skeleton variant="text" width={200} height={40} />
        ) : (
          <h2 className="text-3xl font-bold text-[#1a1b25]">
            Painel - {getUserName()}
          </h2>
        )}
      </div>
    </div>
  );
}
