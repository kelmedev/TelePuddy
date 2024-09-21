'use client'

import React, { useState } from 'react';
import { Box, FormControl, TextField, Button } from '@mui/material';

const Page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Email inválido');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError('Senha não pode estar vazia');
    } else {
      setPasswordError('');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    if (id === 'simple-select-required') {
      setEmail(value);
      validateEmail(value);
    } else if (id === 'simple-select-password') {
      setPassword(value);
      validatePassword(value);
    }
  };

  const handleSubmit = () => {
    validateEmail(email);
    validatePassword(password);
    if (!emailError && !passwordError) {
      // Lógica de envio do formulário
      console.log('Formulário enviado com sucesso');
    }
  };

  return (
    <Box>
      <Box className="w-[60vh] flex flex-center">
        <FormControl fullWidth>
          <TextField
            id="simple-select-required"
            value={email}
            label="Email"
            onChange={handleChange}
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            id="simple-select-password"
            value={password}
            label="Senha"
            type="password"
            onChange={handleChange}
            error={!!passwordError}
            helperText={passwordError}
          />
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Enviar
          </Button>
        </FormControl>
      </Box>
    </Box>
  );
};

export default Page;