'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
    const pathname = usePathname();
    const isHome = pathname === '/';

    return (
        <header
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
            }}
        >
            <Link
                href="/"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    textDecoration: 'none',
                }}
            >
                <img
                    src="/logo_small.png"
                    alt="RailYatra"
                    width={28}
                    height={28}
                    style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        objectFit: 'cover',
                    }}
                />
                <span
                    style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        letterSpacing: '-0.01em',
                        background: 'linear-gradient(135deg, #2dd4bf 0%, #38bdf8 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    RailYatra
                </span>
            </Link>
        </header>
    );
}
