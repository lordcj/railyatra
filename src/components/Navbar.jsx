import React from 'react';
import { Home, Search, Ticket, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const NavItem = ({ to, icon: Icon, label, active }) => {
    return (
        <Link to={to} style={{ textDecoration: 'none', flex: 1 }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                height: '100%',
                color: active ? 'var(--accent-color)' : 'var(--text-secondary)',
                transition: 'all 0.3s ease',
                position: 'relative'
            }}>


                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                    <span style={{
                        fontSize: '11px',
                        fontWeight: active ? 600 : 500,
                        opacity: active ? 1 : 0.8
                    }}>{label}</span>
                </div>
            </div>
        </Link>
    );
};

const Navbar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '80px', // Taller for modern feel + safe area
            paddingBottom: '16px', // Safe area padding
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'flex-start',
            paddingTop: '12px',
            zIndex: 100,
            backgroundColor: 'rgba(15, 23, 42, 0.98)', // Nearly opaque
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.2)'
        }}>
            <NavItem to="/" icon={Home} label="Home" active={currentPath === '/'} />
            <NavItem to="/search-train" icon={Search} label="Trains" active={currentPath === '/search-train'} />
            <NavItem to="/pnr" icon={Ticket} label="PNR" active={currentPath === '/pnr'} />

        </nav>
    );
};

export default Navbar;
