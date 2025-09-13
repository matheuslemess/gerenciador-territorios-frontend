// src/components/ui/CustomModal.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Box,
} from '@mui/material';

const CustomModal = ({
  open,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = 'Salvar',
  cancelText = 'Cancelar',
  loading = false,
  maxWidth = 'sm',
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 0,
        },
      }}
    >
      {title && (
        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: '1.2rem',
            pb: 1,
          }}
        >
          {title}
        </DialogTitle>
      )}

      <DialogContent sx={{ p: 3 }}>{children}</DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          gap: 1,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={18} color="inherit" />
              {confirmText}
            </Box>
          ) : (
            confirmText
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomModal;
