import React, { useState } from 'react';
import Modal from "react-modal";
import { FaShieldAlt, FaTimes, FaLock, FaSpinner } from 'react-icons/fa';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { UsePatchApi } from '@/src/config/Action';

// 1. Define the Schema
const pinSchema = z.object({
  pin: z.string().length(4, "PIN must be 4 digits").regex(/^\d+$/, "Numbers only"),
  confirmPin: z.string().length(4, "Please confirm your PIN"),
}).refine((data) => data.pin === data.confirmPin, {
  message: "PINs do not match",
  path: ["confirmPin"], 
});

type PinFormData = z.infer<typeof pinSchema>;

export const PinModal = ({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) => {
  const [form, setform] = useState<PinFormData>({ pin: "", confirmPin: "" });
  const [loading, setLoading] = useState(false);
  
  // 2. Define error state as an object mapping field names to strings
  const [errors, setErrors] = useState<Partial<Record<keyof PinFormData, string>>>({});

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const cleanValue = value.replace(/\D/g, "");
    setform(prev => ({ ...prev, [name]: cleanValue }));
    
    // Clear specific field error when user types
    if (errors[name as keyof PinFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = pinSchema.safeParse(form);

    if (!result.success) {
      // 3. Map Zod errors to our state object
      const fieldErrors: Partial<Record<keyof PinFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof PinFormData;
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await UsePatchApi(`api/user/create-pin`, { pin: form.pin });
      console.log(response)
      if (response.success) {
        onClose();
        onSuccess(); // Triggers the Success Modal in the parent
      } else {
        console.log("Failed to set up pin")
        toast.error(response.message || "Failed to set PIN");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="outline-none"
      overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4  transition-opacity duration-300"
    >
      <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300">
        <div className="px-6 pt-6 pb-2 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <FaShieldAlt />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Set PIN</h2>
               <p className="text-xs text-gray-500 font-medium">Secure your transactions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full"><FaTimes /></button>
        </div>

<div className="p-6 pt-4">
   <p className="text-sm text-gray-600 mb-6 leading-relaxed bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
            Please create a unique <strong>4-digit PIN</strong>. You will need this to authorize all
            transfers and bill payments.
          </p>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {/* New PIN Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">New PIN</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><FaLock /></div>
              <input
                type="password"
                name="pin"
                value={form.pin}
                onChange={onChange}
                maxLength={4}
                className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border rounded-xl text-center focus:ring-4 outline-none transition-all ${
                  errors.pin ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-primary focus:ring-primary/10'
                }`}
              />
            </div>
            {errors.pin && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.pin}</p>}
          </div>

          {/* Confirm PIN Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Confirm PIN</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><FaLock /></div>
              <input
                type="password"
                name="confirmPin"
                value={form.confirmPin}
                onChange={onChange}
                maxLength={4}
                className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border rounded-xl text-center focus:ring-4 outline-none transition-all ${
                  errors.confirmPin ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-primary focus:ring-primary/10'
                }`}
              />
            </div>
            {errors.confirmPin && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.confirmPin}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-4 rounded-xl font-bold bg-primary text-white disabled:bg-gray-200 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? <FaSpinner className="animate-spin" /> : 'Set Transaction PIN'}
          </button>
        </form>
</div>
      </div>
    </Modal>
  );
};