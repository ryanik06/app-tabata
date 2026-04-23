import { useEffect, useMemo, useState } from "react";
import { Play, Pause, RotateCcw, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * TABATA TIMER V2
 * Direction artistique: Apple Fitness / Nike Training Club inspired
 * - Typo large / contrast fort
 * - Timer circulaire animé
 * - Rounds nommés
 * - UI minimal mais premium
 */

export default function TabataApp() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [seconds, setSeconds] = useState(20);
  const [workTime, setWorkTime] = useState(20);
  const [restTime, setRestTime] = useState(10);
  const [isRest, setIsRest] = useState(false);

  const [rounds, setRounds] = useState([
    { name: "Warm-up", duration: 20 },
    { name: "Sprint", duration: 20 },
    { name: "Burn", duration: 20 },
    { name: "Final push", duration: 20 },
  ]);

  const totalProgress = useMemo(() => {
    const total = rounds.length * workTime;
    const elapsed = currentRound * workTime + (workTime - seconds);
    return Math.min(100, (elapsed / total) * 100);
  }, [seconds, currentRound, workTime, rounds.length]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s > 1) return s - 1;

        // switch phase
        if (!isRest) {
          setIsRest(true);
          return restTime;
        } else {
          setIsRest(false);
          setCurrentRound((r) => Math.min(r + 1, rounds.length - 1));
          return workTime;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isRest, workTime, restTime, rounds.length]);

  const toggle = () => setIsRunning((v) => !v);

  const reset = () => {
    setIsRunning(false);
    setCurrentRound(0);
    setIsRest(false);
    setSeconds(workTime);
  };

  const updateRoundName = (index, name) => {
    const copy = [...rounds];
    copy[index].name = name;
    setRounds(copy);
  };

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col items-center justify-between p-6">
      {/* HEADER */}
      <div className="w-full flex justify-between items-center">
        <h1 className="text-xl tracking-widest uppercase opacity-70">
          Tabata V2
        </h1>
        <div className="text-xs opacity-50">Apple-inspired training UI</div>
      </div>

      {/* MAIN TIMER */}
      <div className="relative flex flex-col items-center justify-center">
        <svg className="w-64 h-64">
          <circle
            cx="128"
            cy="128"
            r="110"
            stroke="#222"
            strokeWidth="10"
            fill="none"
          />
          <motion.circle
            cx="128"
            cy="128"
            r="110"
            stroke={isRest ? "#3b82f6" : "#22c55e"}
            strokeWidth="10"
            fill="none"
            strokeDasharray="690"
            strokeDashoffset={690 - (690 * (seconds / workTime))}
            strokeLinecap="round"
            animate={{ strokeDashoffset: 690 - (690 * (seconds / workTime)) }}
            transition={{ duration: 0.5 }}
          />
        </svg>

        <div className="absolute text-center">
          <div className="text-sm uppercase opacity-60">
            {isRest ? "Rest" : rounds[currentRound]?.name}
          </div>
          <div className="text-6xl font-bold tracking-tight">
            {seconds}
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex gap-4 items-center">
        <button
          onClick={toggle}
          className="p-4 rounded-full bg-white text-black hover:scale-105 transition"
        >
          {isRunning ? <Pause /> : <Play />}
        </button>
        <button
          onClick={reset}
          className="p-3 rounded-full bg-zinc-800 hover:bg-zinc-700"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* ROUNDS EDITOR */}
      <div className="w-full max-w-md space-y-2">
        <div className="text-xs opacity-50 uppercase">Rounds</div>
        {rounds.map((r, i) => (
          <input
            key={i}
            value={r.name}
            onChange={(e) => updateRoundName(i, e.target.value)}
            className="w-full bg-zinc-900 rounded-xl p-3 text-sm outline-none focus:bg-zinc-800"
          />
        ))}
      </div>

      {/* FOOTER PROGRESS */}
      <div className="w-full">
        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-white"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
