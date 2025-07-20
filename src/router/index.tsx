import { createBrowserRouter, Navigate } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout";
import DashboardPage from "../pages/DashboardPage";
import PatientsPage from "../pages/PatientsPage";
import PatientPage from "../pages/PatientPage";
import AppointmentsPage from "../pages/AppointmentsPage";
import AppointmentPage from "../pages/AppointmentPage";
import DoctorsPage from "../pages/DoctorsPage";
import DoctorPage from "../pages/DoctorPage";
import MedicalRecordsPage from "../pages/MedicalRecordsPage";
import MedicalRecordPage from "../pages/MedicalRecordPage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import UsersPage from "../pages/UsersPage";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: <DashboardLayout />,
                children: [
                    { index: true, element: <Navigate to="/dashboard" replace /> },
                    { path: "dashboard", element: <DashboardPage /> },
                    { path: "doctors", element: <DoctorsPage /> },
                    { path: "doctors/:id", element: <DoctorPage /> },
                    { path: "patients", element: <PatientsPage /> },
                    { path: "patients/:id", element: <PatientPage /> },
                    { path: "appointments", element: <AppointmentsPage /> },
                    { path: "appointments/:id", element: <AppointmentPage /> },
                    { path: "records", element: <MedicalRecordsPage /> },
                    { path: "records/:id", element: <MedicalRecordPage /> },
                    { path: "users", element: <UsersPage /> },
                ],
            },
        ],
    },
]);
