import React from 'react';
import { Box, Typography } from '@mui/material';

interface ClinicDescriptionProps {
  description: string;
}

const ClinicDescription: React.FC<ClinicDescriptionProps> = ({ description }) => {
  return (
    <Box mt={2}>
      <Typography variant="h6">Descrição do paciente</Typography>
      <Typography>{description}</Typography>
    </Box>
  );
};

export default ClinicDescription;