export type GlowColor = 'off' | 'yellow' | 'red';

export interface GlowMessage {
  type: 'SET_GLOW';
  color: GlowColor;
}

declare global {
  interface Window {
    __trafficGlowOverlay?: HTMLDivElement;
  }
}

// This export makes this file a module, allowing global augmentation
export {};
