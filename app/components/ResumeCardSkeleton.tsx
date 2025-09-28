import React from 'react'

const ResumeCardSkeleton = () => {
    return (
        <div className="resume-card">
            <div className="resume-card-header">
                <div className="flex flex-col gap-3 w-full">
                    <div className="skeleton h-8 w-3/4"></div>
                    <div className="skeleton h-8 w-1/4"></div>
                </div>
                <div className="skeleton h-20 w-20 rounded-full flex-shrink-0"></div>
            </div>
            <div className="gradient-border">
                <div className="skeleton w-full h-[350px] max-sm:h-[200px] rounded-lg"></div>
            </div>
        </div>
    )
}
export default ResumeCardSkeleton
