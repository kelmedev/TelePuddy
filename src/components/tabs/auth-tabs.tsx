import { ComingSoonMessage } from "@/components/coming-soon-message";
import { SignInForm } from "@/components/forms/sign-form";

import { Tabs, Tab, Typography } from "@mui/material";

import { useState } from "react";

import Image from "next/image";

export function AuthTabs() {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event: any, newValue: any) => {
    setTabValue(newValue);
  };

  return (
    <>
      <div className="flex items-center justify-center md:hidden">
        <Image
          width={300}
          height={300}
          src="/telepuddy-png-dark.png"
          alt="website-logo"
          className="mb-10"
        />
      </div>
      <Tabs
        value={tabValue}
        onChange={handleChange}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Sou veterinário" />
        <Tab label="Me cadastrar" />
      </Tabs>
      {tabValue === 0 ? <SignInForm /> : <ComingSoonMessage />}
      <Typography
        variant="body2"
        color="textSecondary"
        align="center"
        sx={{ marginTop: 2 }}
      >
        Uma distribuição de {" "} 🩵
        <a href="#" className="text-primary">
          Puddy
        </a>
      </Typography>
    </>
  );
}
