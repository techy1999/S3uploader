import { useState, useRef } from 'react'


//Custom HOOKs
const useUploadS3 = () => {
    const [progresspercentage, setProgresspercentage] = useState(0);
    const [uploadspeed, setUploadspeed] = useState(0)

    const progressRef = useRef(0)
    const xhr = useRef(new XMLHttpRequest())

    function bytesToSize(bytes) {
        if (bytes === 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2)
    }

    function stopUpload() {
        console.log("stopUpload calling...", xhr.current);
        xhr.current.abort();
        // console.log("Aborting in hooks ... ");
    }

    function uploadtoS3(file, presigneUrl) {
        let startTime = 1;
        xhr.current.onreadystatechange = function () {
            if (xhr.current.readyState === 4) {
                if (xhr.current.status === 200) {
                    // setUploadStatus(true);
                    console.log("UPLOAD SUCCESSFUL ==> ", file);
                }
                else {
                    setProgresspercentage(0)
                    console.log("UPLOAD FAILED/STOP UPLOADING");
                }
            }
        };
        xhr.current.upload.onprogress = function (ev) {
            if (startTime === 0) {
                startTime = ev.timeStamp;
            }
            if (ev.lengthComputable) {
                var percentComplete = Math.round((ev.loaded / ev.total) * 100);
                setProgresspercentage(percentComplete)
                setUploadspeed(((bytesToSize(ev.loaded / ev.total) * 3600) / (ev.timeStamp - startTime)).toFixed(0))
                progressRef.current = percentComplete

                // console.log("--------------------")
                // console.log("Speed of download : " , (bytesToSize(ev.loaded / ev.total)*3600 ) /(ev.timeStamp-startTime).toFixed(0)  )
                // console.log("--------------------")
                //console.log("percentComplete", progresspercentage, progressRef);
            }
        };

        xhr.current.open("PUT", presigneUrl);
        xhr.current.send(file);
        // xhr.abort(); //ADD THIS LINE TO STOP UPLOADING TAKE A PROPS FROM APP.JS FOR THE STATUS AND CHECK WHETHER IT IS TRUE OR NOTE...
    }
    xhr.current.onabort = function () {
        console.log('Aborting in hooks ...');
    }

    return { progresspercentage, uploadspeed, uploadtoS3, stopUpload };

}

export default useUploadS3