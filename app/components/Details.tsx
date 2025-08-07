// Coded using an ai agent

import React from 'react'
import {cn} from "~/lib/utils"
import {Accordion, AccordionContent, AccordionHeader, AccordionItem} from "./Accordion";

const ScoreBadge = ({score}: {score: number}) => {
    return (
        <div className={cn(
            "flext flex-row gap-1 px-2 py-0.5 rounded-[96px]",
            score > 69 ? "bg-badge-green"
                : score > 49 ? "bg-badge-yellow"
                    : "bg-badge-red"
        )}>
            <img
                src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
                alt="score"
                className="size-4"
            />
            <p className={cn(
                "text-sm font-medium",
                score > 69 ? "text-badge-green-text"
                    : score > 49 ? "text-badge-yellow-text"
                        : "text-badge-red-text"
            )}>
                {score}/100
            </p>
        </div>
    );
}


const Details = () => {
    return (
        <div>Details</div>
    )
}
export default Details
