'use client';
import { useState } from 'react';
import { DOCTORSEARCH_API_URL } from '@/lib/constants';
import Image from 'next/image';

interface IDoctorSearch {
    fullName: string;
    imageUrl: string;
    locationName: string;
    specialty: string;
}

export default function DoctorSearch() {
    const [search, setSearch] = useState('');
    const [doctors, setDoctors] = useState<IDoctorSearch[]>([]);
    const [error, setError] = useState<string>('');

    const searchHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearch(query);

        if (!query.trim()) {
            setDoctors([]);
            setError('');
            return;
        }

        try {
            const res = await fetch(`${DOCTORSEARCH_API_URL}?query=${e.target.value}`);

            if (!res.ok) {
                const errorText = await res.json();
                setError(errorText);
                setDoctors([]);
                return;
            }
            const data = await res.json();
             console.log('Search results:', data);
            setDoctors(data);
            setError('');
        } catch (error) {
            console.error('Search error:', error);
            setError('Failed to search doctors');
            setDoctors([]);
        }
    }

    return (
        <div className="max-w-md mx-auto">
            <input
            placeholder="Find a doctor..."
            value={search}
            onChange={searchHandler}
            className="text-sm rounded-lg block w-100 px-3 py-2.5 bg-white placeholder-gray-400 text-black"            
            />
            {error && (
                <div className="text-red-500 mt-2">{error}</div>
            )}
            {!error && search.trim() && doctors.length === 0 && (
                <div className="text-gray-600 font-bold mt-4 text-center">
                    No results found matching &quot;{search}&quot;
                </div>
            )}
            
            <div className="py-10">
                {doctors.map((doc, i) => (
                    <div 
                        key={i} 
                        className="flex items-center w-100 gap-4 p-4 bg-gray-200 shadow-md rounded-lg mb-5 mt-5"
                    >
                        <div className="shrink-0 w-16 h-16 relative overflow-hidden rounded-full bg-gray-700">
                            <Image
                                src={doc.imageUrl || '/default-doctor.jpg'}
                                alt={`${doc.fullName} profile`}
                                fill
                                unoptimized={true}
                                className="object-cover"
                            />
                        </div>
                        
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {doc.fullName}
                            </h3>
                            <p className="text-sm text-gray-800">
                                {doc.specialty}
                            </p>
                            <p className="text-sm text-gray-800">
                                {doc.locationName}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};