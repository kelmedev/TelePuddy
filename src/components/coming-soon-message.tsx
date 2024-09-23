import { Box, Typography } from "@mui/material";

export const ComingSoonMessage = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#e3f2fd",
        padding: 3,
        textAlign: "center",
        borderRadius: 2,
      }}
    >
      <Typography variant="body2" color="#1976d2">
        Coming Soon...
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Estamos trabalhando nisso
      </Typography>
    </Box>
  );
};