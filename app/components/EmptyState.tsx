import React from 'react'

const EmptyState = ({icon, message, cta, className = ""} : EmptyStateProps) => {
    return (
        <div className={`empty-state $className`}>
            {/* The icon or illustration for the empty state */}
            {icon && <div className="empty-state-icon z-10">{icon}</div>}

            {/* The main message */}
            <div className="empty-state-message z-10">{message}</div>

            {/* The call-to-action button or link */}
            {cta && <div className="empty-state-cta z-10">{cta}</div>}
        </div>
    )
}
export default EmptyState
