import  {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";

export const meta = () => ([
    {title: 'Resumind | Upload'},
    {name: 'decription', content: 'Upload the resume'},
])

const Upload = () => {

    // Destructuring the puterstore (fs -> file storage, ai -> artificial intelligence, kv -> key value)
    const {auth, isLoading, fs, ai, kv} = usePuterStore();

    const navigate = useNavigate();

    // To check whether the upload is processing or not
    const [isProcessing, setIsProcessing] = useState(false);

    // This to display the processing status text
    const [statusText, setStatusText] = useState('');

    // This is to store the uploaded file
    const [file, setFile] = useState<File | null>(null);

    // This will handle the uploaded file and set its state
    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        setIsProcessing(true);

        setStatusText('Uploading the file...');

        // Uploading the file to the puter file storage
        const uploadedFile = await fs.upload([file]);

        // Checking whether uploaded file exists or not
        if(!uploadedFile){
            return setStatusText('Error: Failed to upload file');
        }

        // Converting the pdf to image

        setStatusText('Converting to image...');

        // convertPdfToImage login is implemented in pdf2img.ts file
        const imageFile = await convertPdfToImage(file);

        // checking whether image exists or not
        if(!imageFile.file){
            return setStatusText('Error: Failed to convert PDF to image');
        }

        setStatusText('Uploading the image...');

        // Uploading the image to the puter file storage
        const uploadedImage = await fs.upload([imageFile.file]);

        // checking whether uploadingImage exists or not
        if(!uploadedImage){
            return setStatusText('Error: Failed to upload image');
        }

        setStatusText('Preparing data...');

        // generate unique id, the generateUUID function is in utils.tsx
        const uuid = generateUUID();

        // Stores the data of the file
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName,
            jobTitle,
            jobDescription,
            feedback: '',
        }


        // add the uuid and data object (converted to JSON) to the key value storage
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing...');

        // We are generate feedback by ai
        // prepareInstructions funtion is in index.ts (Only instructions and AIresponse is stored in it)
        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({ jobTitle, jobDescription })
        )

        // if we don't get any feedback
        if (!feedback) return setStatusText('Error: Failed to analyze resume');

        // extract the feedback
        // if feedback is string ->  feedback.message.content
        // if feedback is array -> feedback.message.content[0].text
        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

        // add feedback to the data object
        data.feedback = JSON.parse(feedbackText);

        // update the data object as we added feedback
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analysis complete, redirecting...');

        console.log(data);

        // After resume is successfully uploaded then we will navigate to resume page
        // with the unique id of the resume
        navigate(`/resume/${uuid}`);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Store the form elements
        const form = e.currentTarget.closest('form');

        // if form is empty then return
        if(!form){
            return;
        }

        // Store the form data => companyName, jobTitle, jobDescription
        const formData = new FormData(form);
        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file){
            return;
        }

        handleAnalyze({companyName, jobTitle, jobDescription, file});
    }

    return (
        <main>
            <Navbar />
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ) : (
                        <h2>Drop Your resume for an ATS score and improvements tips</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>


                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Decription" id="job-description" />
                            </div>


                            <div className="form-div z-10">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button type="submit" className="primary-button z-10">Analyze Resume</button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload


