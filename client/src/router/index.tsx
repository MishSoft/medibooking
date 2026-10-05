import { createBrowserRouter } from 'react-router';
import App from '../App';
import { queryClient, postsQueryOptions } from './queryClient';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    loader: async () => {
      return await queryClient.ensureQueryData(postsQueryOptions());
    },
  },
]);