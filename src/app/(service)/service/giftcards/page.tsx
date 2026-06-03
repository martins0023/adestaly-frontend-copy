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
import { FaGift, FaShoppingCart, FaHistory, FaCopy, FaCheck } from 'react-icons/fa';

const GiftCards = () => {
    const router = useRouter();
    const { initializeBillPayment } = useAppContext();

    const [activeTab, setActiveTab] = useState<'buy' | 'history'>('buy');
    const [brands, setBrands] = useState<any[]>([]);
    const [myCards, setMyCards] = useState<any[]>([]);
    const [loadingBrands, setLoadingBrands] = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const [selectedBrand, setSelectedBrand] = useState<any | null>(null);
    const [formData, setFormData] = useState({
        amount: '', // in USD usually, converted to NGN on checkout
        recipientEmail: '',
        email: ''
    });

    const [isOrdering, setIsOrdering] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Dynamic conversion rate (e.g. 1 USD = 1500 NGN)
    const FX_RATE = 1500;

    useEffect(() => {
        const getInfo = async () => {
            const userInfo = await readSessionPayload();
            setFormData(prev => ({
                ...prev,
                email: userInfo?.email as string || '',
                recipientEmail: userInfo?.email as string || ''
            }));
        };
        getInfo();
    }, []);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                setLoadingBrands(true);
                const res = await UseGetApi('api/giftcard/brands');
                if (res.success && Array.isArray(res.data)) {
                    setBrands(res.data);
                } else {
                    toast.error("Failed to load gift card catalog");
                }
            } catch (error) {
                console.error("Error loading brands", error);
            } finally {
                setLoadingBrands(false);
            }
        };
        fetchBrands();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoadingHistory(true);
            const res = await UseGetApi('api/giftcard/my-cards');
            if (res.success && Array.isArray(res.data)) {
                setMyCards(res.data);
            }
        } catch (error) {
            console.error("Error fetching gift card history", error);
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
            toast.success("Code copied!");
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    const handleCheckout = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedBrand || !formData.amount || !formData.recipientEmail) {
            toast.error("Please fill in card value and recipient email");
            return;
        }

        const usdAmount = Number(formData.amount);
        if (isNaN(usdAmount) || usdAmount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        // Validate denomination constraints
        if (selectedBrand.denominationType === 'FIXED') {
            const allowed = selectedBrand.fixedPrices.map(Number);
            if (!allowed.includes(usdAmount)) {
                toast.error(`Invalid value. Allowed amounts are: $${allowed.join(', $')}`);
                return;
            }
        } else {
            if (usdAmount < Number(selectedBrand.minPrice) || usdAmount > Number(selectedBrand.maxPrice)) {
                toast.error(`Amount must be between $${selectedBrand.minPrice} and $${selectedBrand.maxPrice}`);
                return;
            }
        }

        setIsOrdering(true);
        try {
            // Price conversion to local checkout currency NGN
            const ngnPrice = usdAmount * FX_RATE;
            const paymentRef = "GFT-" + Date.now() + "-" + Math.floor(Math.random() * 1e6);

            // 1. Log pending giftcard order on backend
            const orderRes = await UsePostApi('api/giftcard/order', {
                brandName: selectedBrand.brandName,
                productId: selectedBrand.productId,
                amount: ngnPrice,
                recipientEmail: formData.recipientEmail,
                paymentReference: paymentRef
            });

            if (!orderRes.success || !orderRes.data) {
                toast.error(orderRes.message || "Failed to initialize order");
                setIsOrdering(false);
                return;
            }

            // 2. Initialize checkout using Paystack
            const payload = {
                email: formData.email,
                totalPrice: ngnPrice,
                dataName: `${selectedBrand.name} ($${usdAmount})`,
                service_id: orderRes.data._id, // map pending model ID
                variation_code: String(selectedBrand.productId),
                credit_phone: formData.recipientEmail,
                request_type: "giftcard"
            };

            const response = await initializeBillPayment(payload);

            if (response?.success) {
                const paymentUrl = (response?.data as any)?.payment_url;
                if (paymentUrl) {
                    router.push(paymentUrl);
                } else {
                    toast.error("Payment URL not returned");
                }
            } else {
                toast.error(response?.message || "An error occurred");
            }
        } catch (err) {
            toast.error("Error creating gift card purchase");
        } finally {
            setIsOrdering(false);
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
                        <h2 className="text-xl font-bold text-gray-800">Gift Card Store</h2>
                        <p className="text-xs text-gray-500 mt-1">Buy digital gift cards instantly for global stores and services</p>
                    </div>

                    {/* Tabs navigation */}
                    <div className="flex bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm">
                        <button
                            onClick={() => { setActiveTab('buy'); setSelectedBrand(null); }}
                            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                activeTab === 'buy' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <FaShoppingCart />
                            <span>Buy Gift Card</span>
                        </button>
                        <button
                            onClick={() => { setActiveTab('history'); setSelectedBrand(null); }}
                            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                activeTab === 'history' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <FaHistory />
                            <span>My Cards Vault</span>
                        </button>
                    </div>

                    {/* BUY TABS */}
                    {activeTab === 'buy' && !selectedBrand && (
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Select Card Brand</h3>
                            {loadingBrands ? (
                                <div className="text-center py-10 font-bold text-gray-400">Loading Brands...</div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    {brands.map((brand) => (
                                        <motion.div
                                            whileTap={{ scale: 0.97 }}
                                            key={brand.productId}
                                            onClick={() => {
                                                setSelectedBrand(brand);
                                                setFormData(prev => ({ ...prev, amount: brand.fixedPrices[0] || brand.minPrice || '' }));
                                            }}
                                            className="bg-white p-4 rounded-2xl border-2 border-transparent hover:border-orange-500 cursor-pointer transition-all shadow-sm flex flex-col items-center gap-3 text-center"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center p-2 border overflow-hidden">
                                                {brand.logoUrls?.[0] ? (
                                                    <img src={brand.logoUrls[0]} alt={brand.brandName} className="object-contain w-full h-full" />
                                                ) : (
                                                    <FaGift className="text-primary text-xl" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-black text-gray-800">{brand.name}</h4>
                                                <p className="text-[10px] text-gray-400 mt-0.5">{brand.brandName}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* CONFIGURE ORDER */}
                    {activeTab === 'buy' && selectedBrand && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <form className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4" onSubmit={handleCheckout}>
                                <div className="flex items-center gap-3 border-b pb-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center p-1.5 border overflow-hidden">
                                        {selectedBrand.logoUrls?.[0] ? (
                                            <img src={selectedBrand.logoUrls[0]} alt={selectedBrand.brandName} className="object-contain w-full h-full" />
                                        ) : (
                                            <FaGift className="text-primary" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800">{selectedBrand.name}</h4>
                                        <p className="text-[10px] text-gray-400 font-semibold">{selectedBrand.brandName}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedBrand(null)}
                                        className="ml-auto text-[10px] font-bold text-gray-400 hover:text-gray-600 underline"
                                    >
                                        Change
                                    </button>
                                </div>

                                {/* CARD VALUE */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] uppercase font-bold text-gray-400">Card Value (USD)</label>
                                    {selectedBrand.denominationType === 'FIXED' ? (
                                        <div className="grid grid-cols-4 gap-2">
                                            {selectedBrand.fixedPrices.map((val: number) => (
                                                <button
                                                    type="button"
                                                    key={val}
                                                    onClick={() => setFormData(prev => ({ ...prev, amount: String(val) }))}
                                                    className={`py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                                                        Number(formData.amount) === val
                                                            ? 'border-orange-500 bg-orange-50 text-orange-600'
                                                            : 'border-gray-100 bg-gray-50 text-gray-600'
                                                    }`}
                                                >
                                                    ${val}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                            <Input
                                                type="number"
                                                name="amount"
                                                className="pl-8"
                                                placeholder={`Enter custom value (${selectedBrand.minPrice}-${selectedBrand.maxPrice})`}
                                                value={formData.amount}
                                                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                                                min={selectedBrand.minPrice}
                                                max={selectedBrand.maxPrice}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* RECIPIENT EMAIL */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] uppercase font-bold text-gray-400">Recipient Email (Delivery)</label>
                                    <Input
                                        type="email"
                                        name="recipientEmail"
                                        placeholder="friend@email.com"
                                        value={formData.recipientEmail}
                                        onChange={(e) => setFormData(prev => ({ ...prev, recipientEmail: e.target.value }))}
                                    />
                                </div>

                                {/* PRICE DISPLAY SUMMARY */}
                                {formData.amount && (
                                    <div className="bg-orange-50/50 rounded-xl p-3 border border-orange-100 flex justify-between items-center text-xs font-semibold">
                                        <span className="text-orange-800">Total Due (Converted):</span>
                                        <span className="text-base font-black text-orange-950">₦{(Number(formData.amount) * FX_RATE).toLocaleString()}</span>
                                    </div>
                                )}

                                <div className="pt-2">
                                    <Btn type="submit" title={`Buy Gift Card ($${formData.amount || 0})`} loading={isOrdering} />
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {/* VAULT HISTORY TAB */}
                    {activeTab === 'history' && (
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Delivered Cards</h3>
                            {loadingHistory ? (
                                <div className="text-center py-10 font-bold text-gray-400">Loading Vault...</div>
                            ) : myCards.length === 0 ? (
                                <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-xs text-gray-400 font-bold">
                                    No gift cards in your vault yet.
                                </div>
                            ) : (
                                myCards.map((card) => (
                                    <div key={card._id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="text-xs font-black text-gray-800 uppercase">{card.brand}</h4>
                                                <p className="text-[9px] text-gray-400 font-semibold">{new Date(card.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-green-50 text-green-600 uppercase tracking-wider">
                                                {card.status}
                                            </span>
                                        </div>

                                        {card.cardCode && (
                                            <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center border border-gray-100">
                                                <div className="flex-1 min-w-0 pr-2">
                                                    <span className="block text-[9px] uppercase font-bold text-gray-400">Claim Code</span>
                                                    <code className="text-xs font-black font-mono text-gray-800 break-all">{card.cardCode}</code>
                                                    {card.cardPin && (
                                                        <span className="block text-[9px] text-gray-500 font-medium mt-0.5">PIN: {card.cardPin}</span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleCopy(card.cardCode, card._id)}
                                                    className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm border border-gray-200 text-gray-500 active:scale-95 transition-transform"
                                                >
                                                    {copiedId === card._id ? <FaCheck className="text-green-500" /> : <FaCopy />}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </section>
        </>
    );
};

export default GiftCards;
