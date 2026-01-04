/**
 * Google AdSense Integration Component
 * Replace with your actual AdSense publisher ID
 * 
 * SETUP INSTRUCTIONS:
 * 1. Sign up at https://www.google.com/adsense
 * 2. Get your publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
 * 3. Replace VITE_ADSENSE_CLIENT_ID in .env
 * 4. Add AdSense script to index.html
 */

import React, { useEffect, useRef } from 'react';

const GoogleAd = ({
    slot = "auto",
    format = "auto",
    responsive = true,
    style = {}
}) => {
    const adRef = useRef(null);
    // Hardcoded fallback for your AdSense ID
    const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-8792747031835209';

    useEffect(() => {
        // Only load ads if client ID is configured and not a placeholder
        // Note: AdSense will return 400 Bad Request on localhost - this is normal.
        if (!clientId || clientId === 'YOUR_ADSENSE_CLIENT_ID' || clientId.includes('XXXX')) {
            return;
        }

        try {
            // Push ad to AdSense queue
            if (window.adsbygoogle && adRef.current) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (error) {
            // Silently fail for ads
        }
    }, [clientId]);

    // Show placeholder only if ID is still a generic placeholder string
    const isPlaceholder = !clientId || clientId === 'YOUR_ADSENSE_CLIENT_ID' || clientId.includes('XXXX');

    if (isPlaceholder) {
        return (
            <div className="fade-in glass-panel" style={{
                padding: '16px',
                marginBottom: '20px',
                position: 'relative',
                border: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(0, 0, 0, 0.2)',
                overflow: 'hidden',
                ...style
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
                    Advertisement
                </span>

                {/* Placeholder Content */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    opacity: 0.9
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <span style={{ fontSize: '20px' }}>📢</span>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '2px' }}>
                            Configure AdSense
                        </h4>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                            Add your AdSense ID to .env to enable monetization
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Real AdSense ad (will result in 400 on localhost, which is correct)
    return (
        <div style={{ marginBottom: '20px', minHeight: '100px', ...style }}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: 'block', minHeight: '100px' }}
                data-ad-client={clientId}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive.toString()}
            />
        </div>
    );
};

export default GoogleAd;
