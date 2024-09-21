"use client";

import { useState } from "react";
import { Toolbar, Typography, Button, IconButton, Avatar } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import HomeIcon from "@mui/icons-material/Home";
import DomainIcon from "@mui/icons-material/Domain";
import EmailIcon from "@mui/icons-material/Email";
import LinkIcon from "@mui/icons-material/Link";
import { signOut } from "next-auth/react";
import { SignOutDialog } from "../dialogs/sign-out-dialog";
import Link from "next/link";

interface ToolBarProps {
  isLinks: boolean;
}

export function ToolBar({ isLinks }: ToolBarProps) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmSignOut = () => {
    setOpen(false);
    signOut();
  };

  return (
    <>
      <div className="flex items-center w-full bg-white sticky top-0 z-10 border border-b-2">
        <Toolbar className="flex justify-between w-full">
          <div className="flex items-center gap-3">
            <Typography variant="h6" noWrap>
              <div className="relative max-w-[400px] w-[240px]">
                <img
                  src="/svg/logo.svg"
                  alt="logo"
                  className="max-w-40 relative"
                />
              </div>
            </Typography>
          </div>

          <div className="flex items-center gap-4">
            <IconButton aria-label="notifications">
              <NotificationsNoneIcon sx={{ fontSize: 24, color: "gray" }} />
            </IconButton>

            <Button
              variant="text"
              color="primary"
              startIcon={<ExitToAppIcon sx={{ fontSize: 24 }} />}
              onClick={handleClickOpen}
            >
              <span className="hidden md:block">DESCONECTAR</span>
            </Button>
          </div>
        </Toolbar>

        <SignOutDialog
          open={open}
          onClose={handleClose}
          onConfirm={handleConfirmSignOut}
        />
      </div>

      {isLinks && (
        <div className="flex items-center bg-white">
          <div className="flex items-center space-x-5 px-3 h-[50px] bg-white">
            <Link href="/home" passHref>
              <Button variant="text" startIcon={<HomeIcon />}>
                HOME
              </Button>
            </Link>

            <Link href="/home/domains" passHref>
              <Button variant="text" startIcon={<DomainIcon />}>
                DOMINÍOS
              </Button>
            </Link>

            <Link href="/home/emails" passHref>
              <Button variant="text" startIcon={<EmailIcon />}>
                EMAILS
              </Button>
            </Link>

            <Link href="/home/links" passHref>
              <Button variant="text" startIcon={<LinkIcon />}>
                MEUS LINKS
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
