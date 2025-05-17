import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import PatientsPage from "./pages/PatientsPage";
import PatientPage from "./pages/PatientPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import AppointmentPage from "./pages/AppointmentPage";
import DoctorsPage from "./pages/DoctorsPage";
import DoctorPage from "./pages/DoctorPage";
import MedicalRecordsPage from "./pages/MedicalRecordsPage";
import MedicalRecordPage from "./pages/MedicalRecordPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="doctors" element={<DoctorsPage />} />
                <Route path="doctors/:id" element={<DoctorPage />} />
                <Route path="patients" element={<PatientsPage />} />
                <Route path="patients/:id" element={<PatientPage />} />
                <Route path="appointments" element={<AppointmentsPage />} />
                <Route path="appointments/:id" element={<AppointmentPage />} />
                <Route path="records" element={<MedicalRecordsPage />} />
                <Route path="records/:id" element={<MedicalRecordPage />} />
            </Route>
        </Routes>
    );
}

export default App;
