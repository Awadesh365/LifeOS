import { Component, ErrorInfo, ReactNode } from "react";
import { Box, Button, Container, Typography, Paper } from "@mui/material";
import { ErrorOutline, Refresh } from "@mui/icons-material";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container maxWidth="sm">
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 3,
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
              }}
            >
              <ErrorOutline sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
              <Typography variant="h4" gutterBottom color="error">
                Oops! Something went wrong
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                We're sorry for the inconvenience. Please try refreshing the
                page or go back to home.
              </Typography>
              {process.env.NODE_ENV === "development" && this.state.error && (
                <Paper
                  sx={{
                    p: 2,
                    mb: 3,
                    bgcolor: "rgba(255,0,0,0.1)",
                    border: "1px solid rgba(255,0,0,0.3)",
                    borderRadius: 2,
                    textAlign: "left",
                    maxHeight: 200,
                    overflow: "auto",
                  }}
                >
                  <Typography variant="caption" color="error" component="pre">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </Typography>
                </Paper>
              )}
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={this.handleReload}
                >
                  Refresh Page
                </Button>
                <Button variant="outlined" onClick={this.handleGoHome}>
                  Go to Home
                </Button>
              </Box>
            </Paper>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
