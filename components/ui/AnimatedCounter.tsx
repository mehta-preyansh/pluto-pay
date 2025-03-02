"use client";
import React from "react";
import CountUp from "react-countup";

const AnimatedCounter = ({ number }: { number: number }) => {
  return (
    <div className="w-full">
      <CountUp decimal="." prefix="$" end={number} duration={2} decimals={2} />
    </div>
  );
};

export default AnimatedCounter;
