import React from 'react';
import { TextField } from '@mui/material';

interface PasswordFieldProps {
  password: string;
  passwordError: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ password, passwordError, onChange }) => {
  return (
    <TextField
      id="password-input"
      value={password}
      label="Senha"
      type="password"
      onChange={onChange}
      error={!!passwordError}
      helperText={passwordError}
      margin="normal"
      required
    />
  );
};

export default PasswordField;