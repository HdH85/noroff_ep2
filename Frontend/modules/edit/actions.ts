'use server'
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { APPOINTMENTS_API_URL } from "@/lib/constants";
import { editAppointmentSchema } from "@/lib/schemas";

type ActionState = {
    message: string;
    success: boolean;
}

export async function editAppointment(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return { message: 'Valid patient account required to edit your appointment', success: false };
    }

    const data = Object.fromEntries(
        Array.from(formData.entries()).filter(([key]) => !key.startsWith('$'))
    );

    const date = data.date as string;
    const time = data.start as string;
    
    if (date && time) {
        data.start = `${date}T${time}`;
    }
    delete data.date;

   const parsed = editAppointmentSchema.safeParse(data);

   if (!parsed.success) {
    return { message: parsed.error.issues[0]?.message, success: false };
   }

    const response = await fetch(`${APPOINTMENTS_API_URL}${parsed.data.id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(parsed.data),
    });

    if (!response.ok) {
        const result = await response.text();
        return{ message: result || 'Appointment data update failed.', success: false };
    }

    revalidatePath('/profile/[id]/appointments');
    return { message: 'Appointment updated successfully!', success: true };
};