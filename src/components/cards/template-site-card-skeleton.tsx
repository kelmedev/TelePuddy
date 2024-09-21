import React from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Skeleton,
  Button,
  Box,
} from "@mui/material";

export function TemplateCardSkeleton() {
  return (
    <Box key={1} flex="0 1 270px" maxWidth="400px" marginTop={10}>
      <Skeleton variant="rectangular" width={270} height={150} />
      <Skeleton width="60%" />
      <Skeleton width="80%" />
      <Skeleton width="50%" />
    </Box>
  );
}
