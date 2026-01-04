import React from 'react';

const LoadingSpinner = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        color: 'var(--accent-color)'
    }}>
        <div className="spinner" style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(45, 212, 191, 0.1)',
            borderTopColor: 'var(--accent-color)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
        }} />
        <style>
            {`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}
        </style>
    </div>
);

export default LoadingSpinner;
