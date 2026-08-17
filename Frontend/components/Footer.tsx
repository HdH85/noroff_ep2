import Image from "next/image";

const Footer = async () => {
    const year = new Date().getFullYear();
    return (
        <footer className="w-full bg-teal-700 text-white mt-auto">
            <div className="grid grid-cols-6 gap-4">
                <div className="col-start-1 col-span-1">
                    <div className="py-12 px-10">
                        <Image
                            src="/EP2_logo.png"
                            width={50}
                            height={50}
                            alt="Logo"
                            unoptimized
                            />
                    </div>

                </div>
                <div className="col-start-2 col-span-4 py-6">
                    <div className="grid grid-cols-3 gap-8">
                        
                        <div>
                            <h3 className="text-lg font-bold mb-4">HealthCare</h3>
                            <p className="text-sm text-gray-300">
                                Providing quality healthcare services with compassion and excellence.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li><a href="/clinics" className="hover:text-white transition-colors">Find a Clinic</a></li>
                                <li><a href="/search" className="hover:text-white transition-colors">Our Doctors</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-4">Contact</h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li><span className="font-semibold text-white">Phone:</span> <p>(555) 123-4567</p></li>
                                <li><span className="font-semibold text-white">Email:</span> <p>info@healthcare.com</p></li>
                                <li><span className="font-semibold text-white">Hours:</span> <p>Mon-Fri 8AM-6PM</p></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-300 mt-6 pt-4 text-center">
                        <span className="text-sm text-gray-300">
                            © {year} <span className="font-semibold text-white">Håkon D. Håheim</span>. All Rights Reserved.
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;