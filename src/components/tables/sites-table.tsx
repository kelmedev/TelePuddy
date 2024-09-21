import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

import { useState } from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LockIcon from "@mui/icons-material/Lock";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { GetAllWebsitesList } from "@/_services/GET_ALL_WEBSITES";
import { _DeleteWebsiteAction } from "@/_services/DELETE_WEBSITE";

import { DeleteWebsiteDialog } from "../dialogs/delete-website-dialog";
import { _GENERATE_SSL } from "@/_services/GENERATE_WEBSITE_SSL";
import { useRouter } from "next/navigation";

export const SitesTable = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSite, setSelectedSite] = useState<{
    site: string | null;
    siteId: string | null;
    domain: string | null;
  }>({ site: null, siteId: null, domain: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { data: sites, isLoading } = GetAllWebsitesList();
  const deleteWebsite = _DeleteWebsiteAction();
  const requestSSL = _GENERATE_SSL();

  const { push } = useRouter();

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    site: string,
    siteId: string,
    domain: string | null
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedSite({ site, siteId, domain });
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedSite({ site: null, siteId: null, domain: null });
  };

  const handleDeleteConfirm = () => {
    if (selectedSite.siteId) {
      deleteWebsite.mutate(selectedSite.siteId, {
        onSuccess: () => {
          setSnackbarOpen(true);
          setIsModalOpen(false);
        },
      });
    }
  };

  const handleOpenSite = (site: any) => {
    const domain = site.Domain[0]?.domain;
    const subdomain = `https://${site.subdomain}.psiweb.com.br`;
    const url = domain ? `https://${domain}` : subdomain;
    window.open(url, "_blank");
  };

  const handleGenerateSSL = () => {
    if (selectedSite.domain) {
      requestSSL.mutate(selectedSite.domain, {
        onSuccess: () => {
          setSnackbarOpen(true);
          setAnchorEl(null);
        },
        onError: () => {
          setSnackbarOpen(true);
        },
      });
    }
  };

  const handleEditSite = (siteId: string) => {
    push(`/builder/${siteId}`);
  };

  const renderSkeletonRow = () => (
    <TableRow>
      {[120, 120, 120, 80].map((width, index) => (
        <TableCell key={index}>
          <Skeleton variant="text" width={width} />
        </TableCell>
      ))}
      <TableCell>
        <Skeleton variant="rectangular" width={40} height={30} />
      </TableCell>
    </TableRow>
  );

  const renderNoSitesMessage = () => (
    <TableRow>
      <TableCell colSpan={5}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          padding={4}
        >
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Nenhum site criado ainda 🙁
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Adicione um novo site para começar a visualizar os dados aqui.
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {["Título", "Subdomínio", "Domínio", "Status", "Ações"].map(
              (header, index) => (
                <TableCell key={index}>{header}</TableCell>
              )
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading
            ? renderSkeletonRow()
            : sites?.data?.length === 0
            ? renderNoSitesMessage()
            : sites?.data?.map((site: any) => (
                <TableRow key={site.id}>
                  <TableCell>{site.name || "N/A"}</TableCell>
                  <TableCell>{`https://${site.subdomain}.psiweb.com.br`}</TableCell>
                  <TableCell>
                    <Chip
                      label={site.Domain[0]?.domain || "Não implantado"}
                      color={site.Domain.length ? "primary" : "default"}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={site.status}
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(event) =>
                        handleMenuClick(
                          event,
                          site.name,
                          site.id,
                          site.Domain[0]?.domain || null
                        )
                      }
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={
                        Boolean(anchorEl) && selectedSite.site === site.name
                      }
                      onClose={handleCloseMenu}
                    >
                      {[
                        {
                          label: "Acessar",
                          icon: <OpenInNewIcon fontSize="small" />,
                          action: () => handleOpenSite(site),
                        },
                        {
                          label: "Gerar SSL",
                          icon: <LockIcon fontSize="small" />,
                          action: handleGenerateSSL,
                        },
                        {
                          label: "Editar",
                          icon: <EditIcon fontSize="small" />,
                          action: () => handleEditSite(site.id), 
                        },
                        {
                          label: "Excluir",
                          icon: <DeleteIcon fontSize="small" />,
                          action: () => setIsModalOpen(true),
                        },
                      ].map((item, index) => (
                        <MenuItem
                          key={index}
                          onClick={item.action || handleCloseMenu}
                        >
                          <ListItemIcon>{item.icon}</ListItemIcon>
                          <ListItemText>{item.label}</ListItemText>
                        </MenuItem>
                      ))}
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>

      <DeleteWebsiteDialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {requestSSL.isError
            ? "Erro ao gerar SSL!"
            : deleteWebsite.isError
            ? "Erro ao excluir site!"
            : requestSSL.isSuccess
            ? "SSL gerado com sucesso!"
            : "Site excluído com sucesso!"}
        </Alert>
      </Snackbar>
    </TableContainer>
  );
};
