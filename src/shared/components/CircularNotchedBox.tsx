import React from 'react';
import { Box, styled, Theme } from '@mui/material';

// Props para el componente
interface CircularNotchedBoxProps {
  children?: React.ReactNode;
  notchPosition?: 'top' | 'bottom' | 'left' | 'right';
  notchSize?: number;
  notchOffset?: number | string;
  borderRadius?: number;
  elevation?: number;
  backgroundColor?: string;
  className?: string;
}

// Componente principal con notch - VERSIÓN CORREGIDA
export const CircularNotchedBox = styled(Box, {
  shouldForwardProp: (prop) => 
    !['notchPosition', 'notchSize', 'notchOffset', 'borderRadius', 'elevation', 'backgroundColor']
      .includes(prop as string)
})<CircularNotchedBoxProps>(({ 
  theme, 
  notchPosition = 'top',
  notchSize = 60,
  notchOffset = '50%',
  borderRadius = 16,
  elevation = 3,
  backgroundColor = theme.palette.background.paper
}) => {
  // Convertir offset a string
  const offsetValue = typeof notchOffset === 'number' ? `${notchOffset}px` : notchOffset;
  
  // Estilos base
  const baseStyles = {
    position: 'relative' as const,
    backgroundColor,
    boxShadow: theme.shadows[elevation],
    overflow: 'visible' as const,
    '&::before': {
      content: '""',
      position: 'absolute' as const,
      width: notchSize * 2,
      height: notchSize * 2,
      borderRadius: '50%',
      backgroundColor,
      zIndex: -1,
      boxShadow: theme.shadows[elevation],
    },
  };

  // Estilos específicos por posición
  switch (notchPosition) {
    case 'top':
      return {
        ...baseStyles,
        borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
        clipPath: `circle(${notchSize}px at ${offsetValue} -${notchSize/2}px)`,
        '&::before': {
          ...baseStyles['&::before'],
          top: `-${notchSize}px`,
          left: offsetValue,
          transform: 'translateX(-50%)',
        }
      };
      
    case 'bottom':
      return {
        ...baseStyles,
        borderRadius: `0 0 ${borderRadius}px ${borderRadius}px`,
        clipPath: `circle(${notchSize}px at ${offsetValue} calc(100% + ${notchSize/2}px))`,
        '&::before': {
          ...baseStyles['&::before'],
          bottom: `-${notchSize}px`,
          left: offsetValue,
          transform: 'translateX(-50%)',
        }
      };
      
    case 'left':
      return {
        ...baseStyles,
        borderRadius: `${borderRadius}px 0 0 ${borderRadius}px`,
        clipPath: `circle(${notchSize}px at -${notchSize/2}px ${offsetValue})`,
        '&::before': {
          ...baseStyles['&::before'],
          left: `-${notchSize}px`,
          top: offsetValue,
          transform: 'translateY(-50%)',
        }
      };
      
    case 'right':
      return {
        ...baseStyles,
        borderRadius: `0 ${borderRadius}px ${borderRadius}px 0`,
        clipPath: `circle(${notchSize}px at calc(100% + ${notchSize/2}px) ${offsetValue})`,
        '&::before': {
          ...baseStyles['&::before'],
          right: `-${notchSize}px`,
          top: offsetValue,
          transform: 'translateY(-50%)',
        }
      };
      
    default:
      return baseStyles;
  }
});

// Componente de contenedor con notch
export const NotchedContainer: React.FC<CircularNotchedBoxProps> = ({ children, ...props }) => {
  return (
    <CircularNotchedBox {...props}>
      {children}
    </CircularNotchedBox>
  );
};

// Props para el botón flotante
interface FloatingNotchedButtonProps {
  children: React.ReactNode;
  notchPosition?: 'top' | 'bottom' | 'left' | 'right';
  notchSize?: number;
  onClick?: () => void;
  color?: 'primary' | 'secondary' | 'default';
  className?: string;
  sx?: any;
}

// Botón flotante con notch - VERSIÓN CORREGIDA
export const FloatingNotchedButton = styled(Box, {
  shouldForwardProp: (prop) => 
    !['notchPosition', 'notchSize', 'color'].includes(prop as string)
})<FloatingNotchedButtonProps>(({ 
  theme, 
  notchPosition = 'top',
  notchSize = 30,
  color = 'primary'
}) => {
  // Obtener color basado en la prop
  const getColor = () => {
    switch (color) {
      case 'primary':
        return theme.palette.primary.main;
      case 'secondary':
        return theme.palette.secondary.main;
      default:
        return theme.palette.grey[300];
    }
  };

  const backgroundColor = getColor();
  const textColor = theme.palette.getContrastText(backgroundColor);
  const notchOffset = notchSize * 0.7;

  // Estilos base
  const baseStyles = {
    position: 'relative' as const,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor,
    color: textColor,
    cursor: 'pointer',
    boxShadow: theme.shadows[6],
    transition: 'all 0.3s ease',
    width: notchSize * 2,
    height: notchSize * 2,
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: theme.shadows[8],
    },
    '&:active': {
      transform: 'scale(0.95)',
    }
  };

  // Estilos para el pseudo-elemento
  const notchStyles = {
    content: '""',
    position: 'absolute' as const,
    backgroundColor,
    zIndex: -1,
  };

  // Estilos específicos por posición
  switch (notchPosition) {
    case 'top':
      return {
        ...baseStyles,
        marginBottom: -notchOffset,
        '&::before': {
          ...notchStyles,
          top: -notchOffset,
          left: '50%',
          transform: 'translateX(-50%)',
          width: notchSize * 2,
          height: notchSize,
          clipPath: 'ellipse(50% 100% at 50% 100%)',
        }
      };
      
    case 'bottom':
      return {
        ...baseStyles,
        marginTop: -notchOffset,
        '&::before': {
          ...notchStyles,
          bottom: -notchOffset,
          left: '50%',
          transform: 'translateX(-50%)',
          width: notchSize * 2,
          height: notchSize,
          clipPath: 'ellipse(50% 100% at 50% 0%)',
        }
      };
      
    case 'left':
      return {
        ...baseStyles,
        marginRight: -notchOffset,
        '&::before': {
          ...notchStyles,
          left: -notchOffset,
          top: '50%',
          transform: 'translateY(-50%)',
          width: notchSize,
          height: notchSize * 2,
          clipPath: 'ellipse(100% 50% at 100% 50%)',
        }
      };
      
    case 'right':
      return {
        ...baseStyles,
        marginLeft: -notchOffset,
        '&::before': {
          ...notchStyles,
          right: -notchOffset,
          top: '50%',
          transform: 'translateY(-50%)',
          width: notchSize,
          height: notchSize * 2,
          clipPath: 'ellipse(100% 50% at 0% 50%)',
        }
      };
      
    default:
      return baseStyles;
  }
});