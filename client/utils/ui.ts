import { Platform } from 'react-native';
import { HEADER_HEIGHT, NAVBAR_HEIGHT, SPACING } from './sizes';

// gets the height of the card based on the remaining space from the navbar and header.
export const calculateCardHeight = (height: number) => {
  return height - NAVBAR_HEIGHT * 2;
};

// calculates the snap interval for the card based on the height of the card and the spacing.
export const calculateSnapInterval = (cardHeight: number) => {
  return cardHeight + SPACING * 2;
};

export const keyboardVerticalOffset = Platform.OS === 'ios' ? 15 : 0;

export const truncate = (str: string, n: number) => {
  return str?.substring(0, n) + '...';
};
