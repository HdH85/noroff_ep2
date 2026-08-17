const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const LOGIN_API_URL = `${API_URL}/api/patient/patientauth/Login`;
export const REGISTER_API_URL = `${API_URL}/api/patient/patientauth/register`;
export const LOCATIONS_API_URL = `${API_URL}/api/Location/`;
export const APPOINTMENTS_API_URL = `${API_URL}/api/Appointment/`;
export const AVAILABLE_SLOTS_API_URL = `${API_URL}/api/Appointment/available-slots`;
export const DOCTORS_API_URL = `${API_URL}/api/Doc/`;
export const GENDERS_API_URL = `${API_URL}/api/Gender/`;
export const PATIENT_API_URL = `${API_URL}/api/Patient/`;
export const DOCTORSEARCH_API_URL = `${API_URL}/Search/`;