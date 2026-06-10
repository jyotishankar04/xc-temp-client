"use client";

import { useEffect, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";

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

export function LaunchHeroCountdown({
  targetDate,
  className,
  onLiveChange,
}: {
  targetDate: Date;
  className?: string;
  onLiveChange?: (isLive: boolean) => void;
}) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(targetDate));
  const lastBeepSecondRef = useRef<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(id);
  }, [targetDate]);

  const isLive =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  useEffect(() => {
    onLiveChange?.(isLive);
  }, [isLive, onLiveChange]);

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
  }, [timeLeft]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  if (isLive) {
    return (
      <div
        className={cn(
          "mx-auto flex min-h-36 w-full items-center justify-center rounded-lg border bg-card px-6 text-center shadow-sm",
          className
        )}
      >
        <p className="text-3xl font-semibold tracking-normal text-primary sm:text-4xl">
          We&apos;re live!
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mx-auto grid w-full grid-cols-2 overflow-hidden rounded-lg border bg-card shadow-sm md:grid-cols-4",
        className
      )}
    >
      {units.map((unit, index) => (
        <div
          key={unit.label}
          className={cn(
            "relative flex min-h-28 flex-col items-center justify-center px-3 py-6 sm:min-h-32",
            index % 2 === 0 && "border-r border-border md:border-r-0",
            index < 2 && "border-b border-border md:border-b-0",
            index > 0 && "md:border-l md:border-border"
          )}
        >
          <div className="font-mono text-3xl font-semibold leading-none tracking-normal text-foreground sm:text-4xl">
            <NumberFlow value={unit.value} />
          </div>
          <p className="mt-3 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            {unit.label}
          </p>
        </div>
      ))}
    </div>
  );
}
