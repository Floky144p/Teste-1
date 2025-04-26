import { useEffect, useState } from "react";

interface CountdownProps {
  endTime: Date | string;
  onExpire?: () => void;
  className?: string;
}

export function Countdown({ endTime, onExpire, className = "" }: CountdownProps) {
  const calculateTimeLeft = () => {
    const now = new Date();
    const end = typeof endTime === 'string' ? new Date(endTime) : endTime;
    const difference = end.getTime() - now.getTime();
    
    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, expired: true };
    }
    
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    return { hours, minutes, seconds, expired: false };
  };
  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft.expired && onExpire) {
        onExpire();
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [endTime, onExpire]);
  
  const formatNumber = (num: number) => num.toString().padStart(2, '0');
  
  return (
    <div className={`${className} ${timeLeft.expired ? 'text-red-500' : 'countdown-text'}`}>
      {timeLeft.expired ? (
        <>
          <i className="fas fa-exclamation-triangle mr-1"></i>
          EXPIRADO
        </>
      ) : (
        <>
          <i className="fas fa-hourglass-half mr-1"></i>
          {timeLeft.hours}h {formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
        </>
      )}
    </div>
  );
}
