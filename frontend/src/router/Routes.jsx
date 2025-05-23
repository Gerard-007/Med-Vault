import DoctorLoginScreen from "../auth/DoctorLoginScreen/DoctorLoginScreen";
import DoctorSignupScreen from "../auth/DoctorSignupScreen/DoctorSignupScreen";
import PatientLoginScreen from "../auth/PatientLoginScreen/PatientLoginScreen";
import PatientSignupScreen from "../auth/PatientSignupScreen/PatientSignupScreen";
import UserTypeOnboardingCard from "../auth/userTypeOnboardCard/UserTypeOnboardingCard";
import CreatePatientMedicalRecord from "../components/dashboard/doctordashboard/createpatientrecord/CreatePatientMedicalRecord";
import DoctorDashboard from "../components/dashboard/doctordashboard/DoctorDashboard";
import RequestAccess from "../components/dashboard/doctordashboard/requestaccess/RequestAccess";
import ViewRecords from "../components/dashboard/doctordashboard/viewrecords/ViewRecords";
import MedValutAiDoctor from "../components/dashboard/medvalutaidoctor/MedValutAiDoctor";
import BookAppointment from "../components/dashboard/patientdashboard/bookappointment/BookAppointment";
import PatientDashboard from "../components/dashboard/patientdashboard/PatientDashboard";
import PatientMedicalResult from "../components/dashboard/patientdashboard/patientmedicalresult/PatientMedicalResult";
import LandingPage from "../pages/LandingPage";

const HEALTH_RECORD_ROUTES = [
  {
    path: "",
    element: <LandingPage />,
    children:[
      {
        path: '/',
        element: <LandingPage />,
      }
    ]
  },
  {
    path: "/doctor/signup",
    element: <DoctorSignupScreen />,
  },
  {
    path: "/usertypeonboarding",
    element: <UserTypeOnboardingCard />,
  },
  {
    path: "/login",
    element: <DoctorLoginScreen />,
  },
  {
    path: "/login/doctor",
    element: <DoctorLoginScreen />,
  },
  {
    path: "/patient/signup",
    element: <PatientSignupScreen/>,
  },
  {
    path: "/patient/login",
    element: <PatientLoginScreen/>,
  },
  {
    path: "/doctor/doctordashboard",
    element: <DoctorDashboard/>
  },
  {
    path: '/doctor/viewrecord',
    element: <ViewRecords/>
  },
  {
    path: "/doctor/requestrecordaccess",
    element: <RequestAccess/>
  },
  {
    path: "/doctor/createmedicalrecord",
    element:<CreatePatientMedicalRecord/>
  },
  {
    path: "/medvalut/aidoctor",
    element: <MedValutAiDoctor />
  },
  {
    path: "/patient/patientdashboard",
    element: <PatientDashboard/>
  },
  {
    path: '/patient/patientdashboard/medicalresult',
    element: <PatientMedicalResult/>
  },
  {
    path: '/patient/patientdashboard/bookappointment',
    element: <BookAppointment/>
  }
]
export default HEALTH_RECORD_ROUTES