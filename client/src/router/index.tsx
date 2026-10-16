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
import ClinicDashboardPage from '../pages/dashboards/clinic';
import { queryClient, postsQueryOptions } from './queryClient';
import { Role } from '../types/enums';

// Signed-in patients skip auth pages; loaders also run on back/forward navigation
const redirectSignedInPatient = () =>
  authStorage.getToken() && authStorage.getUser()?.role === Role.PATIENT
    ? redirect('/dashboard/patient')
    : null;

// Only signed-in users with the given role may open the page; everyone else signs in
const requireRole = (role: Role) => () =>
  authStorage.getToken() && authStorage.getUser()?.role === role
    ? null
    : redirect('/path-selector');

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
        loader: requireRole(Role.PATIENT),
      },
      {
        path: 'doctor',
        element: <DoctorDashboardPage />,
      },
      {
        path: 'clinic',
        element: <ClinicDashboardPage />,
        loader: requireRole(Role.CLINIC_ADMIN),
      },
    ],
  },
]);