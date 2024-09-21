import React from "react";
import { TextField } from "@mui/material";

interface EmailFieldProps {
	email: string;
	emailError: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmailField: React.FC<EmailFieldProps> = ({
	email,
	emailError,
	onChange,
}) => {
	return (
		<TextField
			id="email-input"
			value={email}
			label="Email"
			onChange={onChange}
			error={!!emailError}
			helperText={emailError}
			margin="normal"
      required
		/>
	);
};

export default EmailField;
