import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ThemeModeProvider } from "./theme/ThemeModeProvider";
import { ErrorBoundary, ToastProvider } from "./components/common";
import "./styles/premium.css";
import Router from "./routes";

const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeModeProvider>
          <ToastProvider>
            <BrowserRouter>
              <Router />
            </BrowserRouter>
          </ToastProvider>
        </ThemeModeProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
