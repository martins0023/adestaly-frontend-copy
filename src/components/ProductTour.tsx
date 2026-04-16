import { useState, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaArrowRight, FaCheck } from 'react-icons/fa';

type RectInfo = {
  top: number;
  left: number;
  width: number;
  height: number;
  rawTop: number;
  rawBottom: number;
  rawLeft: number;
};

const ProductTour = ({ steps, onComplete, onSkip }: { steps: { target: string, title: string, content: string }[], onComplete: () => void, onSkip: () => void }) => {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<RectInfo | null>(null);
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);

  const step = steps[index];
  const isLastStep = index === steps.length - 1;

  // --- 1. Calculate Position of Target with Retry Logic ---
  useLayoutEffect(() => {
    const updatePosition = () => {
      const element = document.querySelector(step.target);
      
      if (element) {
        // Element found!
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const r = element.getBoundingClientRect();
        
        setRect({
          top: r.top - 10,
          left: r.left - 10,
          width: r.width + 20,
          height: r.height + 20,
          rawTop: r.top,
          rawBottom: r.bottom,
          rawLeft: r.left,
        });

        // Clear any pending retries since we found it
        if (retryTimerRef.current) {
          clearTimeout(retryTimerRef.current);
          retryTimerRef.current = null;
        }
      } else {
        // Element not found (Dashboard might still be loading)
        // Try again in 500ms
        retryTimerRef.current = setTimeout(updatePosition, 500);
      }
    };

    // Initial trigger
    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [index, step.target]);

  // --- 2. Navigation Handlers ---
  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setRect(null); // Reset rect so the next step triggers a fresh calculation
      setIndex((prev) => prev + 1);
    }
  };

  // --- 3. Dynamic Styles (Safe checks) ---
  const tooltipHeight = 200;
  const spaceBelow = rect ? window.innerHeight - rect.rawBottom : 0;
  const showAbove = spaceBelow < tooltipHeight + 20;

  const tooltipStyle = rect ? {
    top: showAbove ? 'auto' : rect.height + 20,
    bottom: showAbove ? rect.height + 20 : 'auto',
    left: 0,
  } : {};

  const isFarRight = rect ? rect.rawLeft > window.innerWidth - 320 : false;

  return (
    <AnimatePresence>
      {rect && (
        <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none">
          {/* --- The Spotlight --- */}
          <motion.div
            initial={false}
            animate={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            className="absolute rounded-xl"
            style={{
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)',
            }}
          >
            <span className="absolute -inset-1 rounded-xl border-2 border-primary opacity-75 animate-ping" />
            <span className="absolute inset-0 rounded-xl border-2 border-primary" />

            {/* --- The Card --- */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              key={index}
              className={`absolute w-[300px] pointer-events-auto bg-white rounded-2xl p-5 shadow-2xl flex flex-col gap-3 ${
                isFarRight ? 'right-0' : 'left-0'
              }`}
              style={tooltipStyle}
            >
              {/* Progress Bar */}
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${((index + 1) / steps.length) * 100}%` }}
                />
              </div>

              {/* Header */}
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-900 text-lg leading-tight">{step.title}</h3>
                <button
                  onClick={onSkip}
                  className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
                >
                  <FaTimes size={12} />
                </button>
              </div>

              {/* Content */}
              <p className="text-sm text-gray-500 leading-relaxed">{step.content}</p>

              {/* Footer Controls */}
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50">
                <span className="text-xs font-bold text-gray-400">
                  {index + 1} / {steps.length}
                </span>

                <button
                  onClick={handleNext}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white shadow-lg transition-transform active:scale-95 ${
                    isLastStep ? 'bg-green-500' : 'bg-primary'
                  }`}
                >
                  {isLastStep ? 'Finish' : 'Next'}
                  {isLastStep ? <FaCheck /> : <FaArrowRight />}
                </button>
              </div>

              {/* Arrow Pointer */}
              <div
                className={`absolute w-4 h-4 bg-white transform rotate-45 ${
                  showAbove ? '-bottom-2' : '-top-2'
                } ${isFarRight ? 'right-6' : 'left-6'}`}
              />
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductTour;