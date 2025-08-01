import React, { useState, useRef } from 'react';

const IndexDocuments = () => {
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files).filter((file) =>
            file.name.endsWith('.pdf') || file.name.endsWith('.md') || file.name.endsWith('.doc') || file.name.endsWith('.docx') || file.name.endsWith('.ppt') || file.name.endsWith('.pptx') || file.name.endsWith('.txt')
        );
        setFiles((prev) => [...prev, ...selectedFiles]);
        setStatus(null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
            file.name.endsWith('.pdf') || file.name.endsWith('.md') || file.name.endsWith('.doc') || file.name.endsWith('.docx') || file.name.endsWith('.ppt') || file.name.endsWith('.pptx') || file.name.endsWith('.txt')
        );
        setFiles((prev) => [...prev, ...droppedFiles]);
        setStatus(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleUndo = () => {
        setFiles([]);
        setStatus(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    const handleUploadAndIndex = async () => {
        if (files.length === 0) {
            setStatus({ type: 'error', message: 'Please upload at least one file.' });
            return;
        }

        const confirm = window.confirm(`Are you sure you want to upload and index ${files.length} file(s)?`);
        if (!confirm) return;

        setLoading(true);
        setStatus(null);

        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));

        try {
            const uploadRes = await fetch('http://localhost:8000/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });

            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) throw new Error(uploadData.detail || 'Upload failed');

            const filePaths = files.map((file) => `./app/Data/${file.name}`);

            const indexRes = await fetch('http://localhost:8000/indexing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ urls: filePaths }),
            });

            const indexData = await indexRes.json();
            if (!indexRes.ok) throw new Error(indexData.detail || 'Indexing failed');

            setStatus({ type: 'success', message: indexData.message });
            setFiles([]);
            if (inputRef.current) inputRef.current.value = '';
        } catch (err) {
            setStatus({ type: 'error', message: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1123] to-[#1e1f2f] px-4">
            <div className="max-w-lg w-full bg-[#0f0f0f] p-8 rounded-2xl shadow-2xl">
                <h2 className="text-2xl font-bold text-white text-center mb-4">Upload & Index Documents</h2>
                <p className="text-gray-400 text-center mb-6">Drag & drop, or choose files to index.</p>

                {/* Drag & Drop Zone */}
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="w-full p-6 mb-4 rounded-xl border-2 border-dashed border-gray-600 text-gray-400 text-center cursor-pointer hover:border-blue-500 transition"
                >
                    Drag and drop files here
                </div>

                {/* Manual File Input */}
                <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf,.md,.doc,.docx,.ppt,.pptx,.txt"
                    multiple
                    onChange={handleFileChange}
                    className="w-full mb-4 bg-[#1a1a1a] border border-gray-600 rounded-xl px-4 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />

                {/* Preview Selected Files */}
                {files.length > 0 && (
                    <div className="bg-[#1e1e1e] text-gray-300 p-4 rounded-xl mb-4 max-h-48 overflow-y-auto text-sm">
                        <p className="text-blue-400 mb-2">Files selected:</p>
                        <ul className="list-disc list-inside space-y-1">
                            {files.map((file, index) => (
                                <li key={index}>{file.name}</li>
                            ))}
                        </ul>

                        {/* Undo and Clear Buttons */}
                        <div className="mt-4 flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    if (files.length > 0) setFiles((prev) => prev.slice(0, -1));
                                }}
                                className="text-yellow-400 hover:underline text-sm"
                            >
                                Undo Last
                            </button>
                            <button
                                onClick={() => {
                                    setFiles([]);
                                    setStatus(null);
                                    if (inputRef.current) inputRef.current.value = '';
                                }}
                                className="text-red-400 hover:underline text-sm"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                )}


                {/* Upload Button */}
                <button
                    onClick={handleUploadAndIndex}
                    disabled={loading}
                    className={`w-full py-3 rounded-xl font-semibold transition ${loading
                            ? 'bg-gray-600 cursor-not-allowed text-white'
                            : 'bg-gradient-to-r from-blue-500 to-blue-700 hover:opacity-90 text-white'
                        }`}
                >
                    {loading ? 'Uploading & Indexing...' : 'Upload & Index'}
                </button>

                {/* Toast Status */}
                {status && (
                    <div
                        className={`mt-6 text-center py-2 px-4 rounded-xl ${status.type === 'success' ? 'bg-green-800 text-green-300' : 'bg-red-800 text-red-300'
                            } transition`}
                    >
                        {status.message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default IndexDocuments;