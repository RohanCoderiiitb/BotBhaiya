import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const Delete = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const navigate = useNavigate();   

    const handleDelete = async () => {
        try {
            const res = await fetch('http://localhost:8000/delete-retriever', {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = res.json()
            if (!Response.ok) throw new Error(data.detail || "Something went wrong")
            setStatus({ type: "Success", message: data.message });
        } catch (err) {
            setStatus({ type: "Error", message: err.message });
        } finally {
            setLoading(false);
        }
    }

    const handleCancel = () =>{
        setStatus(null);
        navigate("/admin");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1123] to-[#1e1f2f] px-4">
            <div className="max-w-md w-full bg-[#0f0f0f] p-8 rounded-2xl shadow-2xl">
                <h2 className="text-2xl text-white font-bold mb-4 text-center">Delete Retriever</h2>
                <p className="text-gray-400 mb-6 text-center">
                    This action will remove all indexed data. Proceed only if you're sure.
                </p>

                <div className="flex justify-between space-x-4">
                    <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="w-1/2 py-3 rounded-xl font-semibold bg-gray-700 text-white hover:bg-gray-600 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className={`w-1/2 py-3 rounded-xl font-semibold transition ${loading
                                ? 'bg-gray-600 cursor-not-allowed text-white'
                                : 'bg-gradient-to-r from-red-500 to-red-700 hover:opacity-90 text-white'
                            }`}
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>

                {status && (
                    <div
                        className={`mt-4 text-center text-sm ${status.type === 'success' ? 'text-green-400' : 'text-red-400'
                            }`}
                    >
                        {status.message}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Delete