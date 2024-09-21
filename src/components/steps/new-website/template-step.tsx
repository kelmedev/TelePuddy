import React, { useState } from "react";
import { Box, TextField, Typography, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { TemplateCard } from "@/components/cards/template-site-card";
import { TemplateSelectionStepProps } from "@/types/templates";

export function TemplateSelectionStep({
  templateCards,
}: TemplateSelectionStepProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTemplates = templateCards.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box mt={5}>
      <Box display="flex" alignItems="center" mb={3}>
        <SearchIcon sx={{ mr: 1 }} />
        <Typography variant="h6">Selecione um template</Typography>
      </Box>

      <TextField
        fullWidth
        placeholder="Buscar templates"
        type="search"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <IconButton>
              <SearchIcon />
            </IconButton>
          ),
        }}
      />

      <Box mt={4} display="flex" flexWrap="wrap" gap={3}>
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => (
            <Box key={template.id} flex="0 1 270px" maxWidth="300px">
              <TemplateCard
                id={template.id}
                name={template.name}
                image={template.thumb.url}
              />
            </Box>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            Nenhum template encontrado.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
