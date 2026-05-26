import { Provider } from 'react-redux';
import { store } from './store';
import ErrorBoundary from './components/ErrorBoundary';
import AppLayout from './components/AppLayout';
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
