"use client";

import React, { useState } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import PetDemographics from "@/components/PetDemographics";
import ClinicDescription from "@/components/ClinicDescription";
import JoinMeetingButton from "@/components/JoinMeetingButton";
import Image from "next/image";

export default function Page() {
	const [name] = useState("Doguinho");
	const [species] = useState("Canino");
	const [breed] = useState("Labrador");
	const [age] = useState("3 anos");
	const [size] = useState("Grande");
	const [weight] = useState("30 kg");
	const [gender] = useState("Macho");
	const [description] = useState(
		"O paciente apresenta sinais de artrite e dificuldade de locomoção."
	);

	const handleJoinMeeting = () => {
		// Lógica para entrar na reunião
		console.log("Joining meeting...");
	};

	return (
		<div className="flex flex-col gap-12 justify-center items-center h-screen bg-background px-2 md:px-72">
		
			<Card className="max-w-[520px] w-full">
				<CardContent className="flex flex-col gap-4">
					<div className="flex flex-row gap-4">
					<Image
						src="/petIcon.png"
						alt="Logotipo Puddy"
						width="96"
						height="96"
						className="rounded-full w-[96px] h-[96px]"
					/>
					<div className="flex flex-col gap-2 align-middle">

					<Typography variant="h6" component="div" className="mb-4">
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
					</div>
					</div>
					<ClinicDescription description={description} />

					<Button
						onClick={handleJoinMeeting}
						variant="contained"
						color="primary"
						className="w-full text-white"
						href="/home/appointment/config"
						sx={{ color: "white" }}
					>
						Atender
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
