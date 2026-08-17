import RegisterForm from "@/components/RegisterForm";
import { GENDERS_API_URL } from "@/lib/constants";

interface IGender {
    id: number;
    name: string;
}

export default async function Register() {
    let genders: IGender[] = [];

    try {
        const response = await fetch(GENDERS_API_URL, {
            cache: 'no-store'
        });

        if (response.ok) {
            genders = await response.json();
        }
    }catch(error) {
        console.error('Gender fetch error:', error);
    }

    return (
        <div>
            <h1 className="text-center py-15 text-xl font-semibold text-cyan-900 mb-2">Create an account</h1>
            <RegisterForm genders={genders} />
        </div>
    );
};