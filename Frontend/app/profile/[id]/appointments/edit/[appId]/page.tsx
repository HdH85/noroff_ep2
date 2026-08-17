import AppointmentForm from "@/components/AppointmentForm"; 
import { APPOINTMENTS_API_URL, LOCATIONS_API_URL, DOCTORS_API_URL, GENDERS_API_URL, PATIENT_API_URL } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface ILocation {
    id: number;
    name: string;
    address: string;
}

interface ISpecialty {
    id: number;
    name: string;
}

interface IDoctor {
    id: number;
    firstname: string;
    lastname: string;
    specialty?: ISpecialty;
    location?: ILocation; 
}

interface IGender {
    id: number;
    name: string;
}

interface IPatient {
    firstname: string;
    lastname: string;
    email: string;
    birthdate: string;
    gender: IGender;
}

interface IAppointment {
    id: number;
    doctor?: IDoctor;
    location?: ILocation;
    start: Date;
    end: Date;
    description: string;
}

export default async function EditAppointment({
    params
}: {
    params: Promise<{id: string, appId: string}>;
}) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
            redirect('/login');
        }

    const { id, appId } = await params;

    const [appointmentRes, locationRes, docRes, genderRes, patientRes] = await Promise.all([
        fetch(`${APPOINTMENTS_API_URL}${appId}`, {
            headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store'
        }),
        fetch(LOCATIONS_API_URL, {
            cache: 'no-store'
        }),
        fetch(DOCTORS_API_URL, {
            cache: 'no-store'
        }),
        fetch(GENDERS_API_URL, {
            cache: 'no-store'
        }),
        fetch(`${PATIENT_API_URL}${id}`, {
            headers: { 
            'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store'
        })
    ])

    if (!appointmentRes.ok) {
        console.error('Failed to fetch appointment:', await appointmentRes.text());
        return <div>Error loading appointment</div>;
    }

    const appointment: IAppointment = await appointmentRes.json();
    const locations: ILocation[] = await locationRes.json()
    const doctors: IDoctor[] = await docRes.json();
    const genders: IGender[] = await genderRes.json(); 
    const patient: IPatient = await patientRes.json();

    return (
        <div>
            <AppointmentForm 
                appointment={appointment} 
                doctors={doctors} 
                locations={locations} 
                genders={genders} 
                patient={patient}
                isLoggedIn={true}
                isEdit={true}
                patientId={id} />
        </div>
    )
}
