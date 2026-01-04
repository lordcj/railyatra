import React from 'react';
import { X, Users } from 'lucide-react';

const SeatLayout = ({ isOpen, onClose, trainName, trainNumber, runningDays }) => {
    if (!isOpen) return null;

    const Berth = ({ type, label, color = 'rgba(255,255,255,0.1)' }) => (
        <div style={{
            width: '40px',
            height: '40px',
            background: color,
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 600,
            color: 'var(--text-primary)'
        }}>
            <span>{type}</span>
            <span style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>{label}</span>
        </div>
    );

    const LayoutSection = ({ title, description, children }) => (
        <div style={{ marginBottom: '24px' }}>
            <h5 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px', color: 'var(--accent-color)' }}>{title}</h5>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>{description}</p>
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '16px',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                {children}
            </div>
        </div>
    );

    const fullDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const isRunningOnDay = (dayChar, index) => {
        // RailRadar usually returns "M T W T F S S" or similar. 
        // We'll check if the char at the index exists and isn't a space or '-'
        // For now, we'll assume the string contains the running days or S M T W T F S
        if (!runningDays) return true;
        return runningDays.includes(dayChar);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(4px)'
                }}
            />

            {/* Modal */}
            <div className="glass-panel pulse-in" style={{
                position: 'relative',
                width: '100%',
                maxWidth: '450px',
                maxHeight: '85vh',
                overflowY: 'auto',
                padding: '24px',
                zIndex: 1001,
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Seat Layout</h3>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{trainName} (#{trainNumber})</p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>Days Running</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {fullDays.map((day, idx) => {
                            const active = isRunningOnDay(day, idx);
                            return (
                                <div key={idx} style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    background: active ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: active ? '#22c55e' : '#ef4444',
                                    border: `1px solid ${active ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                                }}>
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--text-secondary)' }}>
                        <div style={{ width: '10px', height: '10px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}></div> Lower / Middle
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--text-secondary)' }}>
                        <div style={{ width: '10px', height: '10px', background: 'rgba(45, 212, 191, 0.2)', borderRadius: '2px' }}></div> Upper / Side
                    </div>
                </div>

                <LayoutSection title="Sleeper / 3rd AC (8 Berths/Bay)" description="LB: Lower, MB: Middle, UB: Upper, SL: Side Lower, SU: Side Upper">
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', flex: 1 }}>
                            <Berth type="LB" label="1" />
                            <Berth type="MB" label="2" />
                            <Berth type="UB" label="3" color="rgba(45, 212, 191, 0.2)" />
                            <Berth type="LB" label="4" />
                            <Berth type="MB" label="5" />
                            <Berth type="UB" label="6" color="rgba(45, 212, 191, 0.2)" />
                        </div>
                        <div style={{ width: '2px', background: 'rgba(255,255,255,0.1)' }}></div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '8px' }}>
                            <Berth type="SL" label="7" color="rgba(45, 212, 191, 0.2)" />
                            <Berth type="SU" label="8" color="rgba(45, 212, 191, 0.2)" />
                        </div>
                    </div>
                </LayoutSection>

                <LayoutSection title="2nd AC (6 Berths/Bay)" description="LB: Lower, UB: Upper, SL: Side Lower, SU: Side Upper">
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', flex: 1 }}>
                            <Berth type="LB" label="1" />
                            <Berth type="UB" label="2" color="rgba(45, 212, 191, 0.2)" />
                            <Berth type="LB" label="3" />
                            <Berth type="UB" label="4" color="rgba(45, 212, 191, 0.2)" />
                        </div>
                        <div style={{ width: '2px', background: 'rgba(255,255,255,0.1)' }}></div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '8px' }}>
                            <Berth type="SL" label="5" color="rgba(45, 212, 191, 0.2)" />
                            <Berth type="SU" label="6" color="rgba(45, 212, 191, 0.2)" />
                        </div>
                    </div>
                </LayoutSection>

                <LayoutSection title="CC / 2S (Seating)" description="W: Window, M: Middle, A: Aisle seat">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <Berth type="W" label="A1" color="rgba(56, 189, 248, 0.1)" />
                                <Berth type="M" label="A2" />
                                <Berth type="A" label="A3" />
                            </div>
                            <div style={{ width: '12px', height: '2px', background: 'rgba(255,255,255,0.1)' }}></div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <Berth type="A" label="A4" />
                                <Berth type="W" label="A5" color="rgba(56, 189, 248, 0.1)" />
                            </div>
                        </div>
                    </div>
                </LayoutSection>

                <div style={{
                    marginTop: '8px',
                    padding: '12px',
                    background: 'rgba(var(--accent-rgb), 0.05)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <Users size={16} color="var(--accent-color)" />
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Note: Actual layout may vary by coach type and variant.</span>
                </div>
            </div>
        </div>
    );
};

export default SeatLayout;
