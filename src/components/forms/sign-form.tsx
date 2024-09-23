import { Button, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SignInFormValues, signInSchema } from "@/_schemas/auth-schema";
import { useRouter } from "next/navigation";

export const SignInForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: "onSubmit",
  });

  const { push } = useRouter();

  const onSubmit = (data: SignInFormValues) => {
    push("/home");
  };

  return (
    <>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="E-mail"
              placeholder="Digite seu e-mail"
              type="email"
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email?.message}
              required
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Senha"
              placeholder="Digite sua senha"
              type="password"
              variant="outlined"
              error={!!errors.password}
              helperText={errors.password?.message}
              required
            />
          )}
        />
        <Button
          variant="contained"
          size="large"
          type="submit"
          href="/home"
          sx={{
            borderRadius: 1,
            boxShadow: "none",
          }}
        >
          Entrar
        </Button>
      </form>
    </>
  );
};
