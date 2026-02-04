
import React from 'react';
import { motion } from 'framer-motion';

export default function Logo({ size = 40, animated = false }) {
    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            whileHover={animated ? { scale: 1.1, rotate: 5 } : {}}
            transition={{ type: "spring", stiffness: 300 }}
        >
            {/* Outer Hexagon */}
            <motion.path
                d="M50 5L93.3 30V80L50 105L6.7 80V30L50 5Z"
                stroke="url(#grad1)"
                strokeWidth="4"
                initial={animated ? { pathLength: 0, opacity: 0 } : {}}
                animate={animated ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Inner Brain Circuit */}
            <motion.path
                d="M50 30V70M30 50H70M50 50L35 35M50 50L65 65M50 50L35 65M50 50L65 35"
                stroke="var(--accent-cyan)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={animated ? { pathLength: 0 } : {}}
                animate={animated ? { pathLength: 1 } : {}}
                transition={{ delay: 0.5, duration: 1 }}
            />

            {/* Central Spark */}
            <motion.circle
                cx="50"
                cy="50"
                r="5"
                fill="white"
                initial={animated ? { scale: 0 } : {}}
                animate={animated ? { scale: [0, 1.5, 1] } : {}}
                transition={{ delay: 1, duration: 0.5 }}
            />

            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent-violet)" />
                    <stop offset="100%" stopColor="var(--accent-fuchsia)" />
                </linearGradient>
            </defs>
        </motion.svg>
    );
}
