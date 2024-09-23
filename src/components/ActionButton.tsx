'use client'

import React from 'react';
import { Button } from '@mui/material';

interface ActionButtonProps {
  onClick: () => void;
  label: string;
  color: 'primary' | 'secondary' | 'error';
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, label, color }) => {
  return (
    <Button
      onClick={onClick}
      variant="contained"
       className='w-full'
      color={color}
    >
      {label}
    </Button>
  );
};

export default ActionButton;