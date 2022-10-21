import React, { useState,useEffect } from 'react';
import './App.css';
import FileUploadProgress from './FileUploadProgress';

const API = "https://ecy15hkmnl.execute-api.ap-south-1.amazonaws.com/dev/my_S3bucket_uploader_func"

function App() {
  const [onfile, setFiles] = useState([])

  // --- CREEATING PRESINGED URL AND  setting the file in ONFILE
  // --- PRESINGED URL GENERATED FOR DIFFERENET FILE TO UPLOAD TO S3..
  function presignedUrlGenerator(file) {
    fetch(API, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({ key: "testing" }),
    })
      .then((res) => res.json())
      .then((res) => {
        onfile.push({ file: file, url: res.url })
        setFiles([...onfile])
        // uploadtoS3(file,res.url) //passing Presigned URL and file to upload...
      })
      .catch((err) => console.log(err))
  }

  //----- SINGLE FILE UPLOADER USING CHOOSE FILE TO UPLOAD  ---- /
  function uploadSingleFile(e) {
    presignedUrlGenerator(e.target.files[0]);
  }

  //----- MULTIPLE FILE UPLOADER USING DRAG AND DROP TO UPLOAD ----// 
  const dropHandler = (dropev) => {
    dropev.preventDefault();
    // console.log("E.dataTransfer.items", dropev.dataTransfer.items);
    if (dropev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < (dropev.dataTransfer.items.length > 3 ? "3" : `${dropev.dataTransfer.items.length}`); i++) {
        // If dropped items aren't files, reject them
        if (dropev.dataTransfer.items[i].kind === 'file') {
          const file = dropev.dataTransfer.items[i].getAsFile();
          presignedUrlGenerator(file);
        }
      }
    }
  }

  const dragOverHandler = (dropev) => {
    dropev.preventDefault();
  }

  return (
    <div className='main'>
      <div className='title'>
        <h1>File Uploader</h1>
      </div>
      <div className='divider'></div>

      <div className='uploader-progress-wrapper'>

        <div className='drag-area-wrapper'>
          <div className='drag-area' onDrop={dropHandler} onDragOver={dragOverHandler}>
            <div className="icon"><i className="bi bi-arrow-up-square"></i></div>
            <header>Drag files to upload</header>
          </div>
          <div className='choose-btn'>
            <input type="file" name="file" id="file" onChange={uploadSingleFile} />
            <label htmlFor="file">Choose a file</label>
          </div>
        </div>

        <div className='progress-wrapper'>
          <h3>Uploading</h3>
          {onfile.map((singleFile, i) => {
            return (<><FileUploadProgress key={i} file={singleFile.file} presigneUrl={singleFile.url} /> <hr /></>)
          })
          }
        </div>
      </div>
    </div>

  );
}

export default App;
