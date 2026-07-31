import { AuthProvider } from '@context/AuthContext';
import { LanguageProvider } from '@context/LanguageContext';
import AppRouter from './routes/AppRouter';
import ToastContainer from '@components/ui/ToastContainer';
import ErrorBoundary from '@components/ui/ErrorBoundary';
import '@styles/index.css';

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <AppRouter />
          <ToastContainer />
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
