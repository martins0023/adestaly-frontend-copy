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

const Cable = () => {
    const router = useRouter()
    const { getBillServices, getDataPlans, loading, initializeBillPayment, verifyBillerCode } = useAppContext();

    const [formData, setFormData] = useState({
        serviceId: '',
        variation_code: '',
        smartcardNumber: '',
        amount: '',
        email: ''
    });

    const [services, setServices] = useState<any[]>([]);
    const [plans, setPlans] = useState<any[]>([]);
    const [billerName, setBillerName] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [showAllPlans, setShowAllPlans] = useState(false);

    const visiblePlans = showAllPlans ? plans : plans.slice(0, 6);

    useEffect(() => {
        const getInfo = async () => {
            const userInfo = await readSessionPayload();
            setFormData(prev => ({ ...prev, email: userInfo?.email as string }));
        };
        getInfo();
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            const serviceRes = await getBillServices("tv-subscription"); 
            // Also try "tv" or "cable" if backend uses a different identifier
            const dataArr = serviceRes?.data as any[];
            setServices(dataArr || []);
        };
        fetchServices();
    }, [getBillServices]);

    const handleServiceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const serviceId = e.target.value;
        setFormData(prev => ({ ...prev, serviceId, variation_code: '', amount: '' }));
        if(!serviceId) {
            setPlans([]);
            return;
        }

        const planRes = await getDataPlans(serviceId);
        const planData = planRes?.data as any;
        setPlans(planData?.content?.variations || []);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === "smartcardNumber" || name === "serviceId") {
            setBillerName('');
        }
    };

    const handleVerify = async () => {
        if (!formData.smartcardNumber || !formData.serviceId) {
            toast.error('Please select provider and enter smartcard number');
            return;
        }

        setIsVerifying(true);
        const res = await verifyBillerCode(formData.smartcardNumber, formData.serviceId);
        setIsVerifying(false);

        if (res?.success) {
            const name = (res.data as any)?.Customer_Name || (res.data as any)?.name || 'Verified Customer';
            setBillerName(name);
            toast.success('Smartcard verified successfully');
        } else {
            setBillerName('');
            toast.error(res?.message || 'Verification failed');
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!formData.smartcardNumber || !formData.variation_code || !formData.serviceId || !billerName) {
            toast.error('Please verify smartcard and select a plan.');
            return;
        }

        const payload = {
            email: formData.email,
            totalPrice: formData.amount,
            dataName: `Cable TV Subscription`,
            service_id: formData.serviceId,
            variation_code: formData.variation_code,
            credit_phone: formData.smartcardNumber, // Field expected by generic backend for ID
            request_type: "tv-subscription"
        };

        const response = await initializeBillPayment(payload);

        if (response?.success) {
            const paymentUrl = (response?.data as any)?.payment_url;
            if (paymentUrl) {
                router.push(paymentUrl);
            } else {
                toast.error("Payment URL not provided");
            }
        } else {
            toast.error(response?.message || "An error occurred");
        }
    }

    return (
        <section className="sm:px-10 px-1">
            <motion.div initial="hidden" animate="visible" className="dashboard-container">
                <div className="w-full max-w-7xl mx-auto pt-4">
                    <BalanceDashboard />
                </div>

                <div className="flex flex-col gap-8 p-3 max-w-xl mx-auto">
                    <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit}>

                        {/* SERVICE TYPE */}
                        <div className="flex flex-col gap-2">
                            <select
                                name="serviceId"
                                value={formData.serviceId}
                                onChange={handleServiceChange}
                                className="bg-white py-4 px-6 text-black rounded-xl outline-none border-none text-[12px] w-full h-[52px] font-medium appearance-none"
                            >
                                <option value="">{loading.service ? 'Loading Providers...' : 'Select TV Provider'}</option>
                                {services.map((service: any) => (
                                    <option key={service.serviceID || service.id} value={service.serviceID || service.id}>{service.name}</option>
                                ))}
                            </select>
                        </div>

                         {/* PLAN CARDS GRID */}
                         {plans.length > 0 && (
                            <div className="flex flex-col gap-3 mt-2">
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                  {visiblePlans.map((plan: any) => (
                                      <motion.div
                                          whileTap={{ scale: 0.95 }}
                                          key={plan.variation_code}
                                          onClick={() => setFormData(prev => ({
                                              ...prev,
                                              variation_code: plan.variation_code,
                                              amount: plan.variation_amount
                                          }))}
                                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-1 relative overflow-hidden ${formData.variation_code === plan.variation_code
                                                  ? 'border-orange-500 bg-orange-50'
                                                  : 'border-white bg-white'
                                              }`}
                                      >
                                          <p className="text-[14px] font-bold text-gray-800">
                                              {plan.name}
                                          </p>
                                          <p className="text-[12px] text-gray-500 font-medium">
                                              ₦{Number(plan.variation_amount || plan.amount).toLocaleString()}
                                          </p>

                                          {formData.variation_code === plan.variation_code && (
                                              <div className="absolute top-2 right-2 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                                                  <div className="w-2 h-2 bg-white rounded-full" />
                                              </div>
                                          )}
                                      </motion.div>
                                  ))}
                              </div>
                              {plans.length > 6 && (
                                  <button
                                      type="button"
                                      onClick={() => setShowAllPlans(!showAllPlans)}
                                      className="text-orange-500 font-bold text-sm mx-auto hover:bg-orange-50 px-4 py-2 rounded-lg transition-all"
                                  >
                                      {showAllPlans ? 'Show Less' : 'Show More Plans'}
                                  </button>
                              )}
                            </div>
                         )}

                        {/* SMARTCARD NUMBER INPUT */}
                        <div className="flex flex-col gap-2">
                            <Input
                                type="text"
                                name="smartcardNumber"
                                placeholder="Smartcard / IUC Number"
                                value={formData.smartcardNumber}
                                onChange={handleChange}
                            />
                            {!billerName && (
                               <button 
                                  type="button" 
                                  onClick={handleVerify}
                                  disabled={isVerifying || !formData.smartcardNumber || !formData.serviceId}
                                  className="self-end bg-orange-100 px-4 py-2 rounded-lg text-orange-600 font-bold text-sm disabled:opacity-50 transition-colors hover:bg-orange-200"
                               >
                                  {isVerifying ? 'Verifying...' : 'Verify Smartcard'}
                               </button>
                            )}
                            {billerName && (
                                <AnimatePresence>
                                    <motion.div 
                                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                                        className="bg-green-50 text-green-700 p-3 rounded-lg text-sm font-semibold border border-green-200"
                                    >
                                        Verified Name: {billerName}
                                    </motion.div>
                                </AnimatePresence>
                            )}
                        </div>

                        {/* AMOUNT INPUT (Readonly) */}
                        <div className="flex flex-col gap-2">
                            <div className="flex-1 relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₦</span>
                                <Input
                                    type="text"
                                    name="amount"
                                    placeholder="Amount to Pay"
                                    className="pl-8 bg-gray-200 text-gray-500 font-bold"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    readOnly
                                    disabled
                                />
                            </div>
                        </div>

                        {billerName && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-auto items-center justify-center mt-10 mb-5">
                                <Btn type='submit' title='Pay Subscription' loading={loading.payment} />
                            </motion.div>
                        )}
                    </form>
                </div>
            </motion.div>
        </section>
    );
};

export default Cable;
