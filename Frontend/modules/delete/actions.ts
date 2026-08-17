'use server';
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { APPOINTMENTS_API_URL } from "@/lib/constants";

export async function deleteAppointment(id: number) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return { error: 'Only patients with a registered account can delete appointments.' };
    }

    const response = await fetch(`${APPOINTMENTS_API_URL}${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message ||  'Failed to delete entry.');
    }

    revalidatePath('/appointment');
};