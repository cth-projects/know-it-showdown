import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { audioManager } from "@/lib/audioManager";

interface CountdownTimerProps {
  targetTimestamp: string;
  onComplete?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetTimestamp,
  onComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const prevTimeLeftRef = useRef<number | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const target = new Date(targetTimestamp).getTime();
      const difference = Math.max(0, Math.ceil((target - now) / 1000) - 1);
      return difference;
    };

    const initial = calculateTimeLeft();
    setTimeLeft(initial);
    setIsActive(true);

    const intervalId = setInterval(() => {
      const remaining = calculateTimeLeft();
      const prevTime = prevTimeLeftRef.current;
      setTimeLeft(remaining);

      if (prevTime === 11 && remaining === 10) {
        audioManager.startLoop("timerAlarm", { volumeModifier: -0.3 });
      }

      // Update ref for next comparison
      prevTimeLeftRef.current = remaining;

      if (remaining <= 0) {
        setIsActive(false);
        clearInterval(intervalId);

        if (onComplete) {
          onComplete();
        }
      }
    }, 100);

    return () => {
      clearInterval(intervalId);
      audioManager.stop("timerAlarm");
    };
  }, [targetTimestamp, onComplete]);

  const formatTime = (seconds: number) => {
    return `${seconds.toString()}`;
  };

  const getTimerGradient = () => {
    if (timeLeft <= 5) return "text-red-500";
    if (timeLeft <= 10) return "text-orange-500";
    return "text-white-400";
  };

  // Animation variants
  const numberVariants: Variants = {
    initial: { scale: 1.2, opacity: 0, y: -20 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 0.8, opacity: 0, y: 20 },
  };

  return (
    <Card className="mx-auto w-fit border-0 bg-transparent shadow-none">
      <CardContent className="p-2">
        {!isActive ? null : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: [0, -4, 0],
            }}
            transition={{
              scale: { duration: 0.3 },
              opacity: { duration: 0.3 },
              y: {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="relative"
          >
            <motion.div
              className="absolute inset-0 -z-10 rounded-full blur-2xl"
              animate={{
                scale:
                  timeLeft <= 5
                    ? [1, 1.15, 1]
                    : timeLeft <= 10
                      ? [1, 1.1, 1]
                      : [1, 1.05, 1],
                opacity:
                  timeLeft <= 5
                    ? [0.4, 0.7, 0.4]
                    : timeLeft <= 10
                      ? [0.3, 0.5, 0.3]
                      : [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: timeLeft <= 5 ? 0.6 : timeLeft <= 10 ? 1.2 : 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background:
                  timeLeft <= 5
                    ? "radial-gradient(circle, rgba(239, 68, 68, 0.5) 0%, transparent 60%)"
                    : timeLeft <= 10
                      ? "radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, transparent 60%)"
                      : "radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 60%)",
              }}
            />

            <div className="relative border-none bg-transparent p-0 font-mono text-7xl font-bold shadow-none sm:text-8xl md:text-9xl">
              <div className="w-[2ch] border-none text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={timeLeft}
                    variants={numberVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{
                      duration: 0.25,
                      ease: "easeOut",
                    }}
                    className={`relative ${getTimerGradient()}`}
                  >
                    {/* The actual number with urgent shake */}
                    <motion.span
                      className="relative block font-bold"
                      animate={{
                        x: timeLeft <= 5 ? [0, -3, 3, -3, 3, 0] : 0,
                      }}
                      transition={{
                        duration: 0.4,
                        repeat: timeLeft <= 5 ? Infinity : 0,
                        repeatDelay: 0.1,
                      }}
                    >
                      {formatTime(timeLeft)}
                    </motion.span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default CountdownTimer;
