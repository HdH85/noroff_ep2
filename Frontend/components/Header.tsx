import Navbar from "./Navbar";
import { cookies } from "next/headers";

const Header = async () => {
    const cookie = await cookies();
    const token = cookie.get('token')?.value;
    let patientId: string | null = null;
    let expiresAt: number | null = null;

    if (token) {
        const base64Payload = token.split('.')[1];
        const payload = JSON.parse(atob(base64Payload));
            
        patientId = payload.patientId || payload.sub || payload.id;
        expiresAt = payload.exp || null;
    }

    return (
        <header>
            <Navbar isLoggedIn={!!token} patientId={patientId} expiresAt={expiresAt} />
        </header>
    );
};

export default Header;