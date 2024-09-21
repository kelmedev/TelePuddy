
import { SignOutDialogProps } from "@/types/signout";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";

export function SignOutDialog({
  open,
  onClose,
  onConfirm,
}: SignOutDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>WEB PSI</DialogTitle>
      <DialogContent>
        <Typography>Deseja realmente sair do sistema?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
        <Button onClick={onConfirm} color="error">
          Sim, Quero sair
        </Button>
      </DialogActions>
    </Dialog>
  );
}
