import DoctorSearch from "@/components/DoctorSearch";

export default async function Doctors() {

    return (
        <main className="text-center py-10">
           <div className="grid grid-cols-4 gap-6 p-6">
            <div className="col-span-2 col-start-2">
                <DoctorSearch />
            </div>
           </div>
        </main>
    );
};