import React from 'react';

const SectionHeader = ({eyebrow, title, description, className = ''} : SectionHeaderProps) => {
    return(
        <div className={`section-header ${className}`}>
            {/* Eyebrow text appears above the title */}
            {eyebrow && <p className="section-header-eyebrow">{eyebrow}</p>}

            {/* The main title, which can be a string or a complex element like a gradient text */}
            {typeof title === "string" ? (
                <h1>title</h1>
            ) : (
                title
            )}

            {/* The description text, which can be a string or a complex element like a gradient text */}
            {description && <p className="section-header-description">{description}</p>}
        </div>
    )
}