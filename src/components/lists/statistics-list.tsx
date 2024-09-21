import { Language, Public, Link } from "@mui/icons-material";
import { Box } from "@mui/material";
import { StatisticCard } from "../cards/statistics-card";

export const StatisticsList = () => {
  return (
    <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
      <StatisticCard
        icon={<Language sx={{ fontSize: 30 }} />}
        title="Meus sites"
        value={5}
        iconBgColor="bg-blue-500"
      />
      <StatisticCard
        icon={<Public sx={{ fontSize: 30 }} />}
        title="Domínios"
        value={5}
        iconBgColor="bg-green-500"
      />
      <StatisticCard
        icon={<Link sx={{ fontSize: 30 }} />}
        title="Logos"
        value={2}
        iconBgColor="bg-purple-500"
      />
    </Box>
  );
};
