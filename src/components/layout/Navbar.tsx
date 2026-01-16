'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, AlertCircle, Train, Radio } from 'lucide-react';

const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/pnr', icon: AlertCircle, label: 'PNR' },
    { href: '/live', icon: Radio, label: 'Live' },
    { href: '/search-train', icon: Search, label: 'Search' },
    { href: '/trains', icon: Train, label: 'Trains' },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <nav
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: '8px 0 20px',
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                zIndex: 100,
            }}
        >
            {navItems.map(({ href, icon: Icon, label }) => {
                const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

                return (
                    <Link
                        key={href}
                        href={href}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '8px 16px',
                            color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)',
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                        }}
                    >
                        <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                        <span style={{ fontSize: '10px', fontWeight: isActive ? 600 : 400 }}>
                            {label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
