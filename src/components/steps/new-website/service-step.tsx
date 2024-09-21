import React, { useEffect } from "react";
import {
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

import { GetUserAddress } from "@/_services/GET_ADDRESS_USER";
import { useTemplateStore } from "@/_stores/new-website-store";
import { validateFields } from "@/_utils/format-address";

export function ServiceStep({
  onValidationChange,
}: {
  onValidationChange: (isValid: boolean) => void;
}) {
  const { cep, address, loading, handleCepChange, fetchAddress, setAddress } =
    GetUserAddress();
  const { serviceType, setFormData } = useTemplateStore();

  useEffect(() => {
    onValidationChange(validateFields(address, cep, serviceType));
  }, [cep, address, serviceType]);

  const handleServiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ serviceType: event.target.value });
  };

  const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^\d{0,4}$/.test(newValue)) {
      setAddress({ ...address, numero: newValue });
      setFormData({ address: { ...address, numero: newValue } });
    }
  };

  return (
    <Box mt={5}>
      <Typography variant="h6">Escolha o tipo de serviço</Typography>

      <FormControl component="fieldset">
        <RadioGroup
          aria-label="service"
          name="service"
          value={serviceType}
          onChange={handleServiceChange}
        >
          <FormControlLabel
            value="presencial"
            control={<Radio />}
            label="Presencial"
          />
          <FormControlLabel value="online" control={<Radio />} label="Online" />
          <FormControlLabel value="ambos" control={<Radio />} label="Ambos" />
        </RadioGroup>
      </FormControl>

      {(serviceType === "presencial" || serviceType === "ambos") && (
        <>
          <TextField
            fullWidth
            label="Digite o CEP"
            name="cep"
            value={cep}
            onChange={handleCepChange}
            margin="normal"
            inputProps={{ maxLength: 9 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={fetchAddress}
            style={{ marginTop: "16px" }}
            disabled={!!loading}
          >
            {loading ? <CircularProgress size={24} /> : "Buscar"}
          </Button>

          {address.rua && (
            <Box mt={2}>
              <TextField
                fullWidth
                label="Rua"
                value={address.rua}
                margin="normal"
                disabled
              />
              <TextField
                fullWidth
                label="Número"
                value={address.numero}
                margin="normal"
                onChange={handleNumeroChange}
                inputProps={{ maxLength: 4 }}
              />
              <TextField
                fullWidth
                label="Bairro"
                value={address.bairro}
                margin="normal"
                disabled
              />
              <TextField
                fullWidth
                label="Cidade"
                value={address.cidade}
                margin="normal"
                disabled
              />
              <TextField
                fullWidth
                label="Estado"
                value={address.estado}
                margin="normal"
                disabled
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
