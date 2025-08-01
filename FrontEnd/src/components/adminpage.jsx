import React from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const options = [
    {
      label: 'Index Documents',
      id: 'index-documents',
      action: () => navigate("/index-docs")
    },
    {
      label: 'Delete Retriever',
      id: 'delete-retriever',
      action: () => navigate("/delete-retriever")
    },
    {
      label: 'View Chat History',
      id: 'chat-history',
      action: () => navigate("/view-history")
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1123] to-[#1e1f2f] px-4">
      <div className="w-full max-w-md p-8 bg-[#0f0f0f] rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-2">BotBhaiya Admin</h2>
        <p className="text-gray-400 text-center mb-8">Manage your RAG chatbot tasks</p>

        <div className="space-y-4">
          {options.map((opt, idx) => (
            <button
              key={idx}
              id={opt.id}
              onClick={opt.action}
              className="w-full py-3 rounded-xl text-white font-medium bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:opacity-90 transition"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;