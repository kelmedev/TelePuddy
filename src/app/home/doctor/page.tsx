'use client';

import React, { useState } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import PetDemographics from '@/components/PetDemographics';
import ClinicDescription from '@/components/ClinicDescription';
import JoinMeetingButton from '@/components/JoinMeetingButton';
import Image from 'next/image';

export default function Page() {
  const [name] = useState('Pão de Queijo');
  const [species] = useState('Canino');
  const [breed] = useState('Labrador');
  const [age] = useState('3 anos');
  const [size] = useState('Grande');
  const [weight] = useState('30 kg');
  const [gender] = useState('Macho');
  const [description] = useState('O paciente apresenta sinais de artrite e dificuldade de locomoção.');

  const handleJoinMeeting = () => {
    // Lógica para entrar na reunião
    console.log('Joining meeting...');
  };

  return (

			<Box className="flex flex-col gap-12 justify-center items-center h-screen rounded-2xl">
				<Image src="/logo.png" alt="Logotipo Puddy" width="200" height="120" />
				<Card className="w-[60vh]">
					<CardContent>
						<Typography
							variant="h4"
							component="div"
							className="mb-4 font-black"
						>
							{name}
						</Typography>
						<PetDemographics
							species={species}
							breed={breed}
							age={age}
							size={size}
							weight={weight}
							gender={gender}
						/>
						<ClinicDescription description={description} />
						<JoinMeetingButton onClick={handleJoinMeeting} />
					</CardContent>
				</Card>
			</Box>
	
	);
}