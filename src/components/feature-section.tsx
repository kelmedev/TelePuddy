import { Box } from "@mui/material";

import { FeatureItem } from "./feature-item";

import { FeaturesOptions } from "@/components/options/features-options";

export function FeatureSection() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      p={3}
      bgcolor="rgba(0, 0, 0, 0.2)"
      borderRadius={2}
      height="100%"
    >
      {FeaturesOptions.map((feature, index) => (
        <FeatureItem
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          iconColor={feature.iconColor}
        />
      ))}
    </Box>
  );
}
