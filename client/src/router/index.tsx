import { createBrowserRouter } from 'react-router';
import App from '../App';
import PathSelectorPage from '../pages/path-selector';
import ClinicRegistrationPage from '../pages/register-clinic';
import PatientRegistrationPage from '../pages/register-patient';
import DashboardLayout from '../layouts/DashboardLayout';
import PatientDashboardPage from '../pages/dashboards/patient';
import { queryClient, postsQueryOptions } from './queryClient';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    loader: async () => {
      return await queryClient.ensureQueryData(postsQueryOptions());
    },
  },
  {
    path: '/path-selector',
    element: <PathSelectorPage />,
  },
  {
    path: '/register-patient',
    element: <PatientRegistrationPage />,
  },
  {
    path: '/register-clinic',
    element: <ClinicRegistrationPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        path: 'patient',
        element: <PatientDashboardPage />,
      },
    ],
  },
]);