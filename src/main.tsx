import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './pages/Home/App.tsx';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { store } from './store/index.ts';
import Additional from './pages/Additional/Additional.tsx';

const router = createBrowserRouter([
  {
    path: '',
    element: <App />,
  },
  {
    path: '/second',
    element: <Additional />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
