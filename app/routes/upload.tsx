import React, {useState} from 'react'
import Navbar from "~/components/Navbar";

const Upload = () => {

    // To check whether the upload is processing or not
    const [isProcessing, setIsProcessing] = useState(false);

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />
            <section className="main-section">
                <div className="page-heading">
                    <h1>Smart feedback for your dream job</h1>
                </div>
            </section>
        </main>
    )
}
export default Upload
