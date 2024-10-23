// app/components/game.jsx

'use client';

import React, { useState, useEffect } from 'react';
import GameForm from '../forms/gameForm';
import { useSession } from 'next-auth/react';

export default function Game() {
  const [isVisible, setIsVisible] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const checkVisibility = () => {
      const now = new Date();
      const hours = now.getHours(); // Current hour in 24-hour format
      const minutes = now.getMinutes(); // Current minutes
      const currentTime = hours * 60 + minutes; // Time in total minutes

      const visibleIntervals = [
        { start: 9 * 60, end: 9 * 60 + 50 },   // 09:00 - 09:50
        { start: 10 * 60, end: 10 * 60 + 50 },   // 10:00 - 10:50
        { start: 11 * 60, end: 11 * 60 + 50 },   // 11:00 - 11:50
        { start: 12 * 60, end: 12 * 60 + 50 },   // 12:00 - 12:50
        { start: 13 * 60, end: 13 * 60 + 50 },   // 01:00 - 01:50
        { start: 14 * 60, end: 14 * 60 + 50 },   // 02:00 - 02:50
        { start: 15 * 60, end: 15 * 60 + 50 },   // 03:00 - 03:50
        { start: 16 * 60, end: 16 * 60 + 50 },   // 04:00 - 04:50
        { start: 17 * 60, end: 17 * 60 + 50 },   // 05:00 - 05:50
        { start: 18 * 60, end: 18 * 60 + 50 },   // 06:00 - 06:50
        { start: 19 * 60, end: 19 * 60 + 50 },   // 07:00 - 07:50
        { start: 20 * 60, end: 20 * 60 + 50 },   // 08:00 - 08:50
        { start: 21 * 60, end: 21 * 60 + 50 },   // 09:00 - 09:50
        { start: 22 * 60, end: 22 * 60 + 50 },   // 10:00 - 10:50
      ];

      // Check if the current time is within any of the visible intervals
      const isWithinVisibleInterval = visibleIntervals.some(
        (interval) => currentTime >= interval.start && currentTime <= interval.end
      );

      // If session has admin email, make the form always visible
      if (session?.user?.email === 'jaanbaazfarishta@gmail.com') {
        setIsVisible(true);
      } else {
        setIsVisible(isWithinVisibleInterval);
      }
    };

    checkVisibility();

    const interval = setInterval(checkVisibility, 1000 * 60); // Check every minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, [session]);

  return (
    <div className='sm:hidden'>
      {isVisible ? (
        <div className='flex flex-col justify-center items-center gap-2 border p-2'>
          <GameForm />
        </div>
      ) : (
        <div className="text-center text-red-500">Wait for Next Turn</div>
      )}
    </div>
  );
}
