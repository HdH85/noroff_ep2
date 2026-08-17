import BookingSection from "@/components/BookingSection"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { 
  GENDERS_API_URL, 
  LOCATIONS_API_URL, 
  DOCTORS_API_URL, 
  PATIENT_API_URL 
} from "@/lib/constants";

export default async function Book() {
    const [genderRes, locationRes, docRes] = await Promise.all([
        fetch(GENDERS_API_URL),
        fetch(LOCATIONS_API_URL),
        fetch(DOCTORS_API_URL)
      ]);
    
      const [genders, locations, doctors] = await Promise.all([ 
        genderRes.json(),
        locationRes.json(),
        docRes.json()
      ]);
    
      const cookieStore = await cookies();
      const token = cookieStore.get('token')?.value;
      const isLoggedIn = !!token;
    
      let patient = null;
      if (token) {
        try {
          const base64Payload = token.split('.')[1];
          const jsonPayload = atob(base64Payload);
          const payload = JSON.parse(jsonPayload);
          const patientId = payload.patientId || payload.sub || payload.id;
    
          const patientRes = await fetch(`${PATIENT_API_URL}${patientId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
    
          if (patientRes.status === 401) {
                  (await cookies()).delete('token');
                  redirect('/login');
          }
    
          if (patientRes.ok) {
            patient = await patientRes.json();
          }
          
        } catch (error) {
          console.error('Error fetching patient:', error);
        }
      }

    return (
        <div>
            <BookingSection 
                locations={locations} 
                doctors={doctors} 
                genders={genders} 
                patient={patient} 
                isLoggedIn={isLoggedIn} 
                />
        </div>
    );
};