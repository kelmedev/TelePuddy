'use client'

import React from "react";
import { Button } from "@mui/material";

interface JoinMeetingButtonProps {
	onClick: () => void;
}

const JoinMeetingButton: React.FC<JoinMeetingButtonProps> = ({ onClick }) => {
	return (
		<Button
			className="w-full"
			onClick={onClick}
			variant="contained"
			color="primary"
			href="/doctor/appointment"
			sx={{
				mt: 2,
				borderRadius: "9999px",
				paddingX: 3,
				paddingY: 1.5,
				fontSize: "1.125rem",
			}}
		>
			Entrar agora
		</Button>
	);
};

export default JoinMeetingButton;
