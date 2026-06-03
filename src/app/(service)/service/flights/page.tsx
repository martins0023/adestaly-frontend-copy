"use client"
import BalanceDashboard from '@/src/components/Dashboard/BalanceDashboard';
import Btn from '@/src/components/Form/Btn';
import Input from '@/src/components/Form/Input';
import { useAppContext } from '@/src/context/AppContextProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { readSessionPayload } from '@/src/config/session';
import BackButton from '@/src/components/BackButton';
import { UseGetApi, UsePostApi } from '@/src/config/Action';
import { FaPlane, FaSearch, FaUser, FaClock, FaCheck, FaExchangeAlt } from 'react-icons/fa';

const Flights = () => {
    const router = useRouter();
    const { initializeBillPayment } = useAppContext();

    const [searchParams, setSearchParams] = useState({
        origin: 'LOS',
        destination: 'ABV',
        departureDate: new Date().toISOString().split('T')[0],
        cabinClass: 'economy',
        passengersCount: '1'
    });

    const [flights, setFlights] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<any | null>(null);

    // Passenger Form Info
    const [passengers, setPassengers] = useState<any[]>([
        { firstName: '', lastName: '', email: '', phone: '', gender: 'm', title: 'mr' }
    ]);

    const [userEmail, setUserEmail] = useState('');
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        const getInfo = async () => {
            const userInfo = await readSessionPayload();
            setUserEmail(userInfo?.email as string || '');
            setPassengers([{ firstName: userInfo?.firstName || '', lastName: userInfo?.lastName || '', email: userInfo?.email || '', phone: userInfo?.phone || '', gender: 'm', title: 'mr' }]);
        };
        getInfo();
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const handlePassengerChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updated = [...passengers];
        updated[index] = { ...updated[index], [name]: value };
        setPassengers(updated);
    };

    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();
        setIsSearching(true);
        setSelectedOffer(null);
        try {
            const res = await UseGetApi('api/flight/search', {
                from: searchParams.origin,
                to: searchParams.destination,
                q: searchParams.departureDate,
                status: searchParams.cabinClass,
                limit: searchParams.passengersCount
            });

            if (res.success && Array.isArray(res.data)) {
                setFlights(res.data);
                if (res.data.length === 0) {
                    toast.error("No flights found matching criteria.");
                } else {
                    toast.success(`Found ${res.data.length} flights!`);
                }
            } else {
                toast.error(res.message || "Failed to load flights");
            }
        } catch (error) {
            toast.error("Flight search failed");
        } finally {
            setIsSearching(false);
        }
    };

    const handleBookAndPay = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedOffer) return;

        // Form validation
        for (let i = 0; i < passengers.length; i++) {
            const p = passengers[i];
            if (!p.firstName || !p.lastName || !p.email || !p.phone) {
                toast.error(`Please fill in passenger ${i + 1} details fully`);
                return;
            }
        }

        setIsBooking(true);
        try {
            const paymentRef = "FLT-" + Date.now() + "-" + Math.floor(Math.random() * 1e6);

            // 1. Create flight booking on backend
            const bookRes = await UsePostApi('api/flight/book', {
                offerId: selectedOffer.offerId,
                passengers: passengers,
                amount: selectedOffer.amount,
                paymentReference: paymentRef
            });

            if (!bookRes.success || !bookRes.data) {
                toast.error(bookRes.message || "Flight booking initialization failed");
                setIsBooking(false);
                return;
            }

            // 2. Route transaction through Paystack Checkout loop
            const payload = {
                email: userEmail,
                totalPrice: selectedOffer.amount,
                dataName: `Flight Booking (${selectedOffer.origin} to ${selectedOffer.destination})`,
                service_id: bookRes.data._id, // map booking mongo ID
                variation_code: selectedOffer.offerId,
                credit_phone: passengers[0].phone,
                request_type: "flight"
            };

            const response = await initializeBillPayment(payload);

            if (response?.success) {
                const paymentUrl = (response?.data as any)?.payment_url;
                if (paymentUrl) {
                    router.push(paymentUrl);
                } else {
                    toast.error("Payment authorization URL missing");
                }
            } else {
                toast.error(response?.message || "Failed to initiate payment gateway");
            }
        } catch (err) {
            toast.error("Error creating flight booking");
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <>
        <BackButton />
        <section className="sm:px-10 px-1 mt-15">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dashboard-container">
                <div className="w-full max-w-7xl mx-auto pt-4 relative">
                    <BalanceDashboard />
                </div>

                <div className="flex flex-col gap-8 p-3 max-w-2xl mx-auto">
                    <div className="text-center mt-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-primary text-xl">
                            <FaPlane />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mt-2">Flight Bookings</h2>
                        <p className="text-xs text-gray-500 mt-1">Book international and domestic flight tickets in minutes</p>
                    </div>

                    {/* SEARCH PANEL */}
                    {!selectedOffer && (
                        <form className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4" onSubmit={handleSearch}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] uppercase font-bold text-gray-400">Origin (IATA)</label>
                                    <Input
                                        type="text"
                                        name="origin"
                                        value={searchParams.origin}
                                        onChange={handleSearchChange}
                                        maxLength={3}
                                        className="font-bold tracking-widest text-center"
                                        placeholder="LOS"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] uppercase font-bold text-gray-400">Destination (IATA)</label>
                                    <Input
                                        type="text"
                                        name="destination"
                                        value={searchParams.destination}
                                        onChange={handleSearchChange}
                                        maxLength={3}
                                        className="font-bold tracking-widest text-center"
                                        placeholder="ABV"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] uppercase font-bold text-gray-400">Departure Date</label>
                                    <Input
                                        type="date"
                                        name="departureDate"
                                        value={searchParams.departureDate}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] uppercase font-bold text-gray-400">Class</label>
                                    <select
                                        name="cabinClass"
                                        value={searchParams.cabinClass}
                                        onChange={handleSearchChange}
                                        className="bg-[#f3f4f6] text-[12px] h-[52px] w-full border-none rounded-xl px-4 font-semibold text-gray-700 outline-none"
                                    >
                                        <option value="economy">Economy</option>
                                        <option value="premium_economy">Premium Economy</option>
                                        <option value="business">Business</option>
                                        <option value="first">First Class</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] uppercase font-bold text-gray-400">Passengers</label>
                                    <select
                                        name="passengersCount"
                                        value={searchParams.passengersCount}
                                        onChange={handleSearchChange}
                                        className="bg-[#f3f4f6] text-[12px] h-[52px] w-full border-none rounded-xl px-4 font-semibold text-gray-700 outline-none"
                                    >
                                        <option value="1">1 Passenger</option>
                                        <option value="2">2 Passengers</option>
                                        <option value="3">3 Passengers</option>
                                        <option value="4">4 Passengers</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSearching}
                                className="w-full h-[52px] bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-95 transition-all shadow-md active:scale-98"
                            >
                                <FaSearch />
                                <span>{isSearching ? 'Searching Flights...' : 'Search Flights'}</span>
                            </button>
                        </form>
                    )}

                    {/* FLIGHT LISTINGS */}
                    {!selectedOffer && flights.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-700 px-1">Available Offers</h3>
                            {flights.map((flight) => (
                                <motion.div
                                    key={flight.offerId}
                                    whileHover={{ scale: 1.01 }}
                                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 text-lg font-bold text-gray-700">
                                            {flight.airline.substring(0,2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-800">{flight.airline}</h4>
                                            <p className="text-[10px] text-gray-400 font-semibold">{flight.flightNumber} • {flight.cabinClass || "Economy"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                        <div className="text-right">
                                            <div className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                                                <FaClock /> {new Date(flight.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-0.5">{flight.origin} ➔ {flight.destination}</p>
                                        </div>
                                        
                                        <div className="text-right">
                                            <span className="block text-base font-black text-gray-900">
                                                ₦{Number(flight.amount).toLocaleString()}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    setSelectedOffer(flight);
                                                    // Ensure passengers array length matches passengersCount
                                                    const len = Number(searchParams.passengersCount);
                                                    setPassengers(Array.from({ length: len }, (_, i) => passengers[i] || { firstName: '', lastName: '', email: '', phone: '', gender: 'm', title: 'mr' }));
                                                }}
                                                className="mt-1 bg-orange-100 text-orange-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-orange-200"
                                            >
                                                Book
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* PASSENGER & CHECKOUT DETAILS */}
                    {selectedOffer && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            {/* Selected Flight Summary */}
                            <div className="bg-orange-50/50 border border-orange-200 rounded-2xl p-4 flex justify-between items-center">
                                <div>
                                    <span className="text-[10px] font-bold uppercase text-orange-600">Selected Flight</span>
                                    <h4 className="text-sm font-black text-orange-950 mt-0.5">{selectedOffer.airline} • {selectedOffer.flightNumber}</h4>
                                    <p className="text-xs text-orange-900/80 font-medium mt-0.5">{selectedOffer.origin} ➔ {selectedOffer.destination} • {new Date(selectedOffer.departureTime).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-lg font-black text-orange-950">₦{Number(selectedOffer.amount).toLocaleString()}</span>
                                    <button onClick={() => setSelectedOffer(null)} className="text-[10px] font-bold text-gray-500 hover:text-gray-700 underline mt-1">Change</button>
                                </div>
                            </div>

                            {/* Passenger Details Form */}
                            <form className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-6" onSubmit={handleBookAndPay}>
                                <h3 className="text-sm font-bold text-gray-800 border-b pb-2">Passenger Information</h3>
                                
                                {passengers.map((passenger, index) => (
                                    <div key={index} className="space-y-3 pt-2">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Passenger {index + 1}</h4>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="col-span-1">
                                                <select
                                                    name="title"
                                                    value={passenger.title}
                                                    onChange={(e) => handlePassengerChange(index, e)}
                                                    className="bg-[#f3f4f6] text-[12px] h-[52px] w-full border-none rounded-xl px-2 font-semibold text-gray-700 outline-none"
                                                >
                                                    <option value="mr">Mr.</option>
                                                    <option value="ms">Ms.</option>
                                                    <option value="mrs">Mrs.</option>
                                                    <option value="miss">Miss</option>
                                                </select>
                                            </div>
                                            <div className="col-span-1">
                                                <Input
                                                    type="text"
                                                    name="firstName"
                                                    placeholder="First Name"
                                                    value={passenger.firstName}
                                                    onChange={(e) => handlePassengerChange(index, e)}
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <Input
                                                    type="text"
                                                    name="lastName"
                                                    placeholder="Last Name"
                                                    value={passenger.lastName}
                                                    onChange={(e) => handlePassengerChange(index, e)}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                type="email"
                                                name="email"
                                                placeholder="Email Address"
                                                value={passenger.email}
                                                onChange={(e) => handlePassengerChange(index, e)}
                                            />
                                            <Input
                                                type="tel"
                                                name="phone"
                                                placeholder="Phone Number"
                                                value={passenger.phone}
                                                onChange={(e) => handlePassengerChange(index, e)}
                                            />
                                        </div>

                                        <div className="flex items-center gap-4 pl-1">
                                            <span className="text-xs font-bold text-gray-400">Gender:</span>
                                            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={`gender-${index}`}
                                                    checked={passenger.gender === 'm'}
                                                    onChange={() => {
                                                        const updated = [...passengers];
                                                        updated[index].gender = 'm';
                                                        setPassengers(updated);
                                                    }}
                                                    className="accent-primary"
                                                />
                                                Male
                                            </label>
                                            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={`gender-${index}`}
                                                    checked={passenger.gender === 'f'}
                                                    onChange={() => {
                                                        const updated = [...passengers];
                                                        updated[index].gender = 'f';
                                                        setPassengers(updated);
                                                    }}
                                                    className="accent-primary"
                                                />
                                                Female
                                            </label>
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-4 border-t">
                                    <button
                                        type="submit"
                                        disabled={isBooking}
                                        className="w-full h-[52px] bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-95 transition-all shadow-md active:scale-98"
                                    >
                                        <span>{isBooking ? 'Processing Payment...' : 'Proceed to Checkout & Pay'}</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </section>
        </>
    );
};

export default Flights;
