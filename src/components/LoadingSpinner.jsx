import React from 'react';

export default function LoadingSpinner({ size = 'medium', color = 'var(--primary-color)' }) {
  const sizeMap = {
    small: '20px',
    medium: '40px',
    large: '60px',
  };

  return (
    <div
      className="loading-spinner"
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        borderTopColor: color,
      }}
    />
  );
}
