import React from 'react';

const ConicGradientEffect = () => {
  const gradientStyle = {
    width: '300px',
    height: '300px',
    display: 'block',
    background: 'conic-gradient(from 0deg at 50% 50%, #e1a6ff 0deg, rgb(18, 173, 230) 180deg, rgb(76, 99, 252) 360deg)',
    overflow: 'hidden',
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(20px)',
    
  };

  return <div style={gradientStyle}></div>;
};

const MeshLines = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center w-full h-full overflow-hidden">
      <ConicGradientEffect />
    </div>
  );
};

export default MeshLines;
