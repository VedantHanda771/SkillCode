import React from 'react';

const Preloader = () =>{
    return (
        <>
        <div className="relative">
        <div className="h-screen p-10 bg-gray-50 absolute top-0 left-0 z-10 w-full flex flex-col gap-10 tracking-tighter">    
            <h1 className='text-8xl text-black'>Problem Set</h1>
            <h1 className='text-8xl text-black'>Road Map</h1>
            <h1 className='text-8xl text-black'>Cources</h1>
        </div>
        <div className="heading h-screen flex justify-center place-item-center">
            <h1 className='text-9xl font-bold text-red-500 '>CheatCode</h1>
        </div>
        </div>
        </>
    );
}

export default Preloader;