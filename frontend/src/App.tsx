import { Provider } from 'react-redux';
import { store } from './store';
import ErrorBoundary from './components/ErrorBoundary';
import AppLayout from './components/AppLayout';

export default function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <AppLayout />
      </ErrorBoundary>
    </Provider>
  );
}
