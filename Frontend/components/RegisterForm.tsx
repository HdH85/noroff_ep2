'use client';
import { useActionState, useEffect } from "react";
import { registerPatient } from "@/modules/auth/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface IGender {
    id: number,
    name: string;
};

const InitialState = {
    message: '',
    success: false,
};

function RegisterForm({
    genders
}: {
    genders: IGender[];
}) {
    const [state, dispatch] = useActionState(registerPatient, InitialState);
    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            router.push('/login');
        }
    }, [state.success, router]);

    return (
        <div className="text-center max-w-lg mx-auto bg-gray-200 rounded-xl p-5 mb-10 shadow-md">
            {state?.message && !state.success && (
                <div className="border px-4 py-3 rounded-lg mb-6 bg-red-900/20 border-red-800 text-red-400">
                    {state.message}
                </div>
            )}

            <form 
            action={dispatch}
            className="py-10"
            >
                <div className="mb-6">
                    <label htmlFor="email" className="block mb-2.5 text-sm font-bold text-gray-500 text-left">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="text"
                        placeholder="Email"
                        autoComplete="email"
                        className="text-sm rounded-lg block w-full px-3 py-2.5 bg-white placeholder-gray-400 text-black"
                        required 
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block mb-2.5 text-sm font-bold text-gray-500 text-left">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="text-sm rounded-lg block w-full px-3 py-2.5 bg-white placeholder-gray-400 text-black"
                        required 
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block mb-2.5 text-sm font-bold text-gray-500 text-left">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="confirmPassword"
                        placeholder="••••••••"
                        className="text-sm rounded-lg block w-full px-3 py-2.5 bg-white placeholder-gray-400 text-black"
                        required 
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="firstname" className="block mb-2.5 text-sm font-bold text-gray-500 text-left">
                        First name
                    </label>
                    <input
                        id="firstname"
                        name="firstname"
                        type="text"
                        placeholder="First name"
                        autoComplete="firstname"
                        className="text-sm rounded-lg block w-full px-3 py-2.5 bg-white placeholder-gray-400 text-black"
                        required 
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="lastname" className="block mb-2.5 text-sm font-bold text-gray-500 text-left">
                        Last name
                    </label>
                    <input
                        id="lastname"
                        name="lastname"
                        type="text"
                        placeholder="Last name"
                        autoComplete="lastname"
                        className="text-sm rounded-lg block w-full px-3 py-2.5 bg-white placeholder-gray-400 text-black"
                        required 
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="birthdate" className="block mb-2.5 text-sm font-bold text-gray-500 text-left">
                        Birthdate
                    </label>
                    <input
                        id="birthdate"
                        name="birthdate"
                        type="date"
                        className="text-sm rounded-lg block w-full px-3 py-2.5 bg-white text-black"
                        max={new Date().toISOString().split("T")[0]}
                        required 
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="genderId" className="block mb-2.5 text-sm font-bold text-gray-500 text-left">
                        Gender
                    </label>
                    <select
                        id="genderId"
                        name="genderId"
                        defaultValue=""
                        className="text-sm rounded-lg block w-full px-3 py-2.5 bg-white text-black"
                        required
                    >
                        <option value=""></option>
                        {genders.map((gender) => (
                            <option key={gender.id} value={gender.id}>
                                {gender.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label htmlFor="religion" className="block mb-2.5 text-sm font-bold text-gray-500 text-left">
                        Religion
                    </label>
                    <input
                        id="religion"
                        name="religion"
                        type="text"
                        placeholder="Religion"
                        autoComplete="religion"
                        className="text-sm rounded-lg block w-full px-3 py-2.5 bg-white placeholder-gray-400 text-black"
                        required 
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="ssn" className="block mb-2.5 text-sm font-bold text-gray-500 text-left">
                        Social security number
                    </label>
                    <input
                        id="ssn"
                        name="ssn"
                        type="text"
                        placeholder="Social security number"
                        autoComplete="ssn"
                        className="text-sm rounded-lg block w-full px-3 py-2.5 bg-white placeholder-gray-400 text-black"
                        required 
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="taxNumber" className="block mb-2.5 text-sm font-bold text-gray-500 text-left">
                        Tax number
                    </label>
                    <input
                        id="taxNumber"
                        name="taxNumber"
                        type="text"
                        placeholder="Tax number"
                        autoComplete="taxNumber"
                        className="text-sm rounded-lg block w-full px-3 py-2.5 bg-white placeholder-gray-400 text-black"
                        required 
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="driversLicenseNumber" className="block mb-2.5 text-sm font-bold text-gray-500 text-left">
                        Drivers license number
                    </label>
                    <input
                        id="driversLicenseNumber"
                        name="driversLicenseNumber"
                        type="text"
                        placeholder="Drivers license number"
                        autoComplete="driversLicenseNumber"
                        className="text-sm rounded-lg block w-full px-3 py-2.5 bg-white placeholder-gray-400 text-black"
                        required 
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="medicalInsuranceNumber" className="block mb-2.5 text-sm font-bold text-gray-500 text-left">
                        Medical Insurance number
                    </label>
                    <input
                        id="medicalInsuranceNumber"
                        name="medicalInsuranceNumber"
                        type="text"
                        placeholder="Medical Insurance number"
                        autoComplete="medicalInsuranceNumber"
                        className="text-sm rounded-lg block w-full px-3 py-2.5 bg-white placeholder-gray-400 text-black"
                        required 
                    />
                </div>

                <button 
                    type="submit"
                    className="w-30 mx-5 focus:ring-4 focus:outline-none font-bold rounded-lg text-sm px-5 py-2.5 text-center bg-emerald-900 hover:bg-green-600 focus:ring-primary-800"
                >
                    Register
                </button>

                <Link href="/">
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

export default RegisterForm;