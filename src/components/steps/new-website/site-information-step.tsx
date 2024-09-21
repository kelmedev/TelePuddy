import UploadIcon from "@mui/icons-material/Upload";

import React, { useState, useEffect } from "react";

import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

import { TemplateLogoCard } from "@/components/cards/template-logo-card";
import { TemplateLogoCardSkeleton } from "@/components/cards/template-logo-card-skeleton";

import { _GET_ALL_LOGOS_TEMPLATES } from "@/_services/GET_ALL_LOGOS_TEMPLATES";

import { useTemplateStore } from "@/_stores/new-website-store";
import { useMutation, useQueryClient } from "react-query";
import { useSession } from "next-auth/react";

import api from "@/_services/API";

export function SiteInformationStep() {
  const { data, isLoading, isError } = _GET_ALL_LOGOS_TEMPLATES();
  const queryClient = useQueryClient();
  const { setFormData, selectedTemplateId, siteName } = useTemplateStore();
  const { data: session } = useSession();
  const token = session?.authorization;

  const [localSiteName, setLocalSiteName] = useState(siteName || "");
  const [localSelectedLogoId, setLocalSelectedLogoId] = useState<number | null>(
    selectedTemplateId || null
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleSiteNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSiteName(event.target.value);
  };

  const handleLogoSelect = (logoId: number) => {
    setLocalSelectedLogoId(logoId);
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post("/image/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const mutation = useMutation(uploadImage, {
    onMutate: () => {
      setIsUploading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("get-all-logos-templates");
      setIsUploading(false);
    },
    onError: () => {
      setIsUploading(false);
    },
  });

  const handleCustomLogoUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      mutation.mutate(file);
    }
  };

  useEffect(() => {
    setFormData({
      siteName: localSiteName,
    });
  }, [localSiteName, setFormData]);

  useEffect(() => {
    setFormData({
      selectedTemplateId: localSelectedLogoId,
    });
  }, [localSelectedLogoId, setFormData]);

  if (isError) {
    return <Typography>Erro ao carregar logos.</Typography>;
  }

  return (
    <Box mt={5}>
      <Typography variant="h6">Informações do seu site</Typography>
      <TextField
        fullWidth
        label="Nome do Site"
        name="siteName"
        value={localSiteName}
        onChange={handleSiteNameChange}
        margin="normal"
      />

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mt={2}
      >
        <Button
          variant="outlined"
          component="label"
          startIcon={
            isUploading ? <CircularProgress size={20} /> : <UploadIcon />
          }
          disabled={isUploading}
        >
          {isUploading ? "Enviando..." : "Usar minha própria logo"}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleCustomLogoUpload}
          />
        </Button>
      </Box>
      <Typography mt={3} variant="h6">
        Ou escolha seus projetos
      </Typography>

      <Box mt={4} display="flex" flexWrap="wrap" gap={3}>
        {isLoading
          ? Array.from(new Array(3)).map((_, index) => (
              <TemplateLogoCardSkeleton key={index} />
            ))
          : data?.data?.map((logo: any) => (
              <TemplateLogoCard
                key={logo.id}
                imageSrc={logo.url}
                onSelect={() => handleLogoSelect(logo.id)}
                isSelected={localSelectedLogoId === logo.id}
              />
            ))}
      </Box>
    </Box>
  );
}
