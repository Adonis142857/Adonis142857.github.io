import React, { useState, useEffect } from "react";

export const Countdown = ({ count }: { count: number }) => {
  const [percent, setPercent] = useState(100);

  useEffect(() => {
    let time = count * 1000;
    let timer: number | null = null;

    const setTimer = () => {
      timer = setInterval(() => {
        if (time === 0) {
          clearTimer();
          return;
        }
        time -= 100;
        setPercent(Math.round((time / (count * 1000)) * 100));
      }, 100);
    };
    const clearTimer = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    setTimer();

    return () => {
      clearTimer();
    };
  }, [count]);

  return (
    <div className="h-1 w-full my-2 rounded-sm border border-white overflow-hidden">
      <div
        className="bg-white h-full transition-all"
        style={{
          width: `${percent}%`,
        }}
      ></div>
    </div>
  );
};
