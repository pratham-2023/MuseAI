import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            style={{
                position: 'fixed',
                top: '24px',
                right: '24px',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 1000,
                transition: 'all 0.3s ease',
                boxShadow: 'var(--shadow-md)',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.borderColor = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = 'var(--glass-border)';
            }}
            aria-label="Toggle theme"
        >
            <div
                style={{
                    animation: 'rotate 0.5s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                key={theme}
            >
                {theme === 'dark' ? (
                    <Sun size={22} color="var(--accent)" />
                ) : (
                    <Moon size={22} color="var(--accent)" />
                )}
            </div>
        </button>
    );
};

export default ThemeToggle;
