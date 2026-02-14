// Simplified SVG path data for world map (low-fidelity representation)
// Each country is represented by a simplified path for interactive selection
export interface CountryPath {
  code: string;
  path: string;
  center: { x: number; y: number };
}

export const COUNTRY_PATHS: CountryPath[] = [
  { code: 'US', path: 'M150,180 L280,180 L280,260 L150,260 Z', center: { x: 215, y: 220 } },
  { code: 'CA', path: 'M150,100 L300,100 L300,170 L150,170 Z', center: { x: 225, y: 135 } },
  { code: 'MX', path: 'M150,270 L250,270 L250,320 L150,320 Z', center: { x: 200, y: 295 } },
  { code: 'BR', path: 'M320,320 L420,320 L420,420 L320,420 Z', center: { x: 370, y: 370 } },
  { code: 'AR', path: 'M300,420 L360,420 L360,500 L300,500 Z', center: { x: 330, y: 460 } },
  { code: 'GB', path: 'M480,140 L510,140 L510,170 L480,170 Z', center: { x: 495, y: 155 } },
  { code: 'FR', path: 'M490,180 L530,180 L530,220 L490,220 Z', center: { x: 510, y: 200 } },
  { code: 'ES', path: 'M470,220 L520,220 L520,250 L470,250 Z', center: { x: 495, y: 235 } },
  { code: 'IT', path: 'M530,210 L560,210 L560,260 L530,260 Z', center: { x: 545, y: 235 } },
  { code: 'DE', path: 'M520,160 L560,160 L560,190 L520,190 Z', center: { x: 540, y: 175 } },
  { code: 'PL', path: 'M560,150 L600,150 L600,180 L560,180 Z', center: { x: 580, y: 165 } },
  { code: 'RU', path: 'M600,80 L800,80 L800,200 L600,200 Z', center: { x: 700, y: 140 } },
  { code: 'CN', path: 'M750,180 L880,180 L880,280 L750,280 Z', center: { x: 815, y: 230 } },
  { code: 'IN', path: 'M700,260 L780,260 L780,340 L700,340 Z', center: { x: 740, y: 300 } },
  { code: 'JP', path: 'M900,200 L950,200 L950,260 L900,260 Z', center: { x: 925, y: 230 } },
  { code: 'AU', path: 'M820,400 L920,400 L920,480 L820,480 Z', center: { x: 870, y: 440 } },
  { code: 'ZA', path: 'M560,420 L620,420 L620,480 L560,480 Z', center: { x: 590, y: 450 } },
  { code: 'EG', path: 'M560,240 L600,240 L600,280 L560,280 Z', center: { x: 580, y: 260 } },
  { code: 'SA', path: 'M620,260 L680,260 L680,310 L620,310 Z', center: { x: 650, y: 285 } },
  { code: 'TR', path: 'M580,200 L640,200 L640,230 L580,230 Z', center: { x: 610, y: 215 } },
  { code: 'SE', path: 'M540,100 L570,100 L570,150 L540,150 Z', center: { x: 555, y: 125 } },
  { code: 'NO', path: 'M520,80 L560,80 L560,140 L520,140 Z', center: { x: 540, y: 110 } },
  { code: 'FI', path: 'M570,90 L610,90 L610,140 L570,140 Z', center: { x: 590, y: 115 } },
];

export function getCountryPath(code: string): CountryPath | undefined {
  return COUNTRY_PATHS.find((c) => c.code === code);
}
