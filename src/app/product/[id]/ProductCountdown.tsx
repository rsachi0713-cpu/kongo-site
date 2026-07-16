"use client";

import { useState, useEffect } from 'react';

interface ProductCountdownProps {
  offerEndDate?: string | null;
}

export default function ProductCountdown({ offerEndDate }: ProductCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 26,
    minutes: 50,
    seconds: 1
  });

  useEffect(() => {
    if (offerEndDate) {
      const calculateTimeLeft = () => {
        const diff = new Date(offerEndDate).getTime() - new Date().getTime();
        if (diff <= 0) {
          return { hours: 0, minutes: 0, seconds: 0 };
        }
        const totalSecs = Math.floor(diff / 1000);
        const hours = Math.floor(totalSecs / 3600);
        const minutes = Math.floor((totalSecs % 3600) / 60);
        const seconds = totalSecs % 60;
        return { hours, minutes, seconds };
      };

      setTimeLeft(calculateTimeLeft());

      const interval = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(interval);
    } else {
      // Mock fallback ticking countdown
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          let { hours, minutes, seconds } = prev;
          if (seconds > 0) {
            seconds--;
          } else {
            seconds = 59;
            if (minutes > 0) {
              minutes--;
            } else {
              minutes = 59;
              if (hours > 0) {
                hours--;
              } else {
                hours = 26;
                minutes = 50;
                seconds = 1;
              }
            }
          }
          return { hours, minutes, seconds };
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [offerEndDate]);

  return (
    <div className="bg-yellow-400 text-black py-2.5 px-4 flex justify-between items-center rounded-sm border border-yellow-500 shadow-sm">
      <span className="font-inter text-xs uppercase tracking-wider font-black text-gray-800 flex items-center gap-1.5">
        <span className="material-symbols-outlined text-sm text-red-600 animate-pulse">local_fire_department</span>
        Flash Offer Ends In
      </span>
      <div className="flex items-center gap-1.5 font-mono text-base font-extrabold text-black">
        <span className="bg-black text-white px-2 py-0.5 rounded-sm min-w-[28px] text-center">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span>:</span>
        <span className="bg-black text-white px-2 py-0.5 rounded-sm min-w-[28px] text-center">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span>:</span>
        <span className="bg-black text-white px-2 py-0.5 rounded-sm min-w-[28px] text-center">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
