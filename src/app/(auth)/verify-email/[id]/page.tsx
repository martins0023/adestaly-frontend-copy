"use client"

import { useEffect, useRef, useState, useCallback, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';
import { useParams, useRouter } from 'next/navigation';
import { useAppContext } from '@/src/context/AppContextProvider';
import toast from 'react-hot-toast';
import { UseGetApi } from '@/src/config/Action';
import Image from 'next/image';

// Moved styles up to avoid hoisting issues
export const styles = {
  sectionSubText: 'sm:text-[24px] text-[#141416] tracking-wider font-medium',
  sectionSubText2: 'sm:text-[14px] text-[12px] tracking-wider text-[#777E90] font-400',
};

const VerificationPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { verifyEmail, resendVerificationCode, loading } = useAppContext();

  const [email, setEmail] = useState('');
  const [digits, setDigits] = useState(['', '', '', '']);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // --- 1. Fetch User's Email ---
  useEffect(() => {
    if (!id) return;

    const fetchUserEmail = async () => {
      try {
        const response = await UseGetApi(`api/auth/get-email/${id}`);
        if (response.success) {
          setEmail(response.data.email);
        } else {
          toast.error(response.message);
        }
      } catch (err) {
        toast.error('Could not find user.');
        console.error(err);
      }
    };
    fetchUserEmail();
  }, [id]);

  // --- 2. Fixed Cooldown Timer ---
  useEffect(() => {
    if (canResend) return; // Don't start timer if already available

    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [canResend]); // Only restart when canResend is toggled back to false

  // --- 3. Auto-Focus ---
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // --- 4. Submit Handler ---
  const handleSubmit = useCallback(
    async (code: string) => {
      if (loading.login) return;

      const response = await verifyEmail(id, code);
      if (response?.success) {
        toast.success("Verified successfully! Redirecting...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error(response?.message || "Invalid code.");
        setDigits(['', '', '', '']);
        inputsRef.current[0]?.focus();
      }
    },
    [id, verifyEmail, loading.login, router] // Added missing dependencies
  );

  const setDigit = (index: number, value: string) => {
    // Only allow 1 digit
    const char = value.slice(-1);
    if (!/^[0-9]?$/.test(char)) return;

    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    if (char && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }

    const finalCode = newDigits.join('');
    if (finalCode.length === 4) {
      handleSubmit(finalCode);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace') {
      if (!digits[idx] && idx > 0) {
        inputsRef.current[idx - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && idx < 3) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (paste.length === 4) {
      const newDigits = paste.split('');
      setDigits(newDigits);
      handleSubmit(paste);
    }
  };

  const handleResend = async () => {
    if (!canResend || loading.resendVerification) return;
    try {
      const response = await resendVerificationCode(id);
      if (response?.success) {
        toast.success("New code sent!");
        setResendCooldown(60);
        setCanResend(false); // Restart the timer
      } else {
        toast.error(response?.message || "Failed to resend.");
      }
    } catch (err) {
      toast.error('Error resending code.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center px-4 py-12">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md w-full">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
        </div>

        <h1 className={`${styles.sectionSubText} text-center text-[22px] font-semibold mb-2`}>
          Verify your email
        </h1>
        <p className={`${styles.sectionSubText2} text-center text-[14px] mb-6`}>
          We sent a 4-digit verification code to
          <span className="font-medium text-original block"> {email}</span>
          Enter it below to verify your account.
        </p>

        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">
          <div className="flex justify-center gap-3 relative">
            {(loading.login || loading.resendVerification) && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                <FaSpinner className="animate-spin text-primary text-2xl" />
              </div>
            )}

            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputsRef.current[idx] = el; }}
                value={digit}
                onChange={(e) => setDigit(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onPaste={handlePaste}
                inputMode="numeric"
                className="w-14 h-14 text-center text-lg rounded-xl border-2 border-gray-200 focus:border-primary outline-none"
                disabled={loading.login || loading.resendVerification}
              />
            ))}
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend}
              className={`text-sm underline ${!canResend ? 'text-gray-400' : 'text-primary'}`}
            >
              Resend code
            </button>
            <span className="text-sm text-gray-500">
              {canResend ? "Available now" : `Resend in ${resendCooldown}s`}
            </span>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          Didn’t receive the email? Check your spam folder or try again.
        </div>
      </motion.div>
    </div>
  );
};

export default VerificationPage;