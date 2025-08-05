import React, {useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from "react-router";
import {usePuterStore} from "~/lib/puter";


export const meta = () => ([
    {title: 'Resumind | Review'},
    {name: 'decription', content: 'Detailed overview of your resume'},
])

const Resume = () => {

    // Destructuring the puterstore (fs -> file storage, ai -> artificial intelligence, kv -> key value)
    const {auth, isLoading, fs, kv} = usePuterStore();

    // destructure the parameter of id in the url
    const {id} = useParams();

    // These are the states for the data, urls
    const [imageUrl, setImageUrl] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");
    const [feedback, setFeedback] = useState("");

    const navigate = useNavigate();

    // checking the authentication
    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated){
            navigate(`/auth?next=/resume/${id}`);
        }
    }, [isLoading]);

    useEffect(() => {
        const loadResume = async() =>{

            // getting resume from key value storage
            // while uploading the resume in upload.tsx file we added the resume to key value storage
            const resume = await kv.get(`resume:${id}`);

            // If resume not found
            if(!resume){
                return;
            }

            // The data in key value is JSON so it is parsed ad stored in data variable
            const data = JSON.parse(resume);

            // files from puterstore are returned as blobs
            // so first store the resumePath blob in resumeBlob
            const resumeBlob = await fs.read(data.resumePath);

            // If resume blob does not exist
            if(!resumeBlob){
                return;
            }

            // creating pdfBlob from the resumeBlob of type pdf
            const pdfBlob = new Blob([resumeBlob], {type: 'application/pdf'});

            // extracting resumeUrl from the pdfBlob
            const resumeUrl = URL.createObjectURL(pdfBlob);
            // setting its state to current resumeUrl
            setResumeUrl(resumeUrl);

            // store the imagePath blob in the imageBlob
            const imageBlob = await fs.read(data.imagePath);

            // if imageBlob does not exist
            if(!imageBlob){
                return;
            }

            // extracting imageUrl from imageBlob
            const imageUrl = URL.createObjectURL(imageBlob);
            // set its state to current imageUrl
            setImageUrl(imageUrl);

            // set the feedback
            setFeedback(data.feedback);

            console.log({resumeUrl, imageUrl, feedback});
        }

        // calling loadresume method
        loadResume();
    }, [id])

    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5"/>
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>

            {/*flex-direction is set to column reverse as while collapsing to small devices the right side
            resume review section should move to top*/}
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">

                    {/*if imageUrl and resumeUrl exist then we display the components*/}
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    className="w-full h-full object-contain rounded-2xl"
                                    title="resume"
                                />
                            </a>
                        </div>
                    )}
                </section>

                <section className="feedback-section">
                    <h2 className="text-4xl !text-black font-bold">Resume Review</h2>

                    {feedback ? (

                        // If feedback exist the this block will be displayed
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            Summary ATS Details
                        </div>
                    ) : (

                        // If feedback does not exist then this block is displayed
                        <img src="/images/resume-scan-2.gif" className="w-full"/>
                    )}
                </section>
            </div>
        </main>
    )
}
export default Resume
