"use client";

import { useState } from "react";
import {
  Tabs,
  Tab,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  IconButton,
} from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { SitesTable } from "../tables/sites-table";
import { LogosTable } from "../tables/logos-table";
import { useRouter } from "next/navigation";
import { TemplateLogoCard } from "../cards/template-logo-card";

import { TemplateLogoCardSkeleton } from "../cards/template-logo-card-skeleton";
import { _GET_ALL_LOGOS_TEMPLATES_EDITOR } from "@/_services/GET_ALL_LOGOS_TEMPLATES_EDITOR";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import api from "@/_services/API";

export const ClientTabNavigation = () => {
  const { data, isLoading } = _GET_ALL_LOGOS_TEMPLATES_EDITOR();

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTabIndex, setDialogTabIndex] = useState(0);
  const [logoData, setLogoData] = useState({
    title: "",
    type: "",
    height: "",
    width: "",
    siteName: "",
    searchTemplate: "",
  });

  const { data: session } = useSession();

  const token = session?.authorization;

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const [errors, setErrors] = useState({
    title: false,
    type: false,
    height: false,
    width: false,
  });

  const { push } = useRouter();

  const handleAddNewButtonClick = () => {
    if (activeTabIndex === 1) {
      setOpenDialog(true);
    } else {
      push("/website");
    }
  };

  const SendFormAndCreateProjectWithTemplate = async (data: any) => {
    try {
      const templateResponse = await api.get(
        `/editor/templates/${data.templateId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const templateJson = templateResponse.data.json;

      const createProjectResponse = await api.post(
        "/editor/add-project",
        {
          name: data.name,
          type: data.type,
          width: data.width,
          height: data.height,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const projectId = createProjectResponse.data.id;

      await api.put(
        `/editor/update-project/${projectId}`,
        {
          json: templateJson,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Sucesso",
        text: "O elemento foi criado e atualizado com sucesso!",
      });

      push(`/canva/${projectId}`);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Houve um problema ao criar o elemento.",
      });
    }
  };

  const SendFormAndCreateProjectWithCustom = async (data: any) => {
    try {
      const createProjectResponse = await api.post(
        "/editor/add-project",
        {
          name: data.name,
          type: data.type,
          width: data.width,
          height: data.height,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const projectId = createProjectResponse.data.id;

      Swal.fire({
        icon: "success",
        title: "Sucesso",
        text: "O elemento foi criado e atualizado com sucesso!",
      });

      push(`/canva/${projectId}`);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Houve um problema ao criar o elemento.",
      });
    }
  };

  const handleDialogClose = () => setOpenDialog(false);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "height" || name === "width") {
      if (!/^\d*$/.test(value)) return;
    }

    setLogoData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    const newErrors = {
      title: logoData.title.trim() === "",
      type: logoData.type.trim() === "",
      height: logoData.type === "custom" && logoData.height.trim() === "",
      width: logoData.type === "custom" && logoData.width.trim() === "",
    };
    setErrors(newErrors);
    return (
      !newErrors.title &&
      !newErrors.type &&
      !newErrors.height &&
      !newErrors.width
    );
  };

  const handleSubmit = () => {
    if (dialogTabIndex === 0 && validateFields()) {
      let data = {};

      if (logoData.type === "logo") {
        data = {
          name: logoData.title,
          height: 500,
          width: 500,
          type: "logo",
        };
      }

      if (logoData.type === "visit-card") {
        data = {
          name: logoData.title,
          height: 600,
          width: 1500,
          type: "visit-card",
        };
      }

      if (logoData.type === "custom") {
        data = {
          name: logoData.title,
          height: logoData.height,
          width: logoData.width,
          type: "custom",
        };
      }

      SendFormAndCreateProjectWithCustom(data);

      setOpenDialog(false);
    } else if (dialogTabIndex === 1) {
      if (selectedTemplate && logoData.siteName.trim()) {
        if (data && data.templates) {
          const selectedTemplateData = data.templates.find(
            (template: any) => template.id === selectedTemplate
          );

          if (selectedTemplateData) {
            const data = {
              templateId: selectedTemplate,
              name: logoData.siteName,
              height: selectedTemplateData.height,
              width: selectedTemplateData.width,
              type: selectedTemplateData.type,
            };

            SendFormAndCreateProjectWithTemplate(data);

            setOpenDialog(false);
          }
        } else {
          alert("Dados dos templates não carregados corretamente.");
        }
      } else {
        alert("Selecione um Template ou Insira nome do site.");
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mt-5">
        <Tabs
          value={activeTabIndex}
          onChange={(_, newTabIndex) => setActiveTabIndex(newTabIndex)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Meus Sites" />
          <Tab label="Identidade Visual" />
        </Tabs>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          sx={{ textTransform: "none", paddingBottom: 1 }}
          onClick={handleAddNewButtonClick}
        >
          {activeTabIndex === 0 ? "Adicionar novo site" : "Adicionar nova logo"}
        </Button>
      </div>

      <Box className="flex flex-col mt-6">
        <Box className="mt-4">
          {activeTabIndex === 0 ? <SitesTable /> : <LogosTable />}
        </Box>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Criar nova Identidade Visual</DialogTitle>
        <DialogContent>
          <Tabs
            value={dialogTabIndex}
            onChange={(_, newTabIndex) => setDialogTabIndex(newTabIndex)}
            indicatorColor="primary"
            textColor="primary"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="Customizar" />
            <Tab label="Usar Template" />
          </Tabs>
          <Box sx={{ padding: 2 }}>
            {dialogTabIndex === 0 && (
              <Box component="form" noValidate autoComplete="off">
                <TextField
                  fullWidth
                  margin="normal"
                  label="Título da Logo"
                  name="title"
                  value={logoData.title}
                  onChange={handleInputChange}
                  error={errors.title}
                  helperText={
                    errors.title ? "O título da logo não pode estar vazio" : ""
                  }
                />
                <FormControl fullWidth margin="normal" error={errors.type}>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    name="type"
                    value={logoData.type}
                    onChange={handleInputChange}
                    label="Tipo"
                  >
                    <MenuItem value="">Selecione um tipo</MenuItem>
                    <MenuItem value="logo">Logo</MenuItem>
                    <MenuItem value="visit-card">Cartão de Visita</MenuItem>
                    <MenuItem value="custom">Personalizado</MenuItem>
                  </Select>
                  {errors.type && (
                    <Box color="error.main" mt={1}>
                      O tipo não pode estar vazio
                    </Box>
                  )}
                </FormControl>

                {logoData.type === "custom" && (
                  <Box display="flex" gap={2} marginBottom={2}>
                    <TextField
                      fullWidth
                      label="Altura"
                      name="height"
                      value={logoData.height}
                      onChange={handleInputChange}
                      error={errors.height}
                      helperText={errors.height ? "Altura é obrigatória" : ""}
                    />
                    <TextField
                      fullWidth
                      label="Largura"
                      name="width"
                      value={logoData.width}
                      onChange={handleInputChange}
                      error={errors.width}
                      helperText={errors.width ? "Largura é obrigatória" : ""}
                    />
                  </Box>
                )}
              </Box>
            )}
            {dialogTabIndex === 1 && (
              <Box component="form" noValidate autoComplete="off">
                <TextField
                  fullWidth
                  margin="normal"
                  label="Nome do Site"
                  name="siteName"
                  value={logoData.siteName}
                  onChange={handleInputChange}
                />
                <div className="mt-5 max-h-[400px] overflow-y-auto">
                  <div className="grid grid-cols-3 gap-3">
                    {isLoading
                      ? Array.from(new Array(3)).map((_, index) => (
                          <TemplateLogoCardSkeleton key={index} />
                        ))
                      : data?.templates.map((logo: any) => (
                          <TemplateLogoCard
                            key={logo.id}
                            imageSrc={
                              logo.image
                                ? //@ts-ignore
                                  logo.image.url
                                : `https://via.placeholder.com/150?text=LOGO`
                            }
                            onSelect={() => handleSelectTemplate(logo.id)}
                            isSelected={selectedTemplate === logo.id}
                          />
                        ))}
                  </div>
                </div>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
