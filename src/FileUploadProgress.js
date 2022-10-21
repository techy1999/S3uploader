import React, { useEffect, useState } from 'react'
import useUploadS3 from './useUploadS3';
import './fileuploadprogress.css';


const FileUpload = ({ file, presigneUrl }) => {
    const { progresspercentage, uploadspeed, uploadtoS3 ,stopUpload} = useUploadS3(0)

    useEffect(() => {
        uploadtoS3(file, presigneUrl)
    }, [])

    useEffect(() => {
        // console.log("progresspercentage in APP.JS ", uploadtoS3.progresspercentage);
    }, [uploadtoS3.progresspercentage])

    function bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    // function abortHandler(){
    //     alert("==== Abort handler clicked ==== ");      
    // }

    return (
        <div className='progress-bar'>
            <div className='file-type-wrapper'>
                <i className="bi bi-file-image"></i>
            </div>
            <div className='file-detail-progress-wrapper'>
                <div className='name-size-cancel-wrapper'>
                    <p>{file.name}  &nbsp; &nbsp;<span>{bytesToSize(file.size)}</span></p>
                    <button id="cancel"  onClick={stopUpload}>
                        <i className="bi bi-x" style={{fontSize:"25px"}}></i>
                    </button>
                </div>
                <br />
                <div className="percent-display-container">
                    <div className="percent-progress-container">
                        <div className="percent-progress" style={{ width: `${progresspercentage}%` }}></div>
                    </div>
                </div>
                <div className='percentage-speed-wrapper'>
                    <p style={{ marginRight: "80px" }}>{progresspercentage === 100 ? `Completed` : `${progresspercentage}% done`}</p>
                    <p>{uploadspeed}KB/sec</p>
                </div>
            </div>
        </div>
    )
}

export default FileUpload