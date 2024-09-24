"use client";

import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";

import ToggleButton from "@/components/ToggleButton";
import ActionButton from "@/components/ActionButton";
import AudioIndicator from "@/components/AudioIndicator";

export default function MeetingPage() {
	const [isCameraOn, setIsCameraOn] = useState(true);
	const [isMicOn, setIsMicOn] = useState(true);
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (isCameraOn && videoRef.current) {
			navigator.mediaDevices
				.getUserMedia({ video: true })
				.then((stream) => {
					videoRef.current!.srcObject = stream;
				})
				.catch((err) => {
					console.error("Error accessing camera: ", err);
				});
		} else if (videoRef.current) {
			const stream = videoRef.current.srcObject as MediaStream;
			const tracks = stream?.getTracks();
			tracks?.forEach((track) => track.stop());
			videoRef.current.srcObject = null;
		}
	}, [isCameraOn]);

	const handleToggleCamera = () => {
		setIsCameraOn((prev) => !prev);
	};

	const handleToggleMic = () => {
		setIsMicOn((prev) => !prev);
	};

	const handleJoinMeeting = () => {
		// Lógica para entrar na reunião
		console.log("Joining meeting...");
	};

	const handleCancelMeeting = () => {
		// Lógica para cancelar a reunião
		console.log("Cancelling meeting...");
	};

	return (
		<div className="flex flex-col justify-center items-center h-screen gap-8 ">
			<Typography variant="h5" className="mb-4">
				Entrar na consulta
			</Typography>
			<div className="flex flex-col items-center max-w-[520px] w-full px-12 relative">

				<video
					ref={videoRef}
					autoPlay
					className="w-full max-w-[32rem] h-[16rem] bg-black mb-4 object-cover transform scale-x-[-1] rounded-2xl"
				/>
				
				<div className="items-center absolute flex gap-2 bottom-16 ">
					<ToggleButton
						type="camera"
						onClick={handleToggleCamera}
						isActive={isCameraOn}
					/>
					<ToggleButton
						type="mic"
						onClick={handleToggleMic}
						isActive={isMicOn}
					/>
				</div>
				<div className=" absolute flex gap-2 right-12">
				
					<AudioIndicator isActive={isMicOn} />
				</div>

				<div className="flex flex-row gap-4 w-full">
				

					<div className="flex flex-row gap-2 w-full">
						<Button
							onClick={handleJoinMeeting}
							variant="contained"
							href="/home/appointment"
							className="w-full"
						>
							Entrar
						</Button>
						<Button
							onClick={handleCancelMeeting}
							variant="contained"
							color="error"
							href="/home"
							className="w-full"
						>
							Cancelar
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
