import React from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardMedia,
} from "@mui/material";

import PreviewIcon from "@mui/icons-material/Visibility";
import SelectIcon from "@mui/icons-material/CheckCircle";

interface TemplateLogoCardProps {
  imageSrc: string;
  onSelect: () => void;
  isSelected: boolean;
}

export function TemplateLogoCard({
  imageSrc,
  onSelect,
  isSelected,
}: TemplateLogoCardProps) {
  const handlePreview = () => {
    window.open(imageSrc, "_blank");
  };

  return (
    <Box flex="0 1 240px" maxWidth="300px" mt={3} mb={3}>
      <Card
        sx={{
          border: isSelected ? "2px solid #7F00EA" : "none",
        }}
      >
        <CardActionArea>
          <CardMedia
            component="img"
            image={imageSrc}
            alt="Logo"
            sx={{ height: 200, objectFit: "contain" }}
          />
        </CardActionArea>
        <CardActions className="flex items-center justify-center">
          <Button
            size="small"
            color="primary"
            startIcon={<PreviewIcon />}
            onClick={handlePreview}
          >
            Preview
          </Button>
          <Button
            size="small"
            color="success"
            startIcon={<SelectIcon />}
            onClick={onSelect}
          >
            {isSelected ? "Selecionado" : "Escolher"}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
