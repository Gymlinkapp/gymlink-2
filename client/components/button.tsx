import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

const buttonStyle = cva(
  'py-3 px-5 rounded-full flex-row items-center justify-evenly',
  {
    variants: {
      variant: {
        primary: 'bg-primaryWhite text-primaryDark',
        secondary: 'bg-secondaryDark border-1 border-tertiaryDark',
        menu: 'bg-transparent rounded-none border-t-2 border-tertiaryDark',
        danger: 'bg-transparent rounded-none border-t-2 border-tertiaryDark',
        ghost: 'bg-transparent py-0',
      },
    },
  }
);

const buttonTextStyle = cva('font-[MontserratBold] text-xl text-center', {
  variants: {
    variant: {
      primary: 'text-primaryDark',
      secondary: 'text-primaryWhite',
      menu: 'text-primaryWhite',
      danger: 'text-red-500',
      ghost: 'text-secondaryWhite',
    },
    textSize: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
    },
  },
});

interface ButtonProps
  extends TouchableOpacityProps,
    VariantProps<typeof buttonStyle>,
    VariantProps<typeof buttonTextStyle> {
  children: React.ReactNode;
  variant: 'primary' | 'secondary' | 'menu' | 'danger' | 'ghost';
  icon?: React.ReactNode;
  textSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

export default function Button({
  children,
  variant,
  icon,
  textSize,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity {...props} className={buttonStyle({ variant })}>
      {icon && icon}
      <Text className={buttonTextStyle({ variant, textSize })}>{children}</Text>
    </TouchableOpacity>
  );
}
