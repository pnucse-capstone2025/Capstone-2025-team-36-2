import React from 'react';
import { SvgXml } from 'react-native-svg';

interface PlusIconProps {
  size?: number;
  color?: string;
}

const PlusIcon: React.FC<PlusIconProps> = ({ size = 24, color = '#7D7D7D' }) => {
  const svgXml = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5V19M5 12H19" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  return <SvgXml xml={svgXml} width={size} height={size} />;
};

export default PlusIcon;


