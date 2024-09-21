import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Skeleton,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";

import { GetAllLogosList } from "@/_services/GET_ALL_LOGOS";
import { DeleteLogoDialog } from "../dialogs/delete-logo-dialog";
import { _DELETE_LOGO } from "@/_services/DELETE_LOGO";

import { useRouter } from "next/navigation";

import jsPDF from "jspdf";

export const LogosTable = () => {
  const { data: logos, isLoading } = GetAllLogosList();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const deleteProject = _DELETE_LOGO();
  const { push } = useRouter();

  const handleClickMenu = (
    event: React.MouseEvent<HTMLElement>,
    logoId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedLogo(logoId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedLogo(null);
  };

  const handlePreview = (url: string) => {
    window.open(url, "_blank");
  };

  const handleDownload = async (url: string, name: string) => {
    try {
      const cardWidth = 85.6;
      const cardHeight = 53.98;

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [cardWidth, cardHeight],
      });

      const img = new Image();
      img.src = url;
      img.crossOrigin = "Anonymous";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const margin = 5;
      const availableWidth = cardWidth - 2 * margin;
      const availableHeight = cardHeight - 2 * margin;

      let imgWidth = img.width;
      let imgHeight = img.height;

      const widthScale = availableWidth / imgWidth;
      const heightScale = availableHeight / imgHeight;
      const scale = Math.min(widthScale, heightScale);

      imgWidth = imgWidth * scale;
      imgHeight = imgHeight * scale;

      const x = (cardWidth - imgWidth) / 2;
      const y = (cardHeight - imgHeight) / 2;

      pdf.addImage(img, "PNG", x, y, imgWidth, imgHeight);

      pdf.save(`${name}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar o PDF:", error);
    }
  };

  const handleEdit = () => {
    if (selectedLogo) {
      push(`/canva/${selectedLogo}`);
    }
  };

  const handleDeleteClick = () => {
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedLogo) {
      deleteProject.mutate(selectedLogo, {
        onSuccess: () => {
          setIsDialogOpen(false);
          handleCloseMenu();
        },
      });
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleFilterChange = (newFilter: string | null) => {
    setFilter(newFilter);
  };

  const filteredLogos = filter
    ? logos?.data.filter((logo: any) => logo.type === filter)
    : logos?.data;

  return (
    <Box>
      <Box mb={2}>
        <Chip
          label="Todos"
          onClick={() => handleFilterChange(null)}
          color={filter === null ? "primary" : "default"}
          sx={{
            mr: 1,
            backgroundColor: filter === null ? "#1976d2" : "#e3f2fd",
            color: filter === null ? "#fff" : "#1976d2",
          }}
        />
        <Chip
          label="CARTÃO DE VISITA"
          onClick={() => handleFilterChange("CARTÃO DE VISITA")}
          color={filter === "CARTÃO DE VISITA" ? "primary" : "default"}
          sx={{
            mr: 1,
            backgroundColor:
              filter === "CARTÃO DE VISITA" ? "#4caf50" : "#c8e6c9",
            color: filter === "CARTÃO DE VISITA" ? "#fff" : "#4caf50",
          }}
        />
        <Chip
          label="LOGOTIPOS"
          onClick={() => handleFilterChange("LOGOTIPO")}
          color={filter === "LOGOTIPO" ? "primary" : "default"}
          sx={{
            backgroundColor: filter === "LOGOTIPO" ? "#f44336" : "#ffcdd2",
            color: filter === "LOGOTIPO" ? "#fff" : "#f44336",
          }}
        />
      </Box>

      <TableContainer
        component={Paper}
        style={{ maxHeight: 300, overflowY: "auto" }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Preview</TableCell>
              <TableCell>Largura</TableCell>
              <TableCell>Altura</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <>
                {[1].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="text" width={120} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rectangular" width={40} height={40} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={60} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={60} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={80} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rectangular" width={40} height={30} />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : filteredLogos?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    padding={4}
                  >
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      Nenhuma logo disponível
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Adicione um novo logo para começar a visualizar os dados
                      aqui.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filteredLogos.map((logo: any) => (
                <TableRow key={logo.id}>
                  <TableCell>{logo.name || "N/A"}</TableCell>
                  <TableCell>
                    <img
                      src={
                        logo.image
                          ? //@ts-ignore
                            logo.image.url
                          : `https://via.placeholder.com/150?text=${encodeURIComponent(
                              logo.name
                            )}`
                      }
                      alt={logo.name}
                      style={{ width: 40, height: 40, objectFit: "contain" }}
                    />
                  </TableCell>
                  <TableCell>{logo.width}</TableCell>
                  <TableCell>{logo.height}</TableCell>
                  <TableCell>
                    <Chip
                      label={logo.type}
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(event) => handleClickMenu(event, logo.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>

                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedLogo === logo.id}
                      onClose={handleCloseMenu}
                    >
                      {logo.type === "CARTÃO DE VISITA" ? (
                        <MenuItem
                          onClick={() =>
                            handleDownload(logo.image.url, logo.name)
                          }
                        >
                          <ListItemIcon>
                            <DownloadIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Download</ListItemText>
                        </MenuItem>
                      ) : (
                        <MenuItem onClick={() => handlePreview(logo.image.url)}>
                          <ListItemIcon>
                            <VisibilityIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Visualizar</ListItemText>
                        </MenuItem>
                      )}
                      <MenuItem onClick={handleEdit}>
                        <ListItemIcon>
                          <EditIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Editar</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={handleDeleteClick}>
                        <ListItemIcon>
                          <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Excluir</ListItemText>
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <DeleteLogoDialog
          open={isDialogOpen}
          onClose={handleDialogClose}
          onConfirm={handleDeleteConfirm}
          title="Confirmar exclusão"
          description="Tem certeza de que deseja excluir este logo?"
        />
      </TableContainer>
    </Box>
  );
};
