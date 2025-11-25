import React from 'react';

export default function Toast({ alerts }) {
    if (alerts.length === 0) return null;

    return (
        <div className="toast-stack">
            {alerts.map((a, i) => (
                <div key={i} className="toast">
                    <span>{a}</span>
                </div>
            ))}
        </div>
    );
}
