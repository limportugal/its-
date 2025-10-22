import { useState } from "react";

type SnackbarSeverity = "success" | "error" | "info" | "warning";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
}

interface UseSnackbarReturn {
  snackbar: SnackbarState;
  showSuccessSnackbar: (message: string) => void;
  showErrorSnackbar: (message: string) => void;
  showInfoSnackbar: (message: string) => void;
  showWarningSnackbar: (message: string) => void;
  hideSnackbar: () => void;
}

export const useSnackbar = (): UseSnackbarReturn => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success"
  });

  const showSnackbar = (message: string, severity: SnackbarSeverity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const showSuccessSnackbar = (message: string) => {
    showSnackbar(message, "success");
  };

  const showErrorSnackbar = (message: string) => {
    showSnackbar(message, "error");
  };

  const showInfoSnackbar = (message: string) => {
    showSnackbar(message, "info");
  };

  const showWarningSnackbar = (message: string) => {
    showSnackbar(message, "warning");
  };

  const hideSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false
    }));
  };

  return {
    snackbar,
    showSuccessSnackbar,
    showErrorSnackbar,
    showInfoSnackbar,
    showWarningSnackbar,
    hideSnackbar
  };
}; 