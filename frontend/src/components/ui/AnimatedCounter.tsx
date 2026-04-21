import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface Props {
  value: number;
  decimals?: number;
  format?: boolean;
}

export const AnimatedCounter: React.FC<Props> = ({ value, decimals = 0, format = false }) => {
  const count = useMotionValue(0);
  const display = useTransform(count, (latest) => {
    if (format) return Math.round(latest).toLocaleString();
    return latest.toFixed(decimals);
  });

  useEffect(() => {
    if (value > 0) {
      const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
      return () => controls.stop();
    } else {
      count.set(value);
    }
  }, [value, count]);

  return <motion.span>{display}</motion.span>;
};