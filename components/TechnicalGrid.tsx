'use client'
import React, { useState, useEffect } from 'react';

export default function TechnicalGrid() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const greetings = [
      'Happy you made it',
      'Glad you stopped by',
      'Thanks for visiting',
      'Good to see you here',
      'Appreciate you being here',
      'Nice of you to drop by'
    ];
    
    // Use the day of year to get a consistent but rotating greeting
    const dayOfYear = Math.floor((currentTime.getTime() - new Date(currentTime.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    return greetings[dayOfYear % greetings.length];
  };

  const formatDateTime = () => {
    const year = currentTime.getFullYear();
    const month = String(currentTime.getMonth() + 1).padStart(2, '0');
    const day = String(currentTime.getDate()).padStart(2, '0');
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentTime.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-center p-6">
      <div className="text-lg font-medium text-foreground mb-2">
        {getGreeting()}
      </div>
      <div className="text-sm text-foreground/60 font-mono">
        {formatDateTime()}
      </div>
    </div>
  );
} 