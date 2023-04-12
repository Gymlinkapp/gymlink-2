import { calculateCardHeight, calculateSnapInterval } from './ui';

export const snapToInterval = (height: number): number =>
  calculateSnapInterval(calculateCardHeight(height));
