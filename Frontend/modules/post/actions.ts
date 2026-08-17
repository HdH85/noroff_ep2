'use server';
import { redirect } from "next/navigation";
import { APPOINTMENTS_API_URL } from "@/lib/constants";
import{ PATIENT_API_URL } from "@/lib/constants";
import { appointmentSchema } from "@/lib/schemas";
import { patientSchema } from "@/lib/schemas";

export async function newAppointment(
    prevState: { message: string; success: boolean },
    formData: FormData,
) {
    const data = Object.fromEntries(
        Array.from(formData.entries()).filter(([key]) => !key.startsWith('$'))
    );

    const parsedPatient = patientSchema.safeParse(data);
    if (!parsedPatient.success) {
        return { message: parsedPatient.error.issues[0].message, success: false };
    }

    const patientRes = await fetch(`${PATIENT_API_URL}guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedPatient.data),
    });

    if (!patientRes.ok) {
        const error = await patientRes.text();
        return { message: `Failed to book appointment: ${error}`, success: false };
    }

    const newPatient = await patientRes.json();

    data.patientId = newPatient.id;

    const date = data.date as string;
    const time = data.start as string;

    if (date && time) {
        data.start = `${date}T${time}`;
    }
    delete data.date;

    const parsedAppointment = appointmentSchema.safeParse(data);
    if (!parsedAppointment.success) {
        return { message: parsedAppointment.error.issues[0]?.message, success: false };
    }

    const appointmentRes = await fetch(`${APPOINTMENTS_API_URL}book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedAppointment.data),
    })

   if (!appointmentRes.ok) {
        const error = await appointmentRes.text();
        return { message: `Appointment creation failed: ${error}`, success: false };
    }

    redirect('/');
};