import React, { useState, useEffect } from "react";
import { Lock, Clock } from "lucide-react";

const CountdownModal = () => {
  const [targetTime] = useState(() => {
    const savedTime = localStorage.getItem("launchTargetTime");
    if (savedTime) {
      return parseInt(savedTime, 10);
    }
    const newTime = new Date().getTime() + 15 * 60 * 60 * 1000; // 15 Hours
    localStorage.setItem("launchTargetTime", newTime.toString());
    return newTime;
  });

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetTime));

  function calculateTimeLeft(target: number) {
    const difference = target - new Date().getTime();

    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      hours: Math.floor(difference / (1000 * 60 * 60)),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetTime));
    }, 1000);

    document.body.style.overflow = "hidden";

    return () => {
      clearInterval(timer);
      document.body.style.overflow = "unset";
    };
  }, [targetTime]);

  // Reduced size for TimeBox
  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-black text-white w-16 h-20 md:w-20 md:h-24 rounded-lg border-2 border-slate-900 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]">
        <span className="font-black text-2xl md:text-4xl font-mono">
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="mt-2 font-bold text-xs uppercase tracking-widest text-slate-900 bg-white px-2 py-0.5 border-2 border-black rounded shadow-[1px_1px_0px_0px_#000]">
        {label}
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      {/* Backdrop with Blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-not-allowed" />

      {/* Main Modal Card - Reduced padding and width */}
      <div className="relative bg-white border-4 border-black rounded-[2rem] p-6 md:p-8 w-full max-w-lg text-center shadow-[8px_8px_0px_0px_#000] animate-in zoom-in-95 duration-300">
        {/* Decorator: Locked Icon - Slightly smaller */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-primary border-4 border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_#000] z-20">
          <Lock className="w-8 h-8 text-white" />
        </div>

        {/* Content - Tightened spacing */}
        <div className="mt-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-100 border-2 border-black rounded-lg font-bold text-xs uppercase tracking-wider mb-1">
            <Clock className="w-3 h-3" />
            <span>Launch Sequence Initiated</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight uppercase tracking-tighter">
            We are <br />
            <span className="text-primary underline decoration-wavy decoration-4 underline-offset-4">
              Almost There.
            </span>
          </h2>

          <p className="text-base md:text-lg font-bold text-slate-500 max-w-sm mx-auto leading-snug">
            We are running final checks. Platform live in:
          </p>

          {/* Countdown Grid - Reduced gaps */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-6 pt-4 pb-4">
            <TimeBox value={timeLeft.hours} label="Hrs" />
            <span className="text-2xl font-black self-center pb-6 hidden md:block">
              :
            </span>
            <TimeBox value={timeLeft.minutes} label="Min" />
            <span className="text-2xl font-black self-center pb-6 hidden md:block">
              :
            </span>
            <TimeBox value={timeLeft.seconds} label="Sec" />
          </div>

          {/* Notification Form - Compacted */}
          <div className="max-w-xs mx-auto pt-4 border-t-2 border-dashed border-gray-300">
            <p className="text-xs font-bold text-slate-400 mb-2">
              Don't miss the drop
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                disabled
                className="w-full bg-slate-100 border-2 border-black rounded-lg px-3 py-2 text-sm font-bold opacity-60 cursor-not-allowed"
              />
              <button
                disabled
                className="bg-black text-white px-4 py-2 rounded-lg border-2 border-black text-sm font-bold opacity-60 cursor-not-allowed"
              >
                NOTIFY
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownModal;
