import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Redirect() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if(!token) {
        redirect('/login');
    }

    const content = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
    );

    const patientId = content.patientId;

    redirect(`/profile/${patientId}`);
};