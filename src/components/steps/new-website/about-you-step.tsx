"use client";

import React, { useState, useEffect } from "react";

import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  InputAdornment,
  Chip,
  Avatar,
  IconButton,
  ListItemAvatar,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PsychologyIcon from "@mui/icons-material/Psychology";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GroupIcon from "@mui/icons-material/Group";
import DeleteIcon from "@mui/icons-material/Delete";

import { Upload } from "@mui/icons-material";
import { useTemplateStore } from "@/_stores/new-website-store";

type Specialty = {
  id: number;
  name: string;
  path: string;
  category: string;
  categoria: string;
};

type Category =
  | "Cognitiva"
  | "Comportamental"
  | "Emocional"
  | "Social"
  | "Customizadas";

const categoryIcons: Record<Category, JSX.Element> = {
  Cognitiva: <PsychologyIcon />,
  Comportamental: <DirectionsWalkIcon />,
  Emocional: <FavoriteIcon />,
  Social: <GroupIcon />,
  Customizadas: <AddIcon />,
};

const CategoryChips: React.FC<{
  categories: Category[];
  selectedCategory: string | null;
  handleFilterByCategory: (category: string) => void;
}> = ({ categories, selectedCategory, handleFilterByCategory }) => {
  return (
    <Box mt={2} mb={3} display="flex" gap={1}>
      {categories.map((category) => (
        <Chip
          key={category}
          label={
            category === "Customizadas"
              ? "Minhas especialidades"
              : `Psicologia ${category}`
          }
          icon={categoryIcons[category]}
          onClick={() => handleFilterByCategory(category)}
          clickable
          sx={{
            backgroundColor:
              category === "Cognitiva"
                ? "#8E44AD"
                : category === "Comportamental"
                ? "#27AE60"
                : category === "Emocional"
                ? "#E74C3C"
                : category === "Social"
                ? "#2980B9"
                : "#34495E",
            color: "#fff",
            "& .MuiChip-icon": {
              color: "#fff",
            },
            "&:hover": {
              backgroundColor:
                category === "Cognitiva"
                  ? "#7D3C98"
                  : category === "Comportamental"
                  ? "#229954"
                  : category === "Emocional"
                  ? "#C0392B"
                  : category === "Social"
                  ? "#2471A3"
                  : "#2C3E50",
            },
          }}
        />
      ))}
    </Box>
  );
};

