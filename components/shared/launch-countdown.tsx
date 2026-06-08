"use client";

import { useEffect, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(targetDate: Date): TimeLeft {
  const diff = targetDate.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

function playLaunchBeep() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(720, context.currentTime);
    gain.gain.setValueAtTime(0.001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.16);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.18);
    window.setTimeout(() => void context.close(), 260);
  } catch {
    // Browsers can block audio without a prior user gesture.
  }
}

function CountdownLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative max-w-[14ch] text-xs uppercase leading-tight tracking-widest text-muted-foreground after:absolute after:left-1/2 after:top-full after:h-10 after:w-px after:-translate-x-1/2 after:bg-gradient-to-b after:from-border after:to-transparent after:content-['']">
      {children}
    </span>
  );
}

function CountdownUnit({
  label,
  value,
  size,
  index,
}: {
  label: string;
  value: number;
  size: "default" | "display" | "compact";
  index: number;
}) {
  const isDisplay = size === "display";
  const isCompact = size === "compact";

  return (
    <motion.div
      initial={{ opacity: 0, y: isDisplay ? 28 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center"
    >
      <div
        className={cn(
          "relative flex items-center justify-center rounded-2xl border bg-background/80 font-mono tabular-nums shadow-sm ring-1 ring-foreground/5 backdrop-blur-sm",
          isDisplay && "size-20 text-4xl font-semibold sm:size-24 sm:text-5xl",
          !isDisplay && !isCompact && "size-16 text-3xl font-semibold sm:size-20 sm:text-4xl",
          isCompact && "h-9 min-w-9 px-2 text-sm font-medium"
        )}
      >
        <NumberFlow
          value={value}
          format={isCompact ? { minimumIntegerDigits: 2 } : undefined}
        />
      </div>
      {!isCompact && (
        <span className="mt-2.5 text-xs font-medium uppercase tracking-widest text-muted-foreground sm:text-sm">
          {label}
        </span>
      )}
    </motion.div>
  );
}

export function LaunchCountdown({
  targetDate,
  className,
  variant = "default",
  label = "Launching in",
}: {
  targetDate: Date;
  className?: string;
  variant?: "default" | "display";
  label?: string;
}) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(targetDate));
  const lastBeepSecondRef = useRef<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  useEffect(() => {
    const shouldBeep =
      timeLeft.days === 0 &&
      timeLeft.hours === 0 &&
      timeLeft.minutes === 0 &&
      timeLeft.seconds > 0 &&
      timeLeft.seconds <= 3;

    if (!shouldBeep || lastBeepSecondRef.current === timeLeft.seconds) {
      return;
    }

    lastBeepSecondRef.current = timeLeft.seconds;
    playLaunchBeep();
  }, [timeLeft]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  const isOver =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  if (isOver) {
    return (
      <div className={cn("flex flex-col items-center gap-2", className)}>
        <span className="text-lg font-semibold text-primary">We&apos;re live!</span>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center gap-5", className)}>
      {variant === "display" && <CountdownLabel>{label}</CountdownLabel>}
      <div className="flex items-center justify-center gap-3 sm:gap-5">
        {units.map((unit, index) => (
          <CountdownUnit
            key={unit.label}
            label={unit.label}
            value={unit.value}
            size={variant === "display" ? "display" : "default"}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

export function LaunchCountdownCompact({
  targetDate,
  className,
}: {
  targetDate: Date;
  className?: string;
}) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(targetDate));
  const lastBeepSecondRef = useRef<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  useEffect(() => {
    const shouldBeep =
      timeLeft.days === 0 &&
      timeLeft.hours === 0 &&
      timeLeft.minutes === 0 &&
      timeLeft.seconds > 0 &&
      timeLeft.seconds <= 3;

    if (!shouldBeep || lastBeepSecondRef.current === timeLeft.seconds) {
      return;
    }

    lastBeepSecondRef.current = timeLeft.seconds;
    playLaunchBeep();
  }, [timeLeft]);

  const isOver =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  if (isOver) {
    return (
      <span className={cn("font-semibold text-primary-foreground", className)}>
        We&apos;re live!
      </span>
    );
  }

  const units = [
    { label: "d", value: timeLeft.days },
    { label: "h", value: timeLeft.hours },
    { label: "m", value: timeLeft.minutes },
    { label: "s", value: timeLeft.seconds },
  ];

  return (
    <div className={cn("flex items-center gap-1.5 font-mono text-sm font-medium tabular-nums", className)}>
      {units.map((unit, index) => (
        <span key={unit.label} className="flex items-center gap-1.5">
          {index > 0 && <span className="text-primary-foreground/50">:</span>}
          <span className="inline-flex min-w-[2ch] justify-center rounded-md bg-primary-foreground/15 px-1.5 py-0.5">
            <NumberFlow value={unit.value} format={{ minimumIntegerDigits: 2 }} />
          </span>
        </span>
      ))}
    </div>
  );
}
