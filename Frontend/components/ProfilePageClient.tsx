'use client';
import { useEffect, useState } from "react";
import DeleteButton from "./DeleteButton";
import Link from "next/link";
import { ta } from "zod/v4/locales";

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

interface Props {
  patientData: IPatient;
  appointments: IAppointment[];
}

export default function ProfilePageClient({
    patientData,
    appointments
}: Props) {
    const [activeTab, setActiveTab] = useState('appointments');

    const tabData = [
        {
            id: "profile", 
            label: "Profile", 
            content: 
            <div className="max-w-2xl mx-auto space-y-3 px-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <h3 className="font-bold text-xs text-gray-800 mb-1">First name</h3>
                        <p className="text-sm rounded-lg px-3 py-2 bg-white text-black">
                            {patientData.firstname}
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-xs text-gray-800 mb-1">Last name</h3>
                        <p className="text-sm rounded-lg px-3 py-2 bg-white text-black">
                            {patientData.lastname}
                        </p>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-xs text-gray-800 mb-1">Email</h3>
                    <p className="text-sm rounded-lg px-3 py-2 bg-white text-black">
                        {patientData.email}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <h3 className="font-bold text-xs text-gray-800 mb-1">Birthdate</h3>
                        <p className="text-sm rounded-lg px-3 py-2 bg-white text-black">
                            {new Date(patientData.birthdate).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-xs text-gray-800 mb-1">Gender</h3>
                        <p className="text-sm rounded-lg px-3 py-2 bg-white text-black">
                            {patientData.gender?.name}
                        </p>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-xs text-gray-800 mb-1">Social Security Number</h3>
                    <p className="text-sm rounded-lg px-3 py-2 bg-white text-black">
                        {patientData.ssn}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <h3 className="font-bold text-xs text-gray-800 mb-1">Tax Number</h3>
                        <p className="text-sm rounded-lg px-3 py-2 bg-white text-black">
                            {patientData.taxNumber}
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-xs text-gray-800 mb-1">Religion</h3>
                        <p className="text-sm rounded-lg px-3 py-2 bg-white text-black">
                            {patientData.religion}
                        </p>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-xs text-gray-800 mb-1">Driver&apos;s License Number</h3>
                    <p className="text-sm rounded-lg px-3 py-2 bg-white text-black">
                        {patientData.driversLicenseNumber}
                    </p>
                </div>
                <div>
                    <h3 className="font-bold text-xs text-gray-800 mb-1">Medical Insurance Number</h3>
                    <p className="text-sm rounded-lg px-3 py-2 bg-white text-black">
                        {patientData.medicalInsuranceNumber}
                    </p>
                </div>
            </div> 
        },
        {
            id: "appointments", 
            label: "Appointments", 
            content: 
            <div className="max-w-3xl mx-auto px-4">
                {appointments.length === 0 ? (
                    <p className="text-gray-600 text-center py-10">No appointments scheduled</p>
                ) : (
                    <div className="space-y-3">
                        {appointments.map((appointment: IAppointment) => {
                            const appointmentDate = new Date(appointment.start);
                            const date = appointmentDate.toISOString().split('T')[0];
                            const time = appointmentDate.toTimeString().slice(0, 5);

                            return (
                                <div 
                                    key={appointment.id}
                                    className="p-3 sm:p-4 rounded-lg bg-gray-300 shadow-md text-gray-800 relative break-words"
                                >
                                    <div className="pr-16">
                                        <h4 className="font-semibold text-base mb-2">
                                            Dr. {appointment.doctor?.firstname} {appointment.doctor?.lastname}
                                        </h4>
                                        <div className="grid grid-cols-2">
                                            <div>
                                                <span className="text-sm font-bold">Location:</span> 
                                                <div className="text-sm text-gray-800 font-bold mb-1">
                                                {appointment.location?.name}
                                                </div>
                                                <p className="text-sm text-gray-800 mb-1">
                                                    {appointment.location?.address}
                                                </p>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-800">
                                                    <span className="font-bold">Appointment date:</span> 
                                                <p key='start'>{date} at {time}</p>
                                                </div >
                                                <hr className="border-white mb-2 mt-2 mr-5" />
                                                <span className="font-bold text-sm text-gray-800">Description:</span>
                                                    {appointment.description && (
                                                        <div className="text-sm text-gray-800 mt-2">
                                                            {appointment.description}
                                                        </div>
                                                    )}  
                                            </div>
                                        </div>
                                        
                                        
                                    </div>
                                {new Date(appointment.start) > new Date() && (
                                    <div className="absolute top-7 right-4 flex flex-col gap-2">
                                        <Link
                                            href={`/profile/${patientData.id}/appointments/edit/${appointment.id}`}
                                            className="p-1 rounded-lg transition-colors text-center font-bold hover:text-white hover:bg-orange-500"
                                            title="Edit appointment"
                                        >
                                            Edit
                                        </Link>
                                        <DeleteButton id={appointment.id} />
                                    </div>
                                )}
                                    
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        }
    ];

    return (
        <main>
        <div className="grid grid-cols-8 gap-4 pb-10">
            <div className="col-span-1 lg:col-start-3 lg:col-span-4 py-10 px-4">
                <div className="bg-gray-200 rounded-lg p-8 shadow-md">
                    <h1 className="font-bold text-3xl text-gray-800 mb-8 text-center">My Profile</h1>

                    <div className="flex flex-wrap justify-center gap-2 mb-8 border-b-2 border-gray-400">
                        {tabData.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 sm:px-6 py-3 font-bold text-sm sm:text-base transition-all ${
                                    activeTab === tab.id
                                        ? 'text-emerald-900 border-b-4 border-emerald-900 -mb-0.5'
                                        : 'text-gray-600 hover:text-emerald-700'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="py-6">
                        {tabData.find(tab => tab.id === activeTab)?.content}
                    </div>
                </div>
            </div>
            <div className="col-span-1 h-50 lg:col-start-7 lg:col-span-2 py-5 px-5 my-10 mx-4 lg:mx-0 bg-gray-200 rounded-lg shadow-md">
                <div>
                    <h3 className="text-xl lg:text-2xl text-gray-800 font-bold text-center mb-2">Need help?</h3>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed text-center pb-4">
                        Don&apos;t hesitate to schedule an appointment at one of our locations.
                    </p>
                </div>
                <div className="text-center">
                    <Link href="/book" className="w-full block">
                        <button className="w-full px-4 py-3 text-sm sm:text-base font-bold text-white bg-emerald-900 hover:bg-emerald-700 rounded-md shadow-md transition-colors">
                            Book appointment
                        </button>
                    </Link>
                </div>
            </div>
        </div>
        
    </main>
    );
}