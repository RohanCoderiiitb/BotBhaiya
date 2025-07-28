import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';

const App = () => {
    const navigate = useNavigate();
    const [isDarkTheme, setIsDarkTheme] = useState(true);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false)

    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    };

    const handleLogout = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        setShowLogoutConfirm(false);
        navigate("/");
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMsg = async () => {
        const text = input.trim()
        if (!text) return;
        setMessages(prev => [...prev, { sender: "user", text }])
        setInput('')
        setIsTyping(true)
        try {
            const res = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ query: text })
            })
            const data = await res.json()
            setMessages(prev => [...prev, { sender: "bot", text: data.answer, sources: data.sources }]);
        } catch (err) {
            console.error("Error fetching chat response:", err);
            setMessages(prev => [...prev, { sender: 'bot', text: '⚠️ Sorry, something went wrong.' }]);
        } finally {
            setIsTyping(false)
        }
    }

    return (
        <div className={`flex flex-col min-h-screen font-inter ${isDarkTheme ? 'bg-[#121212] text-gray-100' : 'bg-[#f9f9f9] text-gray-900'} antialiased`}>
            {/* Header */}
            <header className={`flex items-center justify-between px-6 py-4 ${isDarkTheme ? 'bg-[#1f1f2f]' : 'bg-white'} shadow-md rounded-b-2xl`}>
                <div className="flex items-center gap-4">
                    <a className="text-2xl font-extrabold flex items-center" href="/">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mr-2 text-[#8a2be2]">
                            <path d="M21 12c0 1.66-1.34 3-3 3H9l-4 4V7c0-1.66 1.34-3 3-3h10c1.66 0 3 1.34 3 3z"></path>
                            <path d="M12 8h0"></path>
                            <path d="M8 8h0"></path>
                            <path d="M16 8h0"></path>
                        </svg>
                        BotBhaiya
                    </a>
                    <span className="text-sm text-gray-400">Freshers’ First Friend Forever</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        {isDarkTheme ? <HiOutlineMoon size={22} /> : <HiOutlineSun size={22} color="black" />}
                        <label htmlFor="theme-toggle" className="flex items-center cursor-pointer mt-2">
                            <div className="relative">
                                <input type="checkbox" id="theme-toggle" className="sr-only" checked={isDarkTheme} onChange={toggleTheme} />
                                <div className="block bg-gray-600 w-10 h-6 rounded-full transition duration-300"></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${isDarkTheme ? 'translate-x-full' : ''}`}></div>
                            </div>
                        </label>
                    </div>
                    <button onClick={handleLogout} className="bg-[#DC143C] text-white px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-[#B22222] transition-all shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" x2="9" y1="12" y2="12"></line>
                        </svg>
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </header>

            <div className="flex flex-grow p-6 gap-6">
                <aside className={`w-1/4 p-6 rounded-2xl ${isDarkTheme ? 'bg-[#1a1a2e]' : 'bg-white'} shadow-xl`}>
                    <h2 className="text-lg font-semibold mb-6 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mr-2 text-[#8a2be2]">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                        Knowledge Base
                    </h2>
                    <ul className="space-y-5">
                        <li className="flex items-center text-gray-400 hover:text-gray-200 cursor-pointer transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" x2="8" y1="13" y2="13"></line>
                                <line x1="16" x2="8" y1="17" y2="17"></line>
                                <line x1="10" x2="8" y1="9" y2="9"></line>
                            </svg>
                            <a href="/SquareOneBrochure.pdf" target="_blank" rel="noopener noreferrer" className="text-sm underline hover:text-blue-400">
                                SquareOneBrochure
                            </a>
                        </li>
                        <li className="flex items-center text-gray-400 hover:text-gray-200 cursor-pointer transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" x2="8" y1="13" y2="13"></line>
                                <line x1="16" x2="8" y1="17" y2="17"></line>
                                <line x1="10" x2="8" y1="9" y2="9"></line>
                            </svg>
                            <a href="/BTechCSE.pdf" target="_blank" rel="noopener noreferrer" className="text-sm underline hover:text-blue-400">
                                BTech CSE Curriculum
                            </a>
                        </li>
                        <li className="flex items-center text-gray-400 hover:text-gray-200 cursor-pointer transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" x2="8" y1="13" y2="13"></line>
                                <line x1="16" x2="8" y1="17" y2="17"></line>
                                <line x1="10" x2="8" y1="9" y2="9"></line>
                            </svg>
                            <a href="/BTechECE.pdf" target="_blank" rel="noopener noreferrer" className="text-sm underline hover:text-blue-400">
                                BTech ECE Curriculum
                            </a>
                        </li>
                        <li className="flex items-center text-gray-400 hover:text-gray-200 cursor-pointer transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" x2="8" y1="13" y2="13"></line>
                                <line x1="16" x2="8" y1="17" y2="17"></line>
                                <line x1="10" x2="8" y1="9" y2="9"></line>
                            </svg>
                            <a href="/BTechDSAI.pdf" target="_blank" rel="noopener noreferrer" className="text-sm underline hover:text-blue-400">
                                BTech DSAI Curriculum
                            </a>
                        </li>
                    </ul>

                    <div className="mt-10 space-y-4">
                        <button className="w-full bg-[#008080] text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#006666] transition-all shadow-md" onClick={() => window.open("https://iiitbac-my.sharepoint.com/personal/aishwarya_sharma_iiitb_ac_in/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Faishwarya%5Fsharma%5Fiiitb%5Fac%5Fin%2FDocuments%2FAcademics&ga=1")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                                <path d="M2 6h4"></path>
                                <path d="M2 10h4"></path>
                                <path d="M2 14h4"></path>
                                <path d="M2 18h4"></path>
                                <rect x="8" y="2" width="14" height="20" rx="2"></rect>
                                <path d="M12 8h6"></path>
                                <path d="M12 12h6"></path>
                                <path d="M12 16h6"></path>
                            </svg>
                            Academic Resources
                        </button>
                        <button className="w-full bg-[#4169E1] text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#3151B5] transition-all shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h3.79a4.5 4.5 0 1 1 0 9Z"></path>
                            </svg>
                            Campus Services
                        </button>
                    </div>
                </aside>

                <main className={`flex-1 p-6 rounded-2xl ${isDarkTheme ? 'bg-[#1f1f2f]' : 'bg-white'} shadow-xl flex flex-col`}>
                    <h2 className="text-xl font-semibold mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mr-2 text-[#8a2be2]">
                            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                        </svg>
                        BotBhaiya Chat
                    </h2>
                    <p className="text-gray-400 text-sm mb-6">Ask anything you want to know about IIITB</p>

                    <div className="flex-1 overflow-hidden">
                        <div className="h-full max-h-[400px] overflow-y-auto space-y-4 p-4 rounded-lg border border-gray-700 bg-[#14142b] scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex gap-3 max-w-[70%] ${msg.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
                                >
                                    {/* ICON */}
                                    {msg.sender === 'bot' && (
                                        <div className="mt-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="text-[#8a2be2]">
                                                <circle cx="12" cy="12" r="10" fill="#8a2be2" />
                                                <text x="12" y="16" textAnchor="middle" fill="white" fontSize="12" fontFamily="sans-serif">🤖</text>
                                            </svg>
                                        </div>
                                    )}
                                    {msg.sender === 'user' && (
                                        <div className="mt-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="text-blue-600">
                                                <circle cx="12" cy="12" r="10" fill="#1e90ff" />
                                                <text x="12" y="16" textAnchor="middle" fill="white" fontSize="12" fontFamily="sans-serif">👤</text>
                                            </svg>
                                        </div>
                                    )}

                                    {/* MESSAGE BUBBLE */}
                                    <div
                                        className={`px-4 py-2 rounded-xl text-sm leading-relaxed break-words ${msg.sender === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-700 text-gray-100'
                                            }`}
                                    >
                                        <div>{msg.text}</div>

                                        {msg.sender === 'bot' && msg.sources && msg.sources.length > 0 && (
                                            <div className="mt-2 text-xs text-blue-400">
                                                Sources:
                                                <ul className="list-disc list-inside space-y-1">
                                                    {msg.sources.map((src, i) => (
                                                        <li key={i}>
                                                            <a
                                                                href={src.replace('./app/Data', '')}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="underline hover:text-blue-300 break-words"
                                                            >
                                                                {src.replace('./app/Data/', '')}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <span className="animate-bounce">🤖 Bot is typing...</span>
                                </div>
                            )}
                            <div ref={endOfMessagesRef} />
                        </div>
                    </div>



                    <div className="mt-6 flex items-center gap-4">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key == "Enter" && sendMsg()}
                            placeholder="Try: 'What are the different clubs and societies of IIITB?'"
                            className={`flex-1 p-3 pr-12 rounded-xl ${isDarkTheme ? 'bg-[#1a1a2e] text-gray-100' : 'bg-gray-100 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-[#8a2be2]`}
                        />
                        <button className="bg-[#FF4500] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#CC3700] transition shadow-md" onClick={sendMsg}>
                            Send
                        </button>
                    </div>
                </main>
            </div>

            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`p-6 rounded-2xl shadow-2xl w-[90%] max-w-sm ${isDarkTheme ? 'bg-[#1f1f2f]' : 'bg-white'}`}>
                        <h2 className="text-xl font-bold mb-3 text-center text-red-500">Confirm Logout</h2>
                        <p className="text-sm text-center text-gray-400 mb-6">Are you sure you want to logout?</p>
                        <div className="flex justify-between gap-4">
                            <button onClick={confirmLogout} className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition shadow-md">
                                Yes
                            </button>
                            <button onClick={cancelLogout} className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition shadow-md">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;