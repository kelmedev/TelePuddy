'use client'

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  AlertTitle,
} from "@mui/material";

import { Google } from "@mui/icons-material";


import LoadingButton from "@mui/lab/LoadingButton";

import { authenticationServiceWithCredentials } from "@/_services/AUTHENTICATION";


export function LoginForm() {
  const { register, handleSubmit, errors, error, onSubmit, signInWithGoogle } =
    authenticationServiceWithCredentials();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    await onSubmit(data);
    setLoading(false);
  };

  return (
    <Box
      p={4}
      bgcolor="white"
      borderRadius={2}
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Typography variant="h5" component="div" gutterBottom>
        <strong>Entrar</strong>
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Faça login e explore nossas ferramentas inovadoras
      </Typography>
      {error === "CredentialsSignin" && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Erro de Autenticação</AlertTitle>
          As credenciais fornecidas são inválidas.
        </Alert>
      )}
      <Box flex={1}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Senha"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{ mb: 2 }}
          />
          {loading && (
            <>
              <LoadingButton
                loading
                variant="contained"
                size="large"
                color="primary"
                fullWidth
              >
                Submit
              </LoadingButton>
            </>
          )}

          {!loading && (
            <>
              <Button
                type="submit"
                size="large"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                Entrar
              </Button>
            </>
          )}
        </form>
      </Box>
      <Box mt={2} display="flex" justifyContent="center">
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Google />}
          fullWidth
          sx={{ borderRadius: 2 }}
          onClick={signInWithGoogle}
        >
          Continuar com Google
        </Button>
      </Box>
    </Box>
  );
}
