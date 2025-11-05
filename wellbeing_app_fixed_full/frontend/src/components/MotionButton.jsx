import React from "react";
import { motion } from "framer-motion";

export default function MotionButton({ children, className = "", ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className={`transition-colors ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
