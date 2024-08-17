import React from 'react';
import { Urbanist } from '@next/font/google';
import { SignIn,SignUp } from '@clerk/nextjs';

const urbanist = Urbanist({
    subsets: ['latin'],
    weight: ['600'],
    
  });

const Content = () => {
  return (
    <div className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto flex flex-col items-center gap-12 z-10">
      <h1
  className={`${urbanist.className} text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-semibold text-center bg-clip-text text-transparent`}
  style={{
    background: 'radial-gradient( black, gray)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
  }}
>
  Memoria
</h1>

      <p className="text-2xl text-center text-gray-700 text-lg">
        Unlock smarter studying with Memoria, your AI-powered flashcard generator. Simply input your topic, and Memoria will instantly create custom flashcards tailored to your learning needs. Streamline your revision and master any subject with ease.
      </p>
      <button className="px-6 py-3 bg-black text-white rounded-md shadow-md hover:bg-gray-800 transition-colors duration-300">
        Get Started
      </button>
    </div>
  );
};

export default Content;