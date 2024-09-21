
import { DeleteModalProps } from "@/types/delete";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";

export function DeleteWebsiteDialog({
  open,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>WEB PSI</DialogTitle>
      <DialogContent>
        <Typography>Deseja realmente excluir o site?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
        <Button onClick={onConfirm} color="error">
          Sim, Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