const SpecialtyList: React.FC<{
  specialties: Specialty[];
  selectedSpecialties: Specialty[];
  handleSelectSpecialty: (specialty: Specialty) => void;
  handlePreview: (
    event: React.MouseEvent<HTMLButtonElement>,
    imageUrl: string
  ) => void;
  handleDelete?: (specialtyId: number) => void;
}> = ({
  specialties,
  selectedSpecialties,
  handleSelectSpecialty,
  handlePreview,
  handleDelete,
}) => {
  return (
    <List
      sx={{
        maxHeight: "300px",
        overflowY: "auto",
      }}
    >
      {specialties.length > 0 ? (
        specialties.map((specialty) => (
          <ListItem
            key={specialty.id}
            component="div"
            onClick={() => handleSelectSpecialty(specialty)}
            sx={{
              border: selectedSpecialties.includes(specialty)
                ? "2px solid #7F00EA"
                : "none",
              borderRadius: 2,
              mb: 1,
              gap: 2,
            }}
          >
            <ListItemAvatar>
              <Avatar
                src={specialty.path}
                sx={{ width: 56, height: 56, borderRadius: 1 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={specialty.name}
              secondary="Clique aqui para selecionar"
            />
            <IconButton
              onClick={(event) => handlePreview(event, specialty.path)}
              edge="end"
            >
              <VisibilityIcon />
            </IconButton>
            {handleDelete && (
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(specialty.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </ListItem>
        ))
      ) : (
        <Typography variant="body1" color="textSecondary">
          Nenhuma especialidade encontrada.
        </Typography>
      )}
    </List>
  );
};

const AddSpecialtyModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSave: (name: string, file: File) => void;
}> = ({ open, onClose, onSave }) => {
  const [name, setName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSave = () => {
    if (!name || !file) {
      setError("Preencha o nome e faça o upload da imagem.");
      return;
    }
    setError("");
    onSave(name, file);
    setName("");
    setFile(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Adicionar Especialidade</DialogTitle>
      <DialogContent>
        {file && (
          <Box
            mt={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <Box
              component="img"
              src={URL.createObjectURL(file)}
              alt="Imagem selecionada"
              sx={{
                width: 150,
                height: 150,
                objectFit: "cover",
                borderRadius: "12px",
                border: "2px solid #7F00EA",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            />
          </Box>
        )}
        <Button
          variant="outlined"
          component="label"
          fullWidth
          startIcon={<Upload />}
          sx={{
            backgroundColor: "#F9F9F9",
            color: "#7F00EA",
            border: "2px dashed #7F00EA",
            borderRadius: "12px",
            padding: "16px",
            textTransform: "none",
            transition: "background-color 0.3s, color 0.3s",
            marginTop: "16px",
            "&:hover": {
              backgroundColor: "#EAEAEA",
            },
          }}
        >
          Upload de ícone
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        <TextField
          fullWidth
          label="Nome da Especialidade"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />

        {error && <Typography color="error">{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AboutYouStep: React.FC<{
  onValidationChange: (isValid: boolean) => void;
}> = ({ onValidationChange }) => {
  const [bio, setBio] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSpecialties, setSelectedSpecialties] = useState<Specialty[]>(
    []
  );
  const [customSpecialties, setCustomSpecialties] = useState<Specialty[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const specialties: Specialty[] = require("@/_db/especialidades.json");

  const { setFormData } = useTemplateStore();

  useEffect(() => {
    const isFormValid = bio.trim().length > 0 && selectedSpecialties.length > 0;
    onValidationChange(isFormValid);

    setFormData({ bio, specialties: selectedSpecialties });
  }, [bio, selectedSpecialties, onValidationChange, setFormData]);

  const handleSelectSpecialty = (specialty: Specialty) => {
    setSelectedSpecialties((prevSelected) =>
      prevSelected.includes(specialty)
        ? prevSelected.filter((item) => item.id !== specialty.id)
        : [...prevSelected, specialty]
    );
  };

  const handlePreview = (
    event: React.MouseEvent<HTMLButtonElement>,
    imageUrl: string
  ) => {
    event.stopPropagation();
    window.open(imageUrl, "_blank");
  };

  const handleFilterByCategory = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const filteredSpecialties = specialties.filter((specialty) => {
    const matchesSearch = specialty.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === null || specialty.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredCustomSpecialties = customSpecialties.filter((specialty) => {
    const matchesSearch = specialty.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesSearch;
  });

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleSaveSpecialty = (name: string, file: File) => {
    const newSpecialty: Specialty = {
      id: customSpecialties.length + 1,
      name,
      path: URL.createObjectURL(file),
      category: "Cognitiva",
      categoria: "Customizada",
    };
    setCustomSpecialties([...customSpecialties, newSpecialty]);
    setSelectedCategory("Customizadas");
  };

  const handleDeleteCustomSpecialty = (specialtyId: number) => {
    setCustomSpecialties((prevSpecialties) =>
      prevSpecialties.filter((specialty) => specialty.id !== specialtyId)
    );
    setSelectedSpecialties((prevSelected) =>
      prevSelected.filter((specialty) => specialty.id !== specialtyId)
    );
  };

  const categories: Category[] = [
    "Cognitiva",
    "Comportamental",
    "Emocional",
    "Social",
    "Customizadas",
  ];

  return (
    <Box mt={5}>
      <Typography variant="h6">Conte um pouco sobre você:</Typography>
      <TextField
        fullWidth
        label="Escreva sua bio"
        variant="outlined"
        margin="normal"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        multiline
        rows={4}
      />
      <TextField
        fullWidth
        label="Buscar especialidades"
        variant="outlined"
        margin="normal"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <CategoryChips
        categories={categories}
        selectedCategory={selectedCategory}
        handleFilterByCategory={handleFilterByCategory}
      />

      {selectedCategory === "Customizadas" ? (
        <SpecialtyList
          specialties={filteredCustomSpecialties}
          selectedSpecialties={selectedSpecialties}
          handleSelectSpecialty={handleSelectSpecialty}
          handlePreview={handlePreview}
          handleDelete={handleDeleteCustomSpecialty}
        />
      ) : (
        <SpecialtyList
          specialties={filteredSpecialties}
          selectedSpecialties={selectedSpecialties}
          handleSelectSpecialty={handleSelectSpecialty}
          handlePreview={handlePreview}
        />
      )}

      <Box display="flex" justifyContent="center" mt={3}>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ borderRadius: 50 }}
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
        >
          Adicionar especialidade
        </Button>
      </Box>

      <AddSpecialtyModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSpecialty}
      />
    </Box>
  );
};

export default AboutYouStep;
