'use client'

import React from 'react';
import { Box, Typography } from '@mui/material';

interface PetDemographicsProps {
  species: string;
  breed: string;
  age: string;
  size: string;
  weight: string;
  gender: string;
}

const PetDemographics: React.FC<PetDemographicsProps> = ({ species, breed, age, size, weight, gender }) => {
  return (
    <Box>
      <Typography variant="h6">Dados Demográficos</Typography>
      <Typography>Espécie: {species}</Typography>
      <Typography>Raça: {breed}</Typography>
      <Typography>Idade: {age}</Typography>
      <Typography>Porte: {size}</Typography>
      <Typography>Peso: {weight}</Typography>
      <Typography>Sexo: {gender}</Typography>
    </Box>
  );
};

export default PetDemographics;