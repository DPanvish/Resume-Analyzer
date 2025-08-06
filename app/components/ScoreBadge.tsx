// We Generate the logic for the badge using the AI as it is simple

import React from 'react'

// A type is defined to store the score
interface ScoreBadgeProps{
    score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({score}) => {
    let badgeColor = "";
    let badgeText = "";

    if(score > 70){
        badgeColor = "bg-badge-green text-green-600";
        badgeText = "Strong";
    }else if(score > 49){
        badgeColor = "bg-badge-yellow text-yellow-600";
        badgeText = "Good Start";
    }else{
        badgeColor = "bg-badge-red text-red-600";
        badgeText = "Needs Work";
    }
    return (
        <div className={`mx-2 px-3 py-1 rounded-full ${badgeColor}`}>
            <p className="text-sm font-medium">{badgeText}</p>
        </div>
    )
}
export default ScoreBadge
