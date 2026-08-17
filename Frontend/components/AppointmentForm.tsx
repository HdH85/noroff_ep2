'use client';
import { useActionState, useEffect, useState } from "react";
import { newAppointment } from "@/modules/post/actions";
import { editAppointment } from "@/modules/edit/actions";
import { useRouter } from "next/navigation"; 
import { AVAILABLE_SLOTS_API_URL } from "@/lib/constants";
import Link from "next/link";

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
    id: number,
    name: string;
};

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
    doctorId: number;
    location?: ILocation;
    locationId: number;
    start: Date;
    end: Date;
    description: string;
}

interface IBookingFormProps {
    locations: ILocation[];
    doctors: IDoctor[];
    genders: IGender[];
    patient?: IPatient;
    isLoggedIn: boolean;
    isEdit?: boolean;
    appointment?: IAppointment;
    patientId?: string | number;
}

const initialState = {
    message: '',
    success: false,
};

export default function AppointmentForm({ 
    locations, 
    doctors,
    genders,
    patient,
    isLoggedIn,
    isEdit = false,
    appointment,
    patientId
}: IBookingFormProps) {
    const [state, dispatch] = useActionState(isEdit ? editAppointment : newAppointment, initialState);
    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            if (isEdit && patientId) {
                router.push(`/profile/${patientId}`);
            } else {
                router.push('/');
            }
        }
    }, [state.success, router, isEdit, patientId]);

    const initialLocationId = isEdit && appointment?.locationId ? appointment.locationId : null;
    const [chosenLocationId, setChosenLocationId] = useState<number | null>(initialLocationId);
    const filteredDocs = chosenLocationId
        ? doctors.filter(l => l.location?.id === chosenLocationId)
        : doctors;
    
    const initialDoctorId = isEdit && appointment?.doctorId ? appointment.doctorId : null;
    const [chosenDoctorId, setChosenDoctor] = useState<number | null>(initialDoctorId);

    const initialDate = isEdit && appointment?.start ? new Date(appointment.start) : null;
    const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate); 

    const initialTime = isEdit && appointment?.start ? new Date(appointment.start).toTimeString().slice(0, 5) : null;
    const [selectedTime, setSelectedTime] = useState<string | null>(initialTime);
    const [availableSlots, setAvailableSlots] = useState<string[]>(initialTime ? [initialTime] : []);

     useEffect(() => {
        if (!chosenDoctorId || !selectedDate) {
            return;
        }
    
        const getSlots = async () => {
            try {
                const date = selectedDate.toISOString().split('T')[0];
                console.log('📡 Fetching slots for:', { doctorId: chosenDoctorId, date });
                const result = await fetch(
                    `${AVAILABLE_SLOTS_API_URL}?doctorId=${chosenDoctorId}&date=${date}`
                );

                if (!result.ok) {
                    console.error('Failed to fetch slots', result.status);
                    return;
                }

                let slots = await result.json();

                if (isEdit && initialTime && !slots.includes(initialTime)) {
                    slots = [...slots, initialTime].sort();
                }

                setAvailableSlots(slots);
            } catch (error) {
                console.error('Error fetching slots:', error);
            }
            
        };

        getSlots();
     }, [chosenDoctorId, selectedDate, isEdit, initialTime])

    return (
        <div className="max-w-lg mx-auto my-20 text-center bg-gray-200 rounded-xl p-5 shadow-md">
            {state?.message && !state.success && (
                <div className="border px-4 py-3 rounded-lg mb-6 bg-red-900/20 border-red-800 text-red-400">
                    {state.message}
                </div>
            )}

            <form 
            action={dispatch}
            className="py-10"
            >
                {isEdit && (
                    <>
                        <input type="hidden" name="id" value={appointment?.id || ''} readOnly />
                        <input type="hidden" name="patientId" value={patientId || ''} readOnly />
                        <input type="hidden" name="doctorId" value={chosenDoctorId || ''} readOnly />
                        <input type="hidden" name="locationId" value={chosenLocationId || ''} readOnly />
                        <input type="hidden" name="date" value={selectedDate?.toISOString().split('T')[0] || ''} readOnly />
                        <input type="hidden" name="start" value={selectedTime || ''} readOnly />
                        <input 
                            type="hidden" 
                            name="duration" 
                            value={
                                appointment?.start && appointment?.end 
                                    ? Math.round((new Date(appointment.end).getTime() - new Date(appointment.start).getTime()) / 60000)
                                    : 30
                            } 
                            readOnly 
                        />
                    </>
                )}

                {!isEdit && (
                    <>

                        <div className="mb-6 grid grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="firstname" className="block mb-2.5 text-sm font-bold text-gray-800 text-left">
                                    First name
                                </label>
                                <input
                                    id="firstname"
                                    name="firstname"
                                    type="text"
                                    placeholder="First name"
                                    autoComplete="firstname"
                                    defaultValue={isLoggedIn ? patient?.firstname ?? '' : ''}
                                    className="text-sm rounded-lg block w-full px-3 py-2.5 bg-white placeholder-gray-400 text-black"
                                    required 
                                />
                            </div>
                            <div>
                                <label htmlFor="lastname" className="block mb-2.5 text-sm font-bold text-gray-800 text-left">
                                    Last name
                                </label>
                                <input
                                    id="lastname"
                                    name="lastname"
                                    type="text"
                                    placeholder="Last name"
                                    autoComplete="lastname"
                                    defaultValue={isLoggedIn ? patient?.lastname ?? '' : ''}
                                    className="text-sm rounded-lg block w-full px-3 py-2.5 bg-white placeholder-gray-400 text-black"
                                    required 
                                />
                            </div>
                            
                        </div>
                        <div className="mb-6">
                            <label htmlFor="email" className="block mb-2.5 text-sm font-bold text-gray-800 text-left">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="text"
                                placeholder="Email"
                                autoComplete="email"
                                defaultValue={isLoggedIn ? patient?.email ?? '' : ''}
                                className="text-sm rounded-lg block w-full px-3 py-2.5 bg-white placeholder-gray-400 text-black"
                                required 
                            />
                        </div>

                        <div className="mb-6">
                            
                        </div>

                        <div className="mb-6">
                            <label htmlFor="birthdate" className="block mb-2.5 text-sm font-bold text-gray-800 text-left">
                                Birthdate
                            </label>
                            <input
                                id="birthdate"
                                name="birthdate"
                                type="date"
                                defaultValue={isLoggedIn && patient?.birthdate ? new Date(patient.birthdate).toISOString().split("T")[0] ?? '' : ''}
                                className="text-sm rounded-lg block w-full px-3 py-2.5 bg-white placeholder-gray-400 text-black"
                                max={new Date().toISOString().split("T")[0]}
                                required 
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="genderId" className="block mb-2.5 text-sm font-bold text-gray-800 text-left">
                                Gender
                            </label>
                            <select
                                id="genderId"
                                name="genderId"
                                defaultValue={isLoggedIn ? patient?.gender.id ?? '' : ''}
                                className="text-sm rounded-lg block w-full px-3 py-2.5 bg-white placeholder-gray-400 text-black"
                                required
                            >
                                <option value="" disabled hidden></option>
                                {genders.map((gender) => (
                                    <option key={gender.id} value={gender.id}>
                                        {gender.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                <div className="mb-6">
                    <label htmlFor="locationId" className="block mb-2.5 text-sm font-bold text-gray-800 text-left">
                        Location
                    </label>
                    <select
                        id="locationId"
                        name={!isEdit ? "locationId" : undefined}
                        value={chosenLocationId || ''}
                        onChange={(e) => {
                            const newLocId = Number(e.target.value);
                            setChosenLocationId(newLocId);
                            setChosenDoctor(null);
                            setSelectedDate(null);
                            setAvailableSlots([]);
                            setSelectedTime(null);
                        }}
                        disabled={isEdit}
                        className="text-sm rounded-lg block w-full px-3 py-2.5 bg-white placeholder-gray-400 text-black disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                    >
                        <option value="" disabled hidden></option>
                        {locations.map((location) => (
                            <option key={location.id} value={location.id}>
                                {location.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label htmlFor="doctorId" className="block mb-2.5 text-sm font-bold text-gray-800 text-left">
                        Doctor
                    </label>
                    <select
                        id="doctorId"
                        name={!isEdit ? "doctorId" : undefined}
                        disabled={isEdit || !chosenLocationId || filteredDocs.length === 0}
                        value={chosenDoctorId || ''}
                        onChange={(e) => {
                            setChosenDoctor(parseInt(e.target.value));
                            setAvailableSlots([]);
                            setSelectedTime(null);

                            if (!selectedDate) {
                                setSelectedDate(new Date());
                            }
                        }}
                        className="text-sm rounded-lg block w-full px-3 py-2.5 bg-white placeholder-gray-400 text-black disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                    >   <option value="" disabled hidden></option>
                        {filteredDocs.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                Dr. {doctor.firstname} {doctor.lastname}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-5">
                    <div>
                        <label htmlFor="date" className="block mb-2.5 text-sm font-bold text-gray-800 text-left">
                            Date
                        </label>
                        <input
                            type="date"
                            name={!isEdit ? "date" : undefined}
                            disabled={!chosenDoctorId}
                            defaultValue={selectedDate ? selectedDate.toISOString().split("T")[0] : ''}
                            className="text-sm rounded-lg block w-50 px-3 py-2.5 bg-white placeholder-gray-400 text-black disabled:opacity-50 disabled:cursor-not-allowed"
                            onChange={(e) => {
                                setSelectedDate(new Date(e.target.value));
                                setSelectedTime(null);
                            }}
                            min={new Date().toISOString().split("T")[0]}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="timeSlot" className="block mb-2.5 text-sm font-bold text-gray-800 text-left">
                            Time
                        </label>
                        <select
                            id="timeSlot"
                            name={!isEdit ? "start" : undefined}
                            value={selectedTime || ''}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            disabled={!selectedDate || availableSlots.length === 0}
                            className="text-sm rounded-lg w-50 px-3 py-2.5 bg-white placeholder-gray-400 text-black disabled:opacity-50 disabled:cursor-not-allowed"
                            required
                        >
                            <option value={""}>Select time</option>
                            {availableSlots.map((slot) => (
                                <option key={slot} value={slot}>
                                    {slot.slice(0, 5)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="description" className="block mb-2.5 text-sm font-bold text-gray-800 text-left">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name='description'
                        placeholder="Give a brief optional description of any symptoms."
                        defaultValue={isEdit ? appointment?.description : ''}
                        className="text-sm rounded-lg block w-full px-3 py-2.5 bg-white placeholder-gray-400 text-black"
                        rows={3}
                    />
                </div>

                <button 
                    type="submit"
                    disabled={!selectedTime}
                    className="w-30 mx-5 focus:ring-4 focus:outline-none font-bold rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-gray-400 bg-emerald-900 hover:bg-emerald-700 focus:ring-primary-800 "
                >
                    {isEdit ? 'Update' : 'Submit'}
                </button>
                <Link href={isEdit ? `/profile/${patientId}` : "/"}>
                    <button
                        type="button"
                        className="w-30 mx-5 focus:ring-4 focus:outline-none font-bold rounded-lg text-sm px-5 py-2.5 text-center  bg-gray-500 hover:bg-blue-400 focus:ring-primary-800 "
                        >
                        Return
                    </button>
                </Link>

            </form>
        </div>
    );
};