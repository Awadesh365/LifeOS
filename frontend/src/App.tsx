import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ThemeModeProvider } from "./theme/ThemeModeProvider";
import { ErrorBoundary, ToastProvider } from "./components/common";
import "./styles/premium.css";
import Router from "./routes";
import { AuthProvider, useAuth } from './auth/AuthProvider';

function ThemedApp() {
  const { user } = useAuth();
  return (
    <ThemeModeProvider key={user?.id ?? 'guest'} syncEnabled={Boolean(user)}>
      <ToastProvider><Router /></ToastProvider>
    </ThemeModeProvider>
  );
}

const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <AuthProvider>
            <ThemedApp />
          </AuthProvider>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
