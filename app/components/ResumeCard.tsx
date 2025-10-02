import React, {useEffect, useState} from 'react'
import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import {usePuterStore} from "~/lib/puter";

const ResumeCard = ({resume :{id, companyName, jobTitle, feedback, imagePath}, onClick, ...props} : {resume: Resume, onClick?: (e: React.MouseEvent) => void, [key: string]: any}) => {
    const {fs} = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');

    // Trying to get the resumes which were previously uploaded by someone to display
    useEffect(() => {
        const loadResume = async() => {
            const blob = await fs.read(imagePath);

            if(!blob){
                return;
            }

            let url = URL.createObjectURL(blob);
            setResumeUrl(url);
        }

        if(imagePath){
            loadResume();
        }

        return () => {
            if(resumeUrl){
                URL.revokeObjectURL(resumeUrl);
            }
        }
    }, [imagePath]);

    return (
        // <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
        <div onClick={onClick} className="resume-card animate-in fade-in duration-1000" {...props}>
            <div className="resume-card-header">
                <div className="flex flex-col gap-2">
                    {/*If company name exists*/}
                    {companyName && <h2 className="!text-white font-bold break-words">
                        {companyName}
                    </h2>}

                    {/*Id job title exists*/}
                    {jobTitle && <h3 className="text-lg break-words text-gray-500">
                        {jobTitle}
                    </h3>}

                    {/*If company name & job title doesn't exist*/}
                    {!companyName && !jobTitle && <h2 className="!text-black font-bold">Resume</h2>}
                </div>

                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback.overallScore}/>
                </div>
            </div>

            {/*If resume url exists*/}
            {resumeUrl && (<div className="gradient-border animate-in fade-in duration-1000">
                <div className="w-full h-full">
                    <img
                        src={resumeUrl}
                        alt="resume"
                        className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
                    />
                </div>
            </div>)}
        </div>
        //</Link>
    )
}
export default ResumeCard
