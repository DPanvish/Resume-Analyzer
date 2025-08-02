import  {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";

const Upload = () => {

    // To check whether the upload is processing or not
    const [isProcessing, setIsProcessing] = useState(false);

    // This to display the processing status text
    const [statusText, setStatusText] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {

    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />
            <section className="main-section">
                <div className="page-heading">
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
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                            </div>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload
