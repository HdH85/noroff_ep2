import { Metadata } from "next";
import { PATIENT_API_URL, LOCATIONS_API_URL, DOCTORS_API_URL, GENDERS_API_URL } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProfilePageClient from "./ProfilePageClient";

type Params = { id: string };

interface IGender {
    id: number;
    name: string;
}

interface IPatient {
    id?: number;
    firstname: string;
    lastname: string;
    email: string;
    ssn: string;
    birthdate: Date;
    gender?: IGender;
    taxNumber: string;
    religion: string;
    driversLicenseNumber: string;
    medicalInsuranceNumber: string;
    appointments?: IAppointment[];
}

interface IDoctor {
    id: number;
    firstname: string;
    lastname: string;
    workHours: string;
}

interface ILocation {
    id: number;
    name: string;
    address: string;
}

interface IAppointment {
    id: number;
    doctor?: IDoctor;
    location?: ILocation;
    start: Date;
    end: Date;
    description: string;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<Params>;
}): Promise<Metadata> {
    const resolvedParams = await params;

    return {
        title: `Patient Profile - ${resolvedParams.id}`,
        description: 'Patient profile page',
    };
}

export default async function ProfilePage({
    params,
}: {
    params: Promise<Params>;
}) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/login');
    }

    const resolvedParams = await params;

    const response = await fetch(`${PATIENT_API_URL}${resolvedParams.id}`, {
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    if (response.status === 401) {
        (await cookies()).delete('token');
        revalidatePath('/', 'layout');
        redirect('/login');
    }

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`API error: ${text}`);
    }

    const patientData: IPatient = await response.json();
    const appointments = patientData.appointments || [];

    return <ProfilePageClient 
        patientData={patientData}
        appointments={appointments}
        />;
};