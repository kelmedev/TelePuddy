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
    <div className='grid md:grid-cols-3 grid-cols-2 gap-2'>
      <Typography><span className="font-bold">Espécie: </span>{species}</Typography>
      <Typography><span className="font-bold">Raça: </span>{breed}</Typography>
      <Typography><span className="font-bold">Idade: </span>{age}</Typography>
      <Typography><span className="font-bold">Porte: </span>{size}</Typography>
      <Typography><span className="font-bold">Peso: </span>{weight}</Typography>
      <Typography><span className="font-bold">Sexo: </span>{gender}</Typography>
    </div>
  );
};

export default PetDemographics;