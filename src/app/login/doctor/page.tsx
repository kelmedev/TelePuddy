'use client';

import React, { useState } from 'react';
import { Box, FormControl } from '@mui/material';  
import EmailField from '@/components/EmailField';
import PasswordField from '@/components/PasswordField';
import SubmitButton from '@/components/SubmitButton';
import { validateEmail, validatePassword } from '@/utils/validation';
import Image from "next/image";

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    if (id === 'email-input') {
      setEmail(value);
      setEmailError(validateEmail(value));
    } else if (id === 'password-input') {
      setPassword(value);
      setPasswordError(validatePassword(value));
    }
  };

  const handleSubmit = () => {
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);
    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);

    if (!emailValidationError && !passwordValidationError) {
      // Lógica de envio do formulário
      console.log('Formulário enviado com sucesso');
    }
  };

  return (
    <Box className="flex flex-col gap-12 justify-center items-center h-screen">
      <Image src="/logo.png" alt="Logotipo Puddy" width="200" height="120" />
      <Box className="w-[60vh]">
        <FormControl fullWidth>
          <EmailField email={email} emailError={emailError} onChange={handleChange} />
          <PasswordField password={password} passwordError={passwordError} onChange={handleChange} />
          <SubmitButton onClick={handleSubmit} />
        </FormControl>
      </Box>
    </Box>
  );
}