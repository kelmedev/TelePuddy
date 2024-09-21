'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import ToggleButton from '@/components/ToggleButton';
import ActionButton from '@/components/ActionButton';

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
    <Box className="flex flex-col justify-center items-center h-screen">
      <Typography variant="h4" className="mb-4">
        Reunião com o Médico
      </Typography>
      <Box className="flex flex-col items-center">
        <video ref={videoRef} autoPlay className="w-full h-64 bg-black mb-4" />
        <ToggleButton
          onClick={handleToggleCamera}
          label={isCameraOn ? 'Desligar Câmera' : 'Ligar Câmera'}
          isActive={isCameraOn}
        />
        <ToggleButton
          onClick={handleToggleMic}
          label={isMicOn ? 'Desligar Microfone' : 'Ligar Microfone'}
          isActive={isMicOn}
        />
        <ActionButton onClick={handleJoinMeeting} label="Entrar" color="primary" />
        <ActionButton onClick={handleCancelMeeting} label="Cancelar" color="secondary" />
      </Box>
    </Box>
  );
}