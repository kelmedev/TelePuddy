import React from "react";
import { Button } from "@mui/material";
import Link from "next/link";

export function DomainManagementCard() {
  return (
    <div className="flex flex-col items-end w-full md:w-[380px]">
      <article className="flex flex-col border bg-white w-full h-[auto] mt-5 md:mt-0">
        <div className="flex items-center w-full h-10 pl-5 font-medium bg-purple-800">
          <h1 className="text-white">Gerenciar Domínios</h1>
        </div>
        <div className="flex flex-col gap-5 p-5 text-gray-600">
          <span className="text-sm">Navegue e gerencie seus domínios</span>
          <Link href='/home/domains'>
            <Button variant="contained" color="secondary">
              <span className="text-white">VER LISTA DE DOMÍNIOS</span>
            </Button>
          </Link>
        </div>
      </article>
    </div>
  );
}
