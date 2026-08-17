import Image from "next/image";
import { LOCATIONS_API_URL } from "@/lib/constants";

interface ISpecialty {
    id: number;
    name: string;
}

interface IDoctor {
    id: number;
    firstname: string;
    lastname: string;
    specialty?: ISpecialty;
    imageUrl: string;
}

interface ILocation {
    id: number;
    name: string;
    address: string;
    doctors?: IDoctor[];
    imageUrl?: string;
}

export default async function ClinicsList() {
    const response = await fetch(LOCATIONS_API_URL, {
        headers: { 'Content-type': 'application/json' }
    });
    
    const locations: ILocation[] = await response.json();

    return (
        <div className="grid grid-cols-5 gap-6 p-6">
            {locations.map((location) => (
                <div key={location.id} className="bg-gray-200 rounded-xl shadow-md col-span-3 col-start-2 ">
                    
                    <div className="grid grid-cols-4 gap-4 ">

                        <div className="col-span-2  rounded-lg">
                            <div className="w-full aspect-square relative overflow-hidden rounded-l-xl">
                                <Image 
                                    src={location.imageUrl || '/houseSymbol.png'}
                                    alt={location.name}
                                    fill
                                    unoptimized={true}
                                    className="object-cover overflow-hidden"               
                                />
                            </div>
                        </div>
                        
                        <div className="col-span-2 flex flex-col mt-5">
                            <h2 className="text-cyan-900 font-bold text-3xl mb-4">{location.name}</h2>
                            <h3 className="text-cyan-900 text-xl font-semibold mb-2">Address</h3>
                            <span className="text-gray-500 text-l font-bold">{location.address}</span>

                            <hr className="border-white mb-4 mt-4 mr-2 ml-2" />

                            <h3 className="text-cyan-900 text-xl font-semibold mb-2">Doctors</h3>
                            {location.doctors && location.doctors.length > 0 && (
                                <ul className="space-y-2">
                                    {location.doctors.map((doctor) => (
                                        <li key={doctor.id} className="flex items-center gap-2">
                                            <div className="shrink-0 w-16 h-16 relative overflow-hidden rounded-full bg-gray-700 mr-5">
                                                <Image 
                                                    src={doctor.imageUrl || '/default-doctor.jpg'}
                                                    alt="image"
                                                    fill
                                                    unoptimized={true}
                                                    className="object-cover"               
                                                />
                                            </div>
                                            <span className="text-gray-500 text-l font-bold">Dr. {doctor.firstname} {doctor.lastname}</span>
                                            <span className="text-gray-500 text-l">- {doctor.specialty?.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};