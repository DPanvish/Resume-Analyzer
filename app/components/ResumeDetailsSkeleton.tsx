import React from 'react'

const ResumeDetailsSkeleton = () => {
    return (
        <div className="resume-container">
            {/* Left Side: Feedback Section Skeleton */}
            <div className="feedback-section">
                <div className="flex flex-col gap-8">
                    {/* Overall Score Skeleton */}
                    <div className="flex items-center gap-4">
                        <div className="skeleton h-24 rounded-full"></div>
                        <div className="flex flex-col gap-2 w-full">
                            <div className="skeleton h-8 w-1/2"></div>
                            <div className="skeleton h-6 w-3/4"></div>
                        </div>
                    </div>
                    {/* Feedback Items Skeleton */}
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex flex-col gap-3">
                            <div className="skeleton h-6 w-1/3"></div>
                            <div className="skeleton h-5 w-full"></div>
                            <div className="skeleton h-5 w-5/6"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side: Resume Preview Skeleton */}
            <div className="w-1/2 max-lg:w-full p-8">
                <div className="skeleton w-full h-[80vh] rounded-lg"></div>
            </div>
        </div>
    )
}
export default ResumeDetailsSkeleton
