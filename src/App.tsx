import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { premiumTheme } from "./theme/premiumTheme";
import { ErrorBoundary, ToastProvider } from "./components/common";
import "./styles/premium.css";
import Router from "./routes";

const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider theme={premiumTheme}>
          <CssBaseline />
          <ToastProvider>
            <BrowserRouter>
              <Router />
            </BrowserRouter>
          </ToastProvider>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
