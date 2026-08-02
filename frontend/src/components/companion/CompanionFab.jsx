import React from 'react';

/**
 * Floating Action Button for AgriSphere Companion (Fixed Bottom-Right)
 */
export default function CompanionFab({ onClick, isOpen }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open AgriSphere Companion"
      title="Open AgriSphere Companion (Agentic AI)"
      style={{
        position: 'fixed',
        bottom: 84,
        right: 20,
        width: 58,
        height: 58,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
        color: '#FFFFFF',
        border: '2px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 10px 28px rgba(46, 125, 50, 0.4), 0 4px 10px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 26,
        cursor: 'pointer',
        zIndex: 9990,
        transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: isOpen ? 'scale(0.9) rotate(45deg)' : 'scale(1)',
      }}
    >
      {isOpen ? '✕' : '🌾'}
    </button>
  );
}
