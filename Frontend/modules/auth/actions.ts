'use server';
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { LOGIN_API_URL, REGISTER_API_URL } from "@/lib/constants";
import { registerSchema } from "@/lib/schemas";
import { loginSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function registerPatient(
    prevState: {
        message: string;
        success?: boolean;
    },
    formData: FormData,
) {
    const data = Object.fromEntries(
        Array.from(formData.entries()).filter(([key]) => !key.startsWith('$'))
    );

    const parsedInfo = registerSchema.safeParse(data);

    if (!parsedInfo.success) {
        return { message: parsedInfo.error.issues[0]?.message, success: false };
    }

    const { confirmPassword, birthdate, ...rest } = parsedInfo.data;

    const payload = {
        ...rest,
        birthdate: birthdate.toISOString().split('T')[0]
    };
    
    try {
        const response = await fetch(REGISTER_API_URL, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(payload)
        })  
        
        if (!response.ok) {
            const text = await response.text();
            return { message: text || 'Registration failed.', success: false };
        }

        return { message: 'Registration successfull!', success: true };
    } catch(error) {
        console.error('Registration error:', error);
        return { message: 'Registration failed.', success: false };
    }
};

export async function loginPatient(
    prevState: {
        message: string;
        success?: boolean;
    },
    formData: FormData,
) {
    const data = Object.fromEntries(
        Array.from(formData.entries()).filter(([key]) => !key.startsWith('$'))
    );

    const parsedInfo = loginSchema.safeParse(data);

    if (!parsedInfo.success) {
        return { message: parsedInfo.error.issues[0]?.message, success: false };
    }

    try {
        const response = await fetch(LOGIN_API_URL, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(parsedInfo.data),
        });

        if (!response.ok) {
            const text = await response.text();
            return { message: text, success: false };
        }

        const json = await response.json();

        const cookieFetch = await cookies();
        cookieFetch.set('token', json.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 1,
        })

        return { message: `Logged in user: ${json.Email}`, success: true};
    } catch(error) {
        console.error('Login error:', error);
        return { message: 'Login attempt failed.', success: false };
    }
};

export async function logoutPatient() {
    const cookie = await cookies();
    await cookie.delete('token');
    revalidatePath('/', 'layout');
    redirect('/login');
};