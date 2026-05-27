import { Provider } from 'react-redux';
import { store } from './store';
import ErrorBoundary from './components/layout/ErrorBoundary';
import AppLayout from './components/layout/AppLayout';
import { SnackbarProvider } from 'notistack';

export default function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <AppLayout />
        </SnackbarProvider>
      </ErrorBoundary>
    </Provider>
  );
}
