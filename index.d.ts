// TypeScript Definitions for KineticType v1.0.0

export type KineticMode = 'magnetic' | 'explode' | 'wave' | 'gravity' | 'matrix';

export interface KineticPhysicsOptions {
  stiffness?: number;
  damping?: number;
  mass?: number;
  forceRadius?: number;
  forceStrength?: number;
  gravity?: number;
  bounce?: number;
}

export interface KineticTypeOptions {
  text?: string;
  mode?: KineticMode;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  density?: number;
  color?: string | string[];
  glow?: boolean;
  glowColor?: string;
  physics?: KineticPhysicsOptions;
}

export declare class KineticType {
  constructor(target: string | HTMLElement, options?: KineticTypeOptions);

  public setText(text: string): void;
  public setMode(mode: KineticMode): void;
  public updateOptions(options: KineticTypeOptions): void;
  public triggerExplosion(centerX: number, centerY: number, radius?: number, force?: number): void;
  public reset(): void;
  public destroy(): void;
}

export default KineticType;
