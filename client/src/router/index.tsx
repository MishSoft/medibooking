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

const dashboardPathByRole: Record<Role, string> = {
  [Role.PATIENT]: '/dashboard/patient',
  [Role.DOCTOR]: '/dashboard/doctor',
  [Role.CLINIC_ADMIN]: '/dashboard/clinic',
};

const getSignedInRole = () =>
  authStorage.getToken() ? authStorage.getUser()?.role : undefined;

// Signed-in users skip auth pages; loaders also run on back/forward navigation
const redirectSignedInUser = () => {
  const role = getSignedInRole();
  return role ? redirect(dashboardPathByRole[role]) : null;
};

// Signed-out visitors sign in; signed-in users with another role go to their own dashboard
const requireRole = (role: Role) => () => {
  const signedInRole = getSignedInRole();
  if (!signedInRole) return redirect('/path-selector');
  return signedInRole === role
    ? null
    : redirect(dashboardPathByRole[signedInRole]);
};

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
    loader: redirectSignedInUser,
  },
  {
    path: '/register-patient',
    element: <PatientRegistrationPage />,
    loader: redirectSignedInUser,
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
        loader: requireRole(Role.DOCTOR),
      },
      {
        path: 'clinic',
        element: <ClinicDashboardPage />,
        loader: requireRole(Role.CLINIC_ADMIN),
      },
    ],
  },
]);