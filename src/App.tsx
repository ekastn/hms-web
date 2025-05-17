import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import PatientsPage from "./pages/PatientsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import DoctorsPage from "./pages/DoctorsPage";
import MedicalRecordsPage from "./pages/MedicalRecordsPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="doctors" element={<DoctorsPage />} />
                <Route path="patients" element={<PatientsPage />} />
                <Route path="appointments" element={<AppointmentsPage />} />
                <Route path="records" element={<MedicalRecordsPage />} />
            </Route>
        </Routes>
    );
}

export default App;
