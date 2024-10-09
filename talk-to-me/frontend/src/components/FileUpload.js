import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [detailedError, setDetailedError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
      setError(`File is too large. Maximum size is 25 MB. Your file is ${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB.`);
      setFile(null);
    } else {
      setError('');
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('audio', file);

    try {
      setError('');
      setDetailedError('');
      setTranscript('');
      console.log('Sending file:', file);
      const response = await axios.post('http://localhost:3001/api/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data);
      setTranscript(response.data.transcript);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.error || 'An error occurred during upload');
      setDetailedError(JSON.stringify(error.response?.data, null, 2));
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
      <div className="flex space-x-4">
        <input
          type="file"
          onChange={handleFileChange}
          accept="audio/*,video/mp4"
          className="flex-1"
        />
        <button type="submit">Upload and Transcribe</button>
        </div>
      </form>
      {error && (
        <div style={{ color: 'red' }}>
          <p>{error}</p>
          {detailedError && (
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {detailedError}
            </pre>
          )}
        </div>
      )}
      {transcript && <p>Transcript: {transcript}</p>}
    </div>
  );
};

export default FileUpload;