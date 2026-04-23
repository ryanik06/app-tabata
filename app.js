import { useEffect, useMemo, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * TABATA TIMER V3
 * Direction artistique: Apple Fitness+ / Nike Training Club inspired
 * - Design system structuré
 * - UI focus unique (timer-centric)
 * - Timeline rounds
 * - Micro-interactions premium
 */

const COLORS = {
  bg: "#0A0A0A",
  card: "#111111",
  muted: "#A1A1AA",
  white: "#FFFFFF",
  work: "#22C55E",
  rest: "#3B82F6",
};

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TabataV3() {
  const [isRunning, setIsRunning] = useState(false);
  const [isRest, setIsRest] = useState(false);
  const [seconds, setSeconds] = useState(20);
  const [currentRound, setCurrentRound] = useState(0);

  const rounds = useMemo(
    () => [
      { name: "Warm-up", duration: 20 },
      { name: "Sprint", duration: 20 },
      { name: "Burn", duration: 20 },
      { name: "Final Push", duration: 20 },
    ],
    []
  );

  const total = rounds.length;

  const progress = useMemo(() => {
    const elapsed = currentRound + (1 - seconds / 20);
    return (elapsed / total) * 100;
  }, [currentRound, seconds, total]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s > 1) return s - 1;

        setIsRest((r) => !r);

        if (!isRest) {
          return 10;
        } else {
          setCurrentRound((r) => Math.min(r + 1, rounds.length - 1));
          return 20;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isRest, rounds.length]);

  const toggle = () => setIsRunning((v) => !v);

  const reset = () => {
    setIsRunning(false);
    setSeconds(20);
    setIsRest(false);
    setCurrentRound(0);
  };

  const activeColor = isRest ? COLORS.rest : COLORS.work;

  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-between p-6"
      style={{ background: COLORS.bg }}
    >
      {/* HEADER */}
      <div className="w-full flex justify-between items-center">
        <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Tabata V3
        </div>
        <div className="text-xs text-zinc-600">Fitness OS UI</div>
      </div>

      {/* MAIN FOCUS */}
      <div className="relative flex flex-col items-center justify-center flex-1">
        {/* Circular progress ring */}
        <svg className="w-72 h-72">
          <circle
            cx="144"
            cy="144"
            r="120"
            stroke="#1A1A1A"
            strokeWidth="10"
            fill="none"
          />
          <motion.circle
            cx="144"
            cy="144"
            r="120"
            stroke={activeColor}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="754"
            animate={{
              strokeDashoffset: 754 - (754 * seconds) / 20,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute text-center">
          <div className="text-zinc-500 text-sm tracking-widest uppercase">
            {isRest ? "Rest" : "Work"}
          </div>

          <div className="text-7xl font-semibold tracking-tight text-white">
            {seconds}
          </div>

          <div className="mt-2 text-sm text-zinc-500">
            {rounds[currentRound]?.name}
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="w-full max-w-md flex gap-2 mb-6">
        {rounds.map((r, i) => (
          <motion.div
            key={i}
            className="flex-1 h-1 rounded-full"
            animate={{
              backgroundColor:
                i < currentRound
                  ? COLORS.white
                  : i === currentRound
                  ? activeColor
                  : "#1f1f1f",
            }}
          />
        ))}
      </div>

      {/* CONTROLS */}
      <div className="flex items-center gap-6">
        <button
          onClick={reset}
          className="p-3 rounded-full bg-zinc-900 hover:bg-zinc-800 transition"
        >
          <RotateCcw size={18} color="#fff" />
        </button>

        <motion.button
          onClick={toggle}
          className="p-5 rounded-full"
          style={{ background: activeColor }}
          whileTap={{ scale: 0.92 }}
        >
          {isRunning ? <Pause color="black" /> : <Play color="black" />}
        </motion.button>
      </div>

      {/* FOOTER LABEL */}
      <div className="text-xs text-zinc-600 mt-4">
        Focus • Intensity • Flow
      </div>
    </div>
  );
}

