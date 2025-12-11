import React from 'react';
import '../styles/widget.css';

const Widget = ({ title, children, className = '', fullWidth = false }) => {
    return (
        <div className={`widget glass-panel ${fullWidth ? 'full-width' : ''} ${className}`}>
            {title && <div className="widget-header">
                <h3>{title}</h3>
            </div>}
            <div className="widget-content">
                {children}
            </div>
        </div>
    );
};

export default Widget;
