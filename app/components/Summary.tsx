import React from 'react'
import ScoreGuage from "~/components/ScoreGuage";

// Component for different categories
const Category = ({title, score} : {title: string, score: number}) =>{

    // To display different colors of the text for different scores
    const textColor = score > 70 ? 'text-green-600'
        : score > 49 ? 'text-yellow-600'
            : 'text-red-600';

    return (
        <div className="resume-summary">
            <div className="category">
                <div className="flex flex-row items-center justify-center">
                    <p className="text-2xl">{title}</p>
                </div>

                <p className="text-2xl">
                    <span className={textColor}>{score}</span> / 100
                </p>
            </div>
        </div>
    )
}

const Summary = ({feedback} : {feedback: Feedback}) => {
    return (
        <div className="bg-white rounded-2xl shadow-md w-full">
            <div className="flex flex-row items-center p-4 gap-8">

                {/*We will pass the overall ATS score to the ScoreGuage as props*/}
                <ScoreGuage score={feedback.overallScore}/>

                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold">Your Resume Score</h2>
                    <p className="text-sm text-gray-500">This score is calculated based on the variables listed below.</p>
                </div>
            </div>

            {/*To display the different categories score*/}

            {/*The feedback.toneAndStyle.score are passed as props to the Category Component to display the score of tone & style*/}
            <Category title={"Tone & Style"} score={feedback.toneAndStyle.score} />


            {/*The feedback.content.score are passed as props to the Category Component to display the score of content*/}
            <Category title={"Content"} score={feedback.content.score} />

            {/*The feedback.structure.score are passed as props to the Category Component to display the score of structure*/}
            <Category title={"Structure"} score={feedback.structure.score} />

            {/*The feedback.skills.score are passed as props to the Category Component to display the score of skills*/}
            <Category title={"Skills"} score={feedback.skills.score} />
        </div>
    )
}
export default Summary
