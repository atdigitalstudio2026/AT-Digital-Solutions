import React from 'react';

export const AuroraBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Primary Top-Left Aurora Orb (Violet) */}
      <div 
        className="absolute -top-[160px] -left-[140px] w-[540px] h-[540px] rounded-full blur-[110px] opacity-40 mix-blend-screen animate-drift-1"
        style={{ background: 'radial-gradient(circle, #7c5cff 0%, rgba(124, 92, 255, 0) 70%)' }}
      />

      {/* Secondary Top-Right Aurora Orb (Magenta) */}
      <div 
        className="absolute top-[80px] -right-[160px] w-[480px] h-[480px] rounded-full blur-[100px] opacity-35 mix-blend-screen animate-drift-2"
        style={{ background: 'radial-gradient(circle, #ff4fd8 0%, rgba(255, 79, 216, 0) 70%)' }}
      />

      {/* Bottom Center Aurora Orb (Cyan / Teal) */}
      <div 
        className="absolute bottom-[-160px] left-[30%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 mix-blend-screen animate-drift-1"
        style={{ background: 'radial-gradient(circle, #00e0c6 0%, rgba(0, 224, 198, 0) 70%)' }}
      />

      {/* Subtle Grain Overlay for texture */}
      <div 
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
          backgroundSize: '4px 4px'
        }}
      />
    </div>
  );
};
