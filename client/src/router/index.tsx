import { createBrowserRouter, redirect } from 'react-router';
import { authStorage } from '../api/auth.storage';
import App from '../App';
import PathSelectorPage from '../pages/path-selector';
import ClinicRegistrationPage from '../pages/register-clinic';
import PatientRegistrationPage from '../pages/register-patient';
import DoctorRegistrationPage from '../pages/register-doctor';
import DashboardLayout from '../layouts/DashboardLayout';
import PatientDashboardPage from '../pages/dashboards/patient';
import DoctorDashboardPage from '../pages/dashboards/doctor';
import { queryClient, postsQueryOptions } from './queryClient';
import { Role } from '../types/enums';

// Signed-in patients skip auth pages; loaders also run on back/forward navigation
const redirectSignedInPatient = () =>
  authStorage.getToken() && authStorage.getUser()?.role === Role.PATIENT
    ? redirect('/dashboard/patient')
    : null;

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
    loader: redirectSignedInPatient,
  },
  {
    path: '/register-patient',
    element: <PatientRegistrationPage />,
    loader: redirectSignedInPatient,
  },
  {
    path: '/register-clinic',
    element: <ClinicRegistrationPage />,
  },
  {
    path: '/register-doctor',
    element: <DoctorRegistrationPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        path: 'patient',
        element: <PatientDashboardPage />,
        // Signed-out visitors go back to sign in
        loader: () =>
          authStorage.getToken() ? null : redirect('/path-selector'),
      },
      {
        path: 'doctor',
        element: <DoctorDashboardPage />,
      },
    ],
  },
]);