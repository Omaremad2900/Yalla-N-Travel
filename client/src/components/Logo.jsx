import React from 'react';
import { useLottie } from 'lottie-react';
import animationData from '../lotties/Plane_logo_animation.json'; // Adjust path as necessary
import logoImage from '../assets/logo-text.png';

function Logo() {
  const options = {
    animationData: animationData,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options);

  return (
    <div className="absolute top-2 left-[110px] w-[120px] sm:w-[80px] md:w-[100px] lg:w-[120px]">
      {/* Image Logo */}
      <img
        src={logoImage}
        alt="Logo"
        className="w-[80px] h-auto sm:w-[60px] md:w-[80px] lg:w-[80px] mb-0"
      />
      {/* Lottie Animation */}
      <div className="w-[80px] h-[80px] sm:w-[60px] sm:h-[50px] md:w-[80px] md:h-[60px] lg:w-[80px] lg:h-[80px] mt-[-20px]">
        {View}
      </div>
    </div>
  );
}

export default Logo;
