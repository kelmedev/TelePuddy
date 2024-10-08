'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

import ToggleButton from "@/components/ToggleButton";
import ActionButton from "@/components/ActionButton";

export default function MeetingPage() {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isCameraOn && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoRef.current!.srcObject = stream;
        })
        .catch(err => {
          console.error('Error accessing camera: ', err);
        });
    } else if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream?.getTracks();
      tracks?.forEach(track => track.stop());
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
    console.log('Joining meeting...');
  };

  const handleCancelMeeting = () => {
    // Lógica para cancelar a reunião
    console.log('Cancelling meeting...');
  };

  return (
		<Box className="flex flex-col justify-center items-center h-screen gap-8">
			<Typography variant="h5" className="mb-4">
				Em chamada
			</Typography>
			<Box className="flex flex-col items-center w-[360px]">
				<video
					ref={videoRef}
					autoPlay
					className="w-[24rem] h-[14rem] bg-black mb-4 object-cover transform scale-x-[-1] rounded-2xl"
				/>
				<div className="flex-row flex gap-4">
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

        <Button>
          Sair
        </Button>
			
			</Box>
		</Box>
	);
}