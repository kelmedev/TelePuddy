import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Avatar,
  Input,
} from "@mui/material";
import { formatCrp } from "@/_utils/format-crp";
import { useTemplateStore } from "@/_stores/new-website-store";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

export function ComplementaryStep() {
  const { authorName, crp, email, instagram, workingHours, image, setFormData } = useTemplateStore();
  const [localCrp, setLocalCrp] = useState(crp);
  const [isCrpValid, setIsCrpValid] = useState(true);
  const [localEmail, setLocalEmail] = useState(email);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [localInstagram, setLocalInstagram] = useState(instagram);
  const [isInstagramValid, setIsInstagramValid] = useState(true);
  const [localWorkingHours, setLocalWorkingHours] = useState(workingHours);
  const [isWorkingHoursValid, setIsWorkingHoursValid] = useState(true);

  const [profilePicture, setProfilePicture] = useState<File | null>(image instanceof File ? image : null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(typeof image === "string" ? image : null);

  const handleAuthorNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ authorName: event.target.value });
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLocalEmail(value);
    setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
  };

  const handleCrpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = formatCrp(event.target.value);
    setLocalCrp(value);
    setIsCrpValid(/^\d{5}-\d{4}$/.test(value));
  };

  const handleInstagramChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalInstagram(event.target.value);
    setIsInstagramValid(/^@[\w.-]+$/.test(event.target.value));
  };

  const handleWorkingHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalWorkingHours(event.target.value);
    setIsWorkingHoursValid(event.target.value.trim() !== "");
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setProfilePicture(file);
  };

  useEffect(() => {
    if (profilePicture) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(profilePicture);
      setFormData({ image: profilePicture });
    } else if (profilePicturePreview) {
      setFormData({ image: profilePicturePreview });
    } else {
      setProfilePicturePreview(null);
    }
  }, [profilePicture, profilePicturePreview, setFormData]);

  useEffect(() => {
    setFormData({ crp: localCrp });
    setIsCrpValid(/^\d{5}-\d{4}$/.test(localCrp));
  }, [localCrp, setFormData]);

  useEffect(() => {
    setFormData({ email: localEmail });
    setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localEmail));
  }, [localEmail, setFormData]);

  useEffect(() => {
    setFormData({ instagram: localInstagram });
    setIsInstagramValid(/^@[\w.-]+$/.test(localInstagram));
  }, [localInstagram, setFormData]);

  useEffect(() => {
    setFormData({ workingHours: localWorkingHours });
    setIsWorkingHoursValid(localWorkingHours.trim() !== "");
  }, [localWorkingHours, setFormData]);

  return (
    <Box mt={5}>
      <Typography variant="h6">Informações complementares:</Typography>

      <Box display="flex" alignItems="center" mt={2} mb={3}>
        <Avatar
          alt="Foto de perfil"
          src={profilePicturePreview || ""}
          sx={{ width: 80, height: 80, mr: 2 }}
        />
        <label htmlFor="upload-profile-picture">
          <Input
            id="upload-profile-picture"
            type="file"
            sx={{ display: "none" }}
            onChange={handleProfilePictureChange}
          />
          <Button
            variant="contained"
            component="span"
            startIcon={<PhotoCameraIcon />}
          >
            Selecionar Foto
          </Button>
        </label>
      </Box>

      <TextField
        fullWidth
        label="Seu nome"
        name="authorName"
        value={authorName}
        onChange={handleAuthorNameChange}
        margin="normal"
      />

      <TextField
        fullWidth
        label="E-mail"
        name="email"
        value={localEmail}
        onChange={handleEmailChange}
        margin="normal"
        placeholder="exemplo@dominio.com"
        error={!isEmailValid}
        helperText={!isEmailValid ? "E-mail inválido ou vazio." : ""}
      />

      <TextField
        fullWidth
        label="CRP"
        name="crp"
        value={localCrp}
        onChange={handleCrpChange}
        margin="normal"
        inputProps={{ maxLength: 9 }}
        error={!isCrpValid}
        helperText={!isCrpValid ? "Exemplo: 12/345678" : ""}
      />

      <TextField
        fullWidth
        label="Instagram"
        name="instagram"
        value={localInstagram}
        onChange={handleInstagramChange}
        margin="normal"
        placeholder="@"
        inputProps={{ maxLength: 30 }}
        error={!isInstagramValid}
        helperText={!isInstagramValid ? "Instagram inválido. Exemplo: @usuario" : ""}
      />

      <TextField
        fullWidth
        label="Horário de atendimento"
        name="workingHours"
        value={localWorkingHours}
        onChange={handleWorkingHoursChange}
        margin="normal"
        placeholder="Das 13h até as 18:00h"
        error={!isWorkingHoursValid}
        helperText={!isWorkingHoursValid ? "Horário de atendimento não pode ficar vazio." : ""}
      />
    </Box>
  );
}
