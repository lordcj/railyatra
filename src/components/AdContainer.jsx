import React from 'react';

const AdContainer = ({ slot = "banner", label = "Sponsored" }) => {
    return (
        <div className="fade-in glass-panel" style={{
            padding: '12px',
            marginBottom: '16px',
            position: 'relative',
            border: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(0, 0, 0, 0.2)', // Slightly darker to distinguish from content
            overflow: 'hidden'
        }}>
            {/* Ad Label */}
            <span style={{
                position: 'absolute',
                top: '4px',
                right: '6px',
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--text-secondary)',
                background: 'rgba(0,0,0,0.3)',
                padding: '2px 4px',
                borderRadius: '4px'
            }}>
                {label}
            </span>

            {/* Mock Content Placeholder */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                opacity: 0.9
            }}>
                {/* Ad Image / Icon Placeholder */}
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                }}>
                    <span style={{ fontSize: '18px' }}>🌟</span>
                </div>

                {/* Ad Text */}
                <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'white', marginBottom: '2px', lineHeight: '1.2' }}>
                        Travel Smart with RailPro
                    </h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.3', margin: 0 }}>
                        Get zero convenience fee on your next booking.
                    </p>
                </div>
            </div>

            {/* Call to Action (Native Fit) */}
            <div style={{
                marginTop: '8px',
                paddingTop: '8px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                <button style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--accent-color)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                }}>
                    Learn More &rarr;
                </button>
            </div>
        </div>
    );
};

export default AdContainer;
