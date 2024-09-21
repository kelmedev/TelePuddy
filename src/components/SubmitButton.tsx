import React from 'react';
import { Button } from '@mui/material';

interface SubmitButtonProps {
  onClick: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant="contained"
      color="primary"
      sx={{
        mt: 2,
        borderRadius: '9999px', // Bordas totalmente arredondadas
        paddingX: 3, // Padding horizontal
        paddingY: 1.5, // Padding vertical
        fontSize: '1.125rem', // Tamanho do texto (equivalente a text-lg no Tailwind)
      }}
    >
      Enviar
    </Button>
  );
};

export default SubmitButton;