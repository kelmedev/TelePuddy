import React from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";

import PreviewIcon from "@mui/icons-material/Visibility";
import CheckBox from "@mui/icons-material/CheckBox";
import Remove from "@mui/icons-material/Remove";

import { useTemplateStore } from "@/_stores/new-website-store";

interface TemplateCardProps {
  id: number;
  name: string;
  image: string;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  id,
  name,
  image,
}) => {
  const { selectedTemplateName, setFormData } = useTemplateStore();

  const handleSelect = () => {
    setFormData({
      selectedTemplateName: name === selectedTemplateName ? null : name,
    });
  };

  const isSelected = name === selectedTemplateName;

  return (
    <Card key={id} sx={{ border: isSelected ? "2px solid #7F00EA" : "none" }}>
      <CardActionArea>
        <CardMedia component="img" height="160" image={image} alt={name} />
        <CardContent>
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Clique para visualizar ou selecionar este template
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className="flex items-center justify-center">
        <Button size="small" color="primary" startIcon={<PreviewIcon />}>
          Preview
        </Button>
        <Button
          size="small"
          color={isSelected ? "error" : "success"}
          startIcon={isSelected ? <Remove /> : <CheckBox />}
          onClick={handleSelect}
        >
          {isSelected ? "Remover" : "Escolher"}
        </Button>
      </CardActions>
    </Card>
  );
};
