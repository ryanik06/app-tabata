import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

/**
 * TABATA V4
 * Fitness-grade UI system
 * - Presets (HIIT / Tabata / EMOM)
 * - Sound + vibration feedback
 * - Mobile-first interactions
 * - Stronger motion system
 */

const COLORS = {
  bg: "#0A0A0A",
  work: "#22C55E",
  rest: "#3B82F6",
  text: "#FFFFFF",
  muted: "#A1A1AA",
};

const PRESETS = {
  Tabata: { work: 20, rest: 10, rounds: 8 },
  HIIT: { work: 40, rest: 20, rounds: 6 },
  EMOM: { work: 45, rest: 15, rounds: 10 },
};

export default function TabataV4() {
  const [preset, setPreset] = useState("Tabata");
  const [isRunning, setIsRunning] = useState(false);
  const [isRest, setIsRest] = useState(false);
  const [seconds, setSeconds] = useState(PRESETS[preset].work);
  const [round, setRound] = useState(0);
  const [sound, setSound] = useState(true);

  const audioRef = useRef(null);

  const config = PRESETS[preset];

  const progress = useMemo(() => {
    const total = config.rounds;
    return (round / total) * 100;
  }, [round, config.rounds]);

  const playBeep = () => {
    if (!sound) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(
        "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
      );
    }
    audioRef.current.play();
  };

  const vibrate = () => {
    if (navigator.vibrate) navigator.vibrate(150);
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s > 1) return s - 1;

        // phase switch
        if (!isRest) {
          setIsRest(true);
          playBeep();
          vibrate();
          return config.rest;
        } else {
          setIsRest(false);
          setRound((r) => r + 1);
          playBeep();
          vibrate();
          return config.work;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isRest, config]);

  const toggle = () => setIsRunning((v) => !v);

  const reset = () => {
    setIsRunning(false);
    setSeconds(config.work);
    setRound(0);
    setIsRest(false);
  };

  const activeColor = isRest ? COLORS.rest : COLORS.work;

  return (
    <div className="h-screen w-full flex flex-col items-center justify-between p-6 bg-black">
      {/* HEADER */}
      <div className="w-full flex justify-between items-center">
        <select
          value={preset}
          onChange={(e) => {
            setPreset(e.target.value);
            reset();
          }}
          className="bg-zinc-900 text-white text-sm p-2 rounded-lg"
        >
          {Object.keys(PRESETS).map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <button onClick={() => setSound((s) => !s)}>
          {sound ? <Volume2 color="#fff" /> : <VolumeX color="#666" />}
        </button>
      </div>

      {/* TIMER */}
      <div className="flex flex-col items-center justify-center flex-1">
        <svg className="w-72 h-72">
          <circle cx="144" cy="144" r="120" stroke="#1A1A1A" strokeWidth="10" fill="none" />
          <motion.circle
            cx="144"
            cy="144"
            r="120"
            stroke={activeColor}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="754"
            animate={{ strokeDashoffset: 754 - (754 * seconds) / config.work }}
            transition={{ duration: 0.5 }}
          />
        </svg>

        <div className="absolute text-center">
          <div className="text-zinc-400 uppercase text-sm">
            {isRest ? "Rest" : "Work"}
          </div>
          <div className="text-7xl text-white font-bold">{seconds}</div>
          <div className="text-zinc-500 text-sm">
            Round {round + 1} / {config.rounds}
          </div>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="w-full max-w-md h-1 bg-zinc-800 rounded-full overflow-hidden mb-6">
        <div className="h-full bg-white" style={{ width: `${progress}%` }} />
      </div>

      {/* CONTROLS */}
      <div className="flex gap-6">
        <button onClick={reset} className="p-3 bg-zinc-900 rounded-full">
          <RotateCcw color="#fff" />
        </button>

        <motion.button
          onClick={toggle}
          className="p-5 rounded-full"
          style={{ background: activeColor }}
          whileTap={{ scale: 0.9 }}
        >
          {isRunning ? <Pause color="#000" /> : <Play color="#000" />}
        </motion.button>
      </div>

      {/* FOOTER */}
      <div className="text-xs text-zinc-600 mt-4">V4 • Fitness System</div>
    </div>
  );
}

