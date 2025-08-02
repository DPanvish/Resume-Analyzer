import React, {useState} from 'react'

// All the drag and drop upload logic is created by someone
// Now you can directly install it by "npm install react-dropzone"
// Try to see the docs related to npm dropzone
// Everything is present in the docs
// https://www.npmjs.com/package/dropzone
import {useCallback} from "react";
import {useDropzone} from "react-dropzone";


const FileUploader = () => {

    const [file, setFile] = useState();

    // The below both consts were directly copied from dropzone docs (onDrop should be implemented)
    const onDrop = useCallback(acceptedFiles => {
        // This was implemented by self
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    return (
        <div className="w-full gradient-border">
            {/*The below whole thing was availabe in the npm dragzone docs just paste it here*/}
            {/*<div {...getRootProps()}>*/}
            {/*    <input {...getInputProps()} />*/}
            {/*    {*/}
            {/*        isDragActive ?*/}
            {/*            <p>Drop files here ...</p> :*/}
            {/*            <p>Drag 'n' drop some files here, or click to select files</p>*/}
            {/*    }*/}
            {/*</div>*/}

            {/*I have changed a bit from the original so I have commented the original script*/}

            <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div className="space-y-4 cursor-pointer">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center">
                        <img src="/icons/info.svg" alt="upload" className="size-20"/>
                    </div>


                    {file ? (
                        // If file is uploaded
                        <div></div>
                    ) : (

                        // If file is not uploaded
                        <div>
                            <p className="text-lg text-grap-500">
                                <span className="font-semibold">
                                    Click to upload Resume
                                </span> or drag and drop
                            </p>
                            <p class="text-lg text-gray-500">PDF (max 20 MB)</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default FileUploader
