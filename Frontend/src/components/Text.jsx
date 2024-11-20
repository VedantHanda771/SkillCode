import React from 'react';
import '../assets/fonts/fonts.css'

function Text() {
  return (
    <div 
      className='flex justify-center items-center mt-64'
      style={{ 
        color: "#ECFFE6", 
        fontFamily: "'New Amsterdam', sans-serif", 
        fontWeight: 400,
        fontStyle: "normal" 
      }}
    >
      <h3 className='text-white text-8xl text-left w-1/2 flex justify-center items-center'>
        CheatCode
      </h3>
    </div>
  );
}

export default Text;
