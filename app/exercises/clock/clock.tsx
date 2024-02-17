"use client";
import { useEffect, useState } from "react";

function useCurrentDate() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return date;
}

export default function Clock() {
  const date = useCurrentDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return (
    <ClockImpl hours={hours} minutes={minutes} seconds={seconds} size={300} />
  );
}

function padTwoDigit(number: number) {
  return number >= 10 ? String(number) : `0${number}`;
}

function ClockImpl({
  hours,
  minutes,
  seconds,
  size,
}: {
  hours: number;
  minutes: number;
  seconds: number;
  size: number;
}) {
  const FULL_ROTATION_DEGREES = 360;

  const secondsPercentage = seconds / 60; // 0.5
  // To have second-level precision in the minute hand angle.
  const minutesPercentage = (minutes + secondsPercentage) / 60;
  // To have minute-level precision in the hour hand angle.
  const hoursPercentage = ((hours % 12) + minutesPercentage) / 12;

  const hourAngle = hoursPercentage * FULL_ROTATION_DEGREES;
  const minutesAngle = minutesPercentage * FULL_ROTATION_DEGREES;
  const secondsAngle = secondsPercentage * FULL_ROTATION_DEGREES;

  const dateTimeDisplay = `${padTwoDigit(hours)}:${padTwoDigit(
    minutes
  )}:${padTwoDigit(seconds)}`;

  return (
    <div className="flex">
      <time
        style={{ ["--size" as string]: `${size}px` }}
        className="clock"
        dateTime={dateTimeDisplay}
      >
        <Hand angle={hourAngle} height={0.6} width={3} />
        <Hand angle={minutesAngle} height={0.8} width={2} />
        <Hand angle={secondsAngle} height={1} width={1} />
      </time>
    </div>
  );
}

function Hand({
  angle,
  height = 1,
  width = 1,
}: {
  angle: number;
  height?: number;
  width?: number;
}) {
  return (
    <div
      aria-hidden={true}
      className="hand"
      style={{
        transform: `rotate(${angle}deg) scaleY(${height}) scaleX(${width})`,
      }}
    />
  );
}
