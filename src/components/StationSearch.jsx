import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { majorStations } from '../data/stations';

const StationSearch = ({ label, placeholder, value, onChange, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedStation, setSelectedStation] = useState(null);
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    // Initialize state from props
    useEffect(() => {
        if (value) {
            // Check if value matches a code or name
            const found = majorStations.find(s => s.code === value || s.name === value);
            if (found) {
                setSearch(`${found.name} (${found.code})`);
                setSelectedStation(found);
            } else {
                setSearch(value);
            }
        }
    }, []); // Only run on mount to set initial value

    // Handle clicking outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                // If input doesn't match a station, keep the raw text but it might be invalid
                // Ideally we'd reset to the last valid station, but for flexible search we allow raw text
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInput = (e) => {
        setSearch(e.target.value);
        setIsOpen(true);
        // Also propagate raw change to parent in case they type a valid code directly
        if (onChange) onChange(e.target.value);
    };

    const handleSelect = (station) => {
        setSearch(`${station.name} (${station.code})`);
        setSelectedStation(station);
        setIsOpen(false);
        if (onChange) onChange(station.code);
    };

    const clearSearch = () => {
        setSearch('');
        setSelectedStation(null);
        if (onChange) onChange('');
        inputRef.current?.focus();
    };

    const filteredStations = majorStations.filter(station =>
        station.name.toLowerCase().includes(search.toLowerCase()) ||
        station.code.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 8); // Limit to top 8 matches

    return (
        <div className="station-search-wrapper" ref={wrapperRef} style={{ position: 'relative', flex: 1 }}>
            <div className="input-group" style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s ease'
            }}>
                {Icon && <Icon className="input-icon" size={20} style={{ color: 'var(--accent-color)' }} />}

                <div style={{ flex: 1, position: 'relative' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        {label}
                    </label>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={placeholder}
                        value={search}
                        onChange={handleInput}
                        onFocus={() => setIsOpen(true)}
                        style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: 500,
                            outline: 'none',
                            padding: 0
                        }}
                    />
                </div>

                {search && (
                    <button
                        onClick={clearSearch}
                        type="button" // Prevent form submission
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                            display: 'flex',
                            padding: 4
                        }}
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && search.length > 0 && filteredStations.length > 0 && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '8px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    zIndex: 2000,
                    padding: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    background: '#1a1a1b', // Solid opaque color
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    {filteredStations.map((station) => (
                        <div
                            key={station.code}
                            onClick={() => handleSelect(station)}
                            style={{
                                padding: '12px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                transition: 'background 0.2s',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                color: 'var(--text-primary)'
                            }}
                            className="dropdown-item"
                            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    width: '32px', height: '32px',
                                    borderRadius: '50%',
                                    background: 'rgba(56, 189, 248, 0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--accent-color)'
                                }}>
                                    <MapPin size={14} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 500 }}>{station.name}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                        Indian Railways
                                    </div>
                                </div>
                            </div>
                            <span style={{
                                background: 'rgba(255,255,255,0.1)',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: 600,
                                fontFamily: 'monospace',
                                color: 'var(--accent-color)'
                            }}>
                                {station.code}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StationSearch;
