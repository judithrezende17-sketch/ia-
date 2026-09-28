'use client';

import React from 'react';
import {
  Cat, Dog, Bird, Fish, Rabbit, Squirrel, Snail, Bug, Trees, Feather, Leaf, Flame,
  Rocket, Globe, Moon, Sun, Telescope, Orbit, Satellite, Sparkles, Zap, Compass, Shield, Radio,
  Crown, Gem, Sword, Scroll, Key, Anchor,
  Coffee, Pizza, Apple, IceCream, UtensilsCrossed, Cookie, Egg, Cake, Carrot, Wine,
  Laptop, Smartphone, Gamepad2, Headphones, Camera, Watch, Cpu, HardDrive, Wifi, Tv,
  HelpCircle, LucideProps
} from 'lucide-react';

interface GameIconProps extends LucideProps {
  name: string;
}

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Cat, Dog, Bird, Fish, Rabbit, Squirrel, Snail, Bug, Trees, Feather, Leaf, Flame,
  Rocket, Globe, Moon, Sun, Telescope, Orbit, Satellite, Sparkles, Zap, Compass, Shield, Radio,
  Crown, Gem, Sword, Scroll, Key, Anchor,
  Coffee, Pizza, Apple, IceCream, UtensilsCrossed, Cookie, Egg, Cake, Carrot, Wine,
  Laptop, Smartphone, Gamepad2, Headphones, Camera, Watch, Cpu, HardDrive, Wifi, Tv
};

export function GameIcon({ name, ...props }: GameIconProps) {
  const IconComponent = ICON_MAP[name] || HelpCircle;
  return <IconComponent {...props} />;
}
