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
import { FaTruck, FaMapMarkerAlt, FaPaperPlane, FaHistory, FaSearch, FaCopy, FaCheck, FaInfoCircle, FaBicycle, FaCar, FaBox } from 'react-icons/fa';

const DeliveryService = () => {
    const router = useRouter();
    const { initializeBillPayment } = useAppContext();

    const [activeTab, setActiveTab] = useState<'book' | 'history' | 'track'>('book');
    const [userEmail, setUserEmail] = useState('');
    const [userPhone, setUserPhone] = useState('');

    const [formData, setFormData] = useState({
        senderName: '',
        senderPhone: '',
        senderAddress: '',
        recipientName: '',
        recipientPhone: '',
        recipientAddress: '',
        packageType: 'Parcel',
        weight: '1',
        deliveryMode: 'BIKE' as 'BIKE' | 'CAR' | 'VAN',
    });

    const [isCalculating, setIsCalculating] = useState(false);
    const [priceDetails, setPriceDetails] = useState<{ distance: number; amount: number } | null>(null);

    const [isBooking, setIsBooking] = useState(false);
    const [myDeliveries, setMyDeliveries] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Tracking States
    const [trackingCode, setTrackingCode] = useState('');
    const [trackedResult, setTrackedResult] = useState<any | null>(null);
    const [isTracking, setIsTracking] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        const getInfo = async () => {
            const userInfo = await readSessionPayload();
            setUserEmail(userInfo?.email as string || '');
            setUserPhone(userInfo?.phone as string || '');
            setFormData(prev => ({
                ...prev,
                senderName: `${userInfo?.firstName || ''} ${userInfo?.lastName || ''}`.trim(),
                senderPhone: userInfo?.phone || ''
            }));
        };
        getInfo();
    }, []);

    // Price calculation trigger when address, weight or vehicle mode changes
    useEffect(() => {
        const fetchPriceEstimate = async () => {
            if (!formData.senderAddress || !formData.recipientAddress) {
                setPriceDetails(null);
                return;
            }
            setIsCalculating(true);
            try {
                const res = await UsePostApi('api/delivery/calculate-price', {
                    senderAddress: formData.senderAddress,
                    recipientAddress: formData.recipientAddress,
                    weight: Number(formData.weight) || 1,
                    deliveryMode: formData.deliveryMode
                });

                if (res.success && res.data) {
                    setPriceDetails(res.data);
                }
            } catch (err) {
                console.error("Error calculating estimate", err);
            } finally {
                setIsCalculating(false);
            }
        };

        const delayDebounce = setTimeout(() => {
            fetchPriceEstimate();
        }, 600);

        return () => clearTimeout(delayDebounce);
    }, [formData.senderAddress, formData.recipientAddress, formData.weight, formData.deliveryMode]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleVehicleSelect = (mode: 'BIKE' | 'CAR' | 'VAN') => {
        setFormData(prev => ({ ...prev, deliveryMode: mode }));
    };

    const fetchHistory = async () => {
        try {
            setLoadingHistory(true);
            const res = await UseGetApi('api/delivery/my-history');
            if (res.success && Array.isArray(res.data)) {
                setMyDeliveries(res.data);
            }
        } catch (error) {
            console.error("Error fetching delivery history", error);
        } finally {
            setLoadingHistory(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'history') {
            fetchHistory();
        }
    }, [activeTab]);

    const handleCopy = (text: string, id: string) => {
        if (!navigator.clipboard) return;
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(id);
            toast.success("Tracking number copied!");
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    const handleTrackSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!trackingCode) {
            toast.error("Please enter a tracking number");
            return;
        }

        setIsTracking(true);
        setTrackedResult(null);
        try {
            const res = await UseGetApi(`api/delivery/track/${trackingCode.trim().toUpperCase()}`);
            if (res.success && res.data) {
                setTrackedResult(res.data);
                toast.success("Package located!");
            } else {
                toast.error(res.message || "Failed to locate package");
            }
        } catch (error: any) {
            toast.error("Tracking lookup error. Package not found.");
        } finally {
            setIsTracking(false);
        }
    };

    const handleBookAndPay = async (e: FormEvent) => {
        e.preventDefault();
        
        if (
            !formData.senderName ||
            !formData.senderPhone ||
            !formData.senderAddress ||
            !formData.recipientName ||
            !formData.recipientPhone ||
            !formData.recipientAddress ||
            !priceDetails
        ) {
            toast.error("Please fill in sender, recipient details and wait for calculation.");
            return;
        }

        setIsBooking(true);
        try {
            const paymentRef = "DLV-" + Date.now() + "-" + Math.floor(Math.random() * 1e6);

            // 1. Create pending delivery on backend
            const bookRes = await UsePostApi('api/delivery/book', {
                senderName: formData.senderName,
                senderPhone: formData.senderPhone,
                senderAddress: formData.senderAddress,
                recipientName: formData.recipientName,
                recipientPhone: formData.recipientPhone,
                recipientAddress: formData.recipientAddress,
                packageType: formData.packageType,
                weight: Number(formData.weight),
                deliveryMode: formData.deliveryMode,
                paymentReference: paymentRef
            });

            if (!bookRes.success || !bookRes.data) {
                toast.error(bookRes.message || "Failed to initialize delivery booking");
                setIsBooking(false);
                return;
            }

            // 2. Trigger Paystack payment flow
            const payload = {
                email: userEmail,
                totalPrice: priceDetails.amount,
                dataName: `Package Delivery (to ${formData.recipientName})`,
                service_id: bookRes.data._id, // map delivery Mongo ID
                variation_code: formData.deliveryMode,
                credit_phone: formData.recipientPhone,
                request_type: "delivery"
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
            toast.error("Error booking delivery");
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

                <div className="flex flex-col gap-6 p-3 max-w-xl mx-auto">
                    {/* Header */}
                    <div className="text-center mt-4">
                        <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600 text-xl">
                            <FaTruck />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mt-2">Logistics & Deliveries</h2>
                        <p className="text-xs text-gray-500 mt-1">Request instant package delivery or track current shipments</p>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm">
                        <button
                            onClick={() => { setActiveTab('book'); }}
                            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                activeTab === 'book' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <FaPaperPlane />
                            <span>Request Delivery</span>
                        </button>
                        <button
                            onClick={() => { setActiveTab('history'); }}
                            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                activeTab === 'history' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <FaHistory />
                            <span>My Shipments</span>
                        </button>
                        <button
                            onClick={() => { setActiveTab('track'); }}
                            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                activeTab === 'track' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <FaSearch />
                            <span>Track Package</span>
                        </button>
                    </div>

                    {/* BOOK DELIVERIES TAB */}
                    {activeTab === 'book' && (
                        <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6" onSubmit={handleBookAndPay}>
                            {/* Sender Info Card */}
                            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 bg-primary rounded-full"></span>
                                    <span>Pickup Details (Sender)</span>
                                </h3>

                                <div className="space-y-3">
                                    <Input
                                        type="text"
                                        name="senderName"
                                        placeholder="Sender's Name"
                                        label="Sender Name"
                                        value={formData.senderName}
                                        onChange={handleFormChange}
                                        required
                                    />
                                    <Input
                                        type="tel"
                                        name="senderPhone"
                                        placeholder="Sender's Phone Number"
                                        label="Sender Phone"
                                        value={formData.senderPhone}
                                        onChange={handleFormChange}
                                        required
                                    />
                                    <div className="w-full">
                                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wide ml-1 block mb-1">Pickup Address</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                                                <FaMapMarkerAlt />
                                            </span>
                                            <Input
                                                type="text"
                                                name="senderAddress"
                                                className="pl-11"
                                                placeholder="Enter full pickup location details"
                                                value={formData.senderAddress}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recipient Info Card */}
                            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
                                    <span>Delivery Details (Recipient)</span>
                                </h3>

                                <div className="space-y-3">
                                    <Input
                                        type="text"
                                        name="recipientName"
                                        placeholder="Recipient's Name"
                                        label="Recipient Name"
                                        value={formData.recipientName}
                                        onChange={handleFormChange}
                                        required
                                    />
                                    <Input
                                        type="tel"
                                        name="recipientPhone"
                                        placeholder="Recipient's Phone Number"
                                        label="Recipient Phone"
                                        value={formData.recipientPhone}
                                        onChange={handleFormChange}
                                        required
                                    />
                                    <div className="w-full">
                                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wide ml-1 block mb-1">Destination Address</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500">
                                                <FaMapMarkerAlt />
                                            </span>
                                            <Input
                                                type="text"
                                                name="recipientAddress"
                                                className="pl-11"
                                                placeholder="Enter destination delivery address"
                                                value={formData.recipientAddress}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Package Details */}
                            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b pb-2">Package specifications</h3>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-gray-600 uppercase">Package Type</label>
                                        <select
                                            name="packageType"
                                            value={formData.packageType}
                                            onChange={handleFormChange}
                                            className="bg-gray-50 text-sm h-[52px] w-full border border-gray-200 rounded-xl px-4 font-semibold text-gray-700 outline-none focus:bg-white focus:border-primary"
                                        >
                                            <option value="Document">Document / Paper</option>
                                            <option value="Parcel">Parcel / Box</option>
                                            <option value="Food">Food / Groceries</option>
                                            <option value="Fragile">Fragile items</option>
                                            <option value="Clothing">Clothing / Fashion</option>
                                            <option value="Electronics">Electronics</option>
                                            <option value="Other">Other goods</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-gray-600 uppercase">Approx Weight (KG)</label>
                                        <select
                                            name="weight"
                                            value={formData.weight}
                                            onChange={handleFormChange}
                                            className="bg-gray-50 text-sm h-[52px] w-full border border-gray-200 rounded-xl px-4 font-semibold text-gray-700 outline-none focus:bg-white focus:border-primary"
                                        >
                                            <option value="1">Under 1 kg</option>
                                            <option value="5">1 - 5 kg</option>
                                            <option value="10">5 - 10 kg</option>
                                            <option value="20">10 - 20 kg</option>
                                            <option value="50">Over 20 kg</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Vehicle Mode Selectors */}
                                <div className="space-y-2.5 pt-2">
                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wide ml-1 block">Vehicle Option</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div
                                            onClick={() => handleVehicleSelect('BIKE')}
                                            className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-1.5 text-center ${
                                                formData.deliveryMode === 'BIKE' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                                            }`}
                                        >
                                            <FaBicycle className="text-xl" />
                                            <div>
                                                <span className="block text-xs font-extrabold uppercase">Bike</span>
                                                <span className="text-[9px] font-semibold text-gray-400">Up to 5kg</span>
                                            </div>
                                        </div>

                                        <div
                                            onClick={() => handleVehicleSelect('CAR')}
                                            className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-1.5 text-center ${
                                                formData.deliveryMode === 'CAR' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                                            }`}
                                        >
                                            <FaCar className="text-xl" />
                                            <div>
                                                <span className="block text-xs font-extrabold uppercase">Car</span>
                                                <span className="text-[9px] font-semibold text-gray-400">Up to 30kg</span>
                                            </div>
                                        </div>

                                        <div
                                            onClick={() => handleVehicleSelect('VAN')}
                                            className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-1.5 text-center ${
                                                formData.deliveryMode === 'VAN' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                                            }`}
                                        >
                                            <FaTruck className="text-xl" />
                                            <div>
                                                <span className="block text-xs font-extrabold uppercase">Van / Truck</span>
                                                <span className="text-[9px] font-semibold text-gray-400">Over 30kg</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Estimate Summary Panel */}
                            {priceDetails && (
                                <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 flex justify-between items-center">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-rose-600 uppercase tracking-wide">
                                            <FaInfoCircle />
                                            <span>Est. Distance: {priceDetails.distance} KM</span>
                                        </div>
                                        <span className="block text-xs text-rose-950/80 font-bold">Standard Delivery Service ({formData.deliveryMode})</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-lg font-black text-rose-950">₦{Number(priceDetails.amount).toLocaleString()}</span>
                                    </div>
                                </motion.div>
                            )}

                            {isCalculating && (
                                <div className="text-center py-2 text-xs font-semibold text-gray-400 animate-pulse">
                                    Calculating delivery quote...
                                </div>
                            )}

                            <div className="pt-2">
                                <Btn
                                    type="submit"
                                    title={priceDetails ? `Pay & Book Delivery (₦${priceDetails.amount.toLocaleString()})` : "Book Delivery"}
                                    loading={isBooking}
                                    disabled={!priceDetails}
                                />
                            </div>
                        </motion.form>
                    )}

                    {/* VAULT/HISTORY TAB */}
                    {activeTab === 'history' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">My Dispatch History</h3>
                            
                            {loadingHistory ? (
                                <div className="text-center py-10 font-bold text-gray-400">Loading vault records...</div>
                            ) : myDeliveries.length === 0 ? (
                                <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-xs text-gray-400 font-bold">
                                    No delivery shipments registered yet.
                                </div>
                            ) : (
                                myDeliveries.map((delivery) => (
                                    <div key={delivery._id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-xs font-black text-gray-800 uppercase flex items-center gap-1.5">
                                                    <FaBox className="text-rose-500" />
                                                    <span>{delivery.packageType}</span>
                                                </h4>
                                                <p className="text-[9px] text-gray-400 font-semibold mt-0.5">{new Date(delivery.createdAt).toLocaleDateString()} • {delivery.estimatedDistance} km</p>
                                            </div>
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                                delivery.status === 'SUCCESS' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                                            }`}>
                                                {delivery.status}
                                            </span>
                                        </div>

                                        <div className="border-t border-dashed border-gray-100 pt-2 flex flex-col gap-1 text-[11px] text-gray-600">
                                            <div className="truncate"><span className="font-bold text-gray-400">From:</span> {delivery.senderAddress}</div>
                                            <div className="truncate"><span className="font-bold text-gray-400">To:</span> {delivery.recipientAddress} ({delivery.recipientName})</div>
                                            <div className="flex justify-between text-xs font-black text-gray-800 mt-1">
                                                <span>Total Price:</span>
                                                <span>₦{Number(delivery.amount).toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-xl p-2.5 flex justify-between items-center border border-gray-100">
                                            <div className="flex-1 min-w-0 pr-2">
                                                <span className="block text-[9px] uppercase font-bold text-gray-400">Tracking Code</span>
                                                <code className="text-xs font-black font-mono text-gray-800 break-all">{delivery.trackingNumber}</code>
                                            </div>
                                            <button
                                                onClick={() => handleCopy(delivery.trackingNumber, delivery._id)}
                                                className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm border border-gray-200 text-gray-500 active:scale-95 transition-transform"
                                            >
                                                {copiedId === delivery._id ? <FaCheck className="text-green-500" /> : <FaCopy />}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    )}

                    {/* TRACK PACKAGE TAB */}
                    {activeTab === 'track' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            <form className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4" onSubmit={handleTrackSubmit}>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wide ml-1">Enter Tracking Number</label>
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <Input
                                                type="text"
                                                name="trackingCode"
                                                placeholder="e.g. DLV-ABC12345"
                                                value={trackingCode}
                                                onChange={(e) => setTrackingCode(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isTracking || !trackingCode}
                                            className="h-[52px] bg-rose-100 px-4 rounded-xl text-rose-600 font-bold text-xs disabled:opacity-50 transition-colors hover:bg-rose-200 flex items-center gap-1.5"
                                        >
                                            {isTracking ? 'Searching...' : 'Locate'}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Track Result Card */}
                            {trackedResult && (
                                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                    <div className="flex justify-between items-start border-b pb-3">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase text-gray-400">Tracking Code</span>
                                            <h4 className="text-sm font-black text-gray-900 mt-0.5">{trackedResult.trackingNumber}</h4>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                            trackedResult.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {trackedResult.status === 'SUCCESS' ? 'Dispatched' : 'Payment Pending'}
                                        </span>
                                    </div>

                                    {/* Dispatch Progression Visual */}
                                    <div className="py-2">
                                        <div className="flex items-center justify-between relative px-2">
                                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 -z-10"></div>
                                            <div className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 -z-10" style={{ width: trackedResult.status === 'SUCCESS' ? '100%' : '20%' }}></div>
                                            
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">1</div>
                                                <span className="text-[8px] font-bold text-gray-500 uppercase">Booked</span>
                                            </div>

                                            <div className="flex flex-col items-center gap-1">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                                    trackedResult.status === 'SUCCESS' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                                                }`}>2</div>
                                                <span className="text-[8px] font-bold text-gray-500 uppercase">Paid</span>
                                            </div>

                                            <div className="flex flex-col items-center gap-1">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                                    trackedResult.status === 'SUCCESS' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                                                }`}>3</div>
                                                <span className="text-[8px] font-bold text-gray-500 uppercase">On Route</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2.5 pt-2 border-t text-xs text-gray-700">
                                        <div><span className="font-bold text-gray-400">Package Content:</span> {trackedResult.packageType} ({trackedResult.weight} kg)</div>
                                        <div><span className="font-bold text-gray-400">Vehicle Assigned:</span> {trackedResult.deliveryMode}</div>
                                        <div><span className="font-bold text-gray-400">Pickup Location:</span> {trackedResult.senderAddress}</div>
                                        <div><span className="font-bold text-gray-400">Destination Address:</span> {trackedResult.recipientAddress}</div>
                                        <div><span className="font-bold text-gray-400">Recipient Contact:</span> {trackedResult.recipientName} ({trackedResult.recipientPhone})</div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </section>
        </>
    );
};

export default DeliveryService;
