import React from 'react';
import { SvgXml } from 'react-native-svg';

interface GoogleIconProps {
  size?: number;
}

const GoogleIcon: React.FC<GoogleIconProps> = ({ size = 30 }) => {
  const svgXml = `
    <svg width="${size}" height="${size}" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="15" r="15" fill="white"/>
      <path d="M22.34 15.17c0-.53-.05-1.04-.14-1.53H15.14v2.9h4.04c-.18.93-.7 1.72-1.5 2.25v1.88h2.42c1.42-1.31 2.24-3.23 2.24-5.5z" fill="#4285F4"/>
      <path d="M15.14 22.5c2.03 0 3.72-.67 4.96-1.85l-2.42-1.88c-.67.45-1.53.71-2.54.71-1.95 0-3.6-1.32-4.2-3.1H8.44v1.94c1.23 2.45 3.75 4.18 6.7 4.18z" fill="#34A853"/>
      <path d="M10.94 16.42c-.15-.45-.24-.93-.24-1.42s.09-.97.24-1.42v-1.94H8.44c-.51 1.01-.8 2.15-.8 3.36s.29 2.35.8 3.36l2.5-1.94z" fill="#FBBC05"/>
      <path d="M15.14 10.48c1.1 0 2.09.38 2.87 1.12l2.15-2.15C18.86 7.24 17.16 6.5 15.14 6.5c-2.93 0-5.47 1.68-6.7 4.18l2.5 1.94c.6-1.78 2.25-3.1 4.2-3.1z" fill="#EA4335"/>
    </svg>
  `;

  return <SvgXml xml={svgXml} width={size} height={size} />;
};

export default GoogleIcon;
