import React, {useState} from 'react'

// All the drag and drop upload logic is created by someone
// Now you can directly install it by "npm install react-dropzone"
// Try to see the docs related to npm dropzone
// Everything is present in the docs
// https://www.npmjs.com/package/dropzone
import {useCallback} from "react";
import {useDropzone} from "react-dropzone";
import {formatSize} from "~/lib/utils";

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({onFileSelect}: FileUploaderProps) => {

    // Here acceptedFiles is the file that is uploaded and details are stored in array format

    // The below both consts were directly copied from dropzone docs (onDrop should be implemented)
    const onDrop = useCallback((acceptedFiles: File[]) => {
        // This was implemented by self
        const file = acceptedFiles[0] || null;

        // We add ?. incase we forget to pass the onFileSelect function
        onFileSelect?.(file)
    }, [onFileSelect])

    // multiple is set to false sa that user cannot upload more than one file
    // accept is the type of file that can be uploaded
    // maxSize is the maximum size of the file to be uploaded
    const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
        onDrop,
        multiple: false,
        accept: {'application/pdf': ['.pdf']},
        maxSize: 20 * 1024 * 1024,
    });

    const file = acceptedFiles[0] || null;

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

                    {file ? (
                        // If a file is uploaded
                        // Here stop propagation is to stop ccontinuously upload a file even already file is uploaded
                        <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}>
                                <img src="/images/pdf.png" alt="pdf" className="size-10"/>
                            <div className="flex items-center space-x-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                                        {file.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {/*This formatSize is implemented in the utils.ts which is a mathematical function*/}
                                        {formatSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            <button className="p-2 cursor-pointer" onClick={(e) => {
                                // clicking on cross mark will remove the file by setting onFileSelect to null
                                onFileSelect?.(null);
                            }}>
                                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (

                        // If a file is not uploaded
                        <div>
                            {/*This below img block is displayed when no file is uploaded*/}
                            <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                                <img src="/icons/info.svg" alt="upload" className="size-20"/>
                            </div>
                            <p className="text-lg text-grap-500">
                                <span className="font-semibold">
                                    Click to upload Resume
                                </span> or drag and drop
                            </p>
                            <p className="text-lg text-gray-500">PDF (max 20 MB)</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default FileUploader
