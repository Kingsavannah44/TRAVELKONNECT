import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Sparkles } from 'lucide-react';

const LoadingSpinner = ({ size = 'large', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] space-y-6">
      <div className="relative">
        <motion.div
          animate={{ 
            rotate: 360,
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          }}
          className={`${sizeClasses[size]} gradient-bg rounded-2xl p-4 shadow-2xl`}
        >
          <Truck className="w-full h-full text-white" />
        </motion.div>
        
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity }
          }}
          className="absolute -top-2 -right-2 p-2 bg-yellow-400 rounded-full shadow-lg"
        >
          <Sparkles className="h-4 w-4 text-yellow-800" />
        </motion.div>
        
        {/* Animated rings */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0.3, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute inset-0 ${sizeClasses[size]} border-4 border-blue-400 rounded-2xl`}
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          className={`absolute inset-0 ${sizeClasses[size]} border-4 border-purple-400 rounded-2xl`}
        />
      </div>
      
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-center"
      >
        <p className="text-gray-700 text-lg font-semibold mb-2">{message}</p>
        <div className="flex space-x-1 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -10, 0] }}
              transition={{ 
                duration: 0.6, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
              className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;