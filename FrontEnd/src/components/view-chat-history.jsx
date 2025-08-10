import React, { useEffect, useState } from 'react';

const View = () => {
  const [history, setHistory] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);
  const [expandedSession, setExpandedSession] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('http://localhost:8000/admin/chat_history', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Failed to fetch');
        setHistory(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchHistory();
  }, []);

  const grouped = history.reduce((acc, msg) => {
    if (!acc[msg.username]) acc[msg.username] = {};
    if (!acc[msg.username][msg.session_id]) acc[msg.username][msg.session_id] = [];
    acc[msg.username][msg.session_id].push(msg);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1123] to-[#1e1f2f] px-4 py-8 text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">Chat History (Admin View)</h1>

        {error && <p className="text-red-400 text-center">{error}</p>}

        {Object.entries(grouped).map(([username, sessions]) => (
          <div key={username} className="bg-[#111318] rounded-xl shadow-lg p-6">
            <button
              onClick={() => setExpandedUser(expandedUser === username ? null : username)}
              className="text-xl font-semibold w-full text-left text-white"
            >
              👤 {username}
            </button>

            {expandedUser === username && (
              <div className="mt-4 space-y-6">
                {Object.entries(sessions).map(([sessionId, messages]) => (
                  <div key={sessionId} className="bg-[#1e1f2f] rounded-lg p-4">
                    <button
                      onClick={() =>
                        setExpandedSession(
                          expandedSession === sessionId ? null : sessionId
                        )
                      }
                      className="text-blue-400 font-mono text-sm"
                    >
                      🗂️ Session: {sessionId}
                    </button>

                    {expandedSession === sessionId && (
                      <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
                        {messages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg w-fit max-w-lg text-sm ${
                              msg.is_bot
                                ? 'bg-[#2a2f4a] self-start text-blue-300'
                                : 'bg-[#3f3f3f] self-end text-gray-100'
                            }`}
                          >
                            <p className="whitespace-pre-line">{msg.message}</p>
                            <p className="text-gray-400 mt-1 text-xs">{msg.timestamp}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default View;
