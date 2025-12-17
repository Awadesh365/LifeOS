import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { premiumTheme } from "./theme/premiumTheme";
import "./styles/premium.css";
import Router from "./routes";

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={premiumTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
