'use client';
import AppointmentForm from "./AppointmentForm";

interface ILocation {
    id: number;
    name: string;
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
    gender: IGender;
    birthdate: string;
}

interface BookingSectionProps {
    locations: ILocation[];
    doctors: IDoctor[];
    genders: IGender[];
    patient: IPatient;
    isLoggedIn: boolean;
}

export default function BookingSection({
    locations,
    doctors,
    genders,
    patient,
    isLoggedIn
}: BookingSectionProps) {

    return (
        <div className="py-10 text-center">
            <AppointmentForm {...{ locations, doctors, genders, patient, isLoggedIn }} />
        </div>
    );
};