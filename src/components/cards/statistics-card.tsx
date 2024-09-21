import { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

interface StatisticCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  iconBgColor: string;
}

export const StatisticCard = ({
  icon,
  title,
  value,
  iconBgColor,
}: StatisticCardProps) => {
  return (
    <Box className="bg-white border rounded-lg p-4 flex items-center gap-4">
      <Box className={`p-2 ${iconBgColor} text-white rounded-full`}>{icon}</Box>
      <Box>
        <Typography variant="button" className="text-gray-700 font-semibold">
          {title}
        </Typography>
        <Typography variant="h6" className="font-bold">
          {value}
        </Typography>
      </Box>
    </Box>
  );
};
