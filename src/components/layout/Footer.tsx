import Link from 'next/link';

export function Footer() {
    return (
        <footer
            style={{
                padding: '20px',
                textAlign: 'center',
                opacity: 0.5,
                fontSize: '12px',
            }}
        >
            <Link
                href="/privacy"
                style={{ color: 'white', textDecoration: 'none', margin: '0 10px' }}
            >
                Privacy Policy
            </Link>
            <span style={{ margin: '0 10px' }}>•</span>
            <span>&copy; {new Date().getFullYear()} RailYatra</span>
        </footer>
    );
}
