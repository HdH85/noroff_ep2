import Link from "next/link"
import Image from "next/image";

export default function LandingPage() {
    return (
        <div className="col-start-2 col-span-4 mt-20">

          <div className="text-center max-w-2xl mx-auto">
              

              <Link href="/book">
                <button className="px-6 py-4 text-xl font-bold text-white bg-emerald-900 hover:bg-emerald-700 rounded-md shadow-md transition-colors">
                  Book appointment
                </button>
              </Link>
            </div>

            <hr className="border-white mb-10 mt-10" />

          <div className="mx-auto p-5">
            <div className="text-center max-w-2xl mx-auto bg-gray-200 rounded-lg p-5 shadow-md">
              <h2 className="text-3xl font-bold text-emerald-900 mb-4">
                Quality Healthcare at Your Fingertips
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-6">
                Schedule appointments with top-rated doctors across multiple specialties and locations. 
                Whether you&apos;re a registered patient or booking as a guest, our platform makes healthcare 
                accessible and convenient.
              </p>
              <hr className="border-white mb-4 mt-4" />
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div>
                  <h3 className="text-xl font-semibold text-emerald-900 mb-2">Easy Booking</h3>
                  <p className="text-gray-500 text-sm">
                    Select your preferred doctor, location, and time slot in just a few clicks
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-emerald-900 mb-2">Expert Care</h3>
                  <p className="text-gray-500 text-sm">
                    Access qualified specialists across various medical fields
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-emerald-900 mb-2">Manage Online</h3>
                  <p className="text-gray-500 text-sm">
                    View, update, or cancel your appointments anytime from your profile
                  </p>
                </div>
              </div>
              <hr className="border-white mb-4 mt-4" />
              <h3 className="text-xl font-semibold text-emerald-900 mb-2">Get your account today</h3>
              <div className=" mt-8 text-center max-w-2xl mx-auto">
                <Link href="/register">
                <button className="px-6 py-4 text-xl font-bold text-white bg-cyan-600 hover:bg-cyan-400 rounded-md shadow-md transition-colors">
                  Register here
                </button>
              </Link>
              </div>
            </div>
          </div>

          <hr className="border-white mb-10 mt-10" />

          <div className="mx-auto p-5">
            <div className="text-center max-w-2xl mx-auto bg-gray-200 rounded-lg p-5 shadow-md">
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div>
                  <Link href="/clinics" className="group block">
                    <Image
                      src="/houseSymbol.png"
                      alt="logo"
                      width={100}
                      height={100}
                      className="logo mx-auto"
                      unoptimized
                    />
                    <h3 className="text-xl font-semibold text-emerald-900 mb-2 hover:text-emerald-700 group-hover:underline">
                      Our locations
                    </h3>
                  </Link>
                  <p className="text-gray-500 text-sm">
                    Find the locations nearest to you.
                  </p>
                </div>
                <div>
                  <Link href="/search" className="group block">
                    <Image
                      src="/doctor.png"
                      alt="logo"
                      width={100}
                      height={100}
                      className="logo mx-auto"
                      unoptimized
                    />
                    <h3 className="text-xl font-semibold text-emerald-900 mb-2 hover:text-emerald-700 group-hover:underline">
                      Our doctors
                    </h3>
                  </Link>
                  <p className="text-gray-500 text-sm">
                    Search and find one of our many experts in a wide variety of fields.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
};