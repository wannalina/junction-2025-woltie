import { motion } from 'motion/react';

interface ScanningAnimationProps {
  dishImage?: string;
}

export function ScanningAnimation({ dishImage }: ScanningAnimationProps) {
  return (
    <div className="relative w-[200px] h-[200px]">
      {/* Circular cropped dish image */}
      {dishImage && (
        <div className="absolute inset-[6px] rounded-full overflow-hidden z-10">
          <img 
            src={dishImage}
            alt="Scanning dish"
            className="w-full h-full object-cover scale-[1.5]"
          />
        </div>
      )}

      {/* Main scanning ring with traveling beam */}
      <motion.div
        className="absolute inset-0 rounded-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Static ring border */}
        <div className="absolute border-[#00c1e8] border-[5px] border-solid inset-0 rounded-full" />
        
        {/* Traveling beam effect */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            background: 'conic-gradient(from 0deg, transparent 340deg, #00c1e8 360deg)',
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </motion.div>

      {/* Scanning line from center to edge - outside overflow container */}
      <motion.div
        className="absolute top-1/2 left-1/2 origin-left z-20"
        style={{
          width: '100px',
          height: '3px',
          background: '#00e8ff',
          boxShadow: '0 0 12px rgba(0, 232, 255, 0.9), 0 0 6px rgba(0, 232, 255, 0.6)',
          transform: 'translateY(-50%)',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Expanding ring 1 */}
      <motion.div
        className="absolute inset-[-10px] rounded-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: [0.8, 0.4, 0.8],
          scale: [0.9, 1, 0.9],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="absolute border-4 border-[#00c1e8] border-solid inset-0 rounded-full" />
      </motion.div>

      {/* Expanding ring 2 */}
      <motion.div
        className="absolute inset-[-22px] rounded-full"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ 
          opacity: [0.6, 0.2, 0.6],
          scale: [0.85, 1.05, 0.85],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.3,
        }}
      >
        <div className="absolute border-[#00c1e8] border-[3px] border-solid inset-0 rounded-full" />
      </motion.div>

      {/* Pulse effect */}
      <motion.div
        className="absolute inset-[6px] rounded-full bg-cyan-400/20"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />

    </div>
  );
}

