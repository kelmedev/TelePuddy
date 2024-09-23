"use client";

import React from "react";
import { Button } from "@mui/material";
import { Camera, CameraOff, Mic, MicOff } from "lucide-react";

interface ToggleButtonProps {
	onClick: () => void;
	isActive: boolean;
	type: "camera" | "mic";
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
	onClick,
	isActive,
	type,
}) => {
	const iconSize = 24; // Define o tamanho do ícone

	const getIcon = () => {
		if (type === "camera") {
			return isActive ? (
				<Camera size={iconSize} />
			) : (
				<CameraOff size={iconSize} />
			);
		} else if (type === "mic") {
			return isActive ? <Mic size={iconSize} /> : <MicOff size={iconSize} />;
		}
	};

	return (
		<Button
			onClick={onClick}
			className="w-[48px] h-[48px] flex justify-center items-center"
			variant="contained"
			color={isActive ? "primary" : "error"}
			sx={{
				mt: 2,
				borderRadius: "9999px",
				padding: 0,
				minWidth: 0,
			}}
		>
			{getIcon()}
		</Button>
	);
};

export default ToggleButton;
