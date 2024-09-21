import { FeatureItemProps } from "@/types/feature";

import { Box, Typography } from "@mui/material";

import React from "react";

export function FeatureItem({
  icon: Icon,
  title,
  description,
  iconColor,
}: FeatureItemProps) {
  return (
    <Box mb={3}>
      <Typography
        variant="h6"
        display="flex"
        alignItems="center"
        sx={{ mb: 1, color: "white", fontWeight: "bold" }}
      >
        <Icon sx={{ mr: 2, fontSize: 28, color: iconColor }} />
        {title}
      </Typography>
      <Typography variant="body2" color="white">
        {description}
      </Typography>
    </Box>
  );
}
