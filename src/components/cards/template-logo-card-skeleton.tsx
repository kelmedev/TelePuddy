import React from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  Skeleton,
} from "@mui/material";

export function TemplateLogoCardSkeleton() {
  return (
    <Box flex="0 1 240px" maxWidth="300px">
      <Card>
        <CardActionArea>
          <Skeleton variant="rectangular" height={200} />
        </CardActionArea>
        <CardActions className="flex items-center justify-center">
          <Skeleton variant="text" width={80} height={36} />
          <Skeleton variant="text" width={80} height={36} />
        </CardActions>
      </Card>
    </Box>
  );
}
