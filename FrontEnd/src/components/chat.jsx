import React, { useState, useEffect } from 'react';
import { HiOutlineMoon } from "react-icons/hi";
import { HiOutlineSun } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';

const App = () => {
    const navigate = useNavigate()
    const [isDarkTheme, setIsDarkTheme] = useState(true);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    };

    const handleLogout = () => {
        setShowLogoutConfirm(true);
    }

    const confirmLogout = () => {
        setShowLogoutConfirm(false);
        navigate("/");
    }

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    }

    return (
        <div className={`min-h-screen font-inter ${isDarkTheme ? 'bg-[#1a1a2e] text-gray-100' : 'bg-gray-100 text-gray-900'} antialiased`}>
            <header className={`flex items-center justify-between p-4 ${isDarkTheme ? 'bg-[#20203a]' : 'bg-white'} shadow-lg rounded-b-lg`}>
                <div className="flex items-center space-x-4">
                    <a className="text-xl font-bold flex items-center" href='/'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mr-2 text-[#8a2be2]">
                            <path d="M21 12c0 1.66-1.34 3-3 3H9l-4 4V7c0-1.66 1.34-3 3-3h10c1.66 0 3 1.34 3 3z"></path>
                            <path d="M12 8h0"></path>
                            <path d="M8 8h0"></path>
                            <path d="M16 8h0"></path>
                        </svg>
                        BotBhaiya
                    </a>
                    <span className="text-sm text-gray-400">Freshers’ First Friend Forever</span>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-400 text-sm">{isDarkTheme ? <HiOutlineMoon size={24} /> : <HiOutlineSun size={24} color='black'/>}</span>
                        <label htmlFor="theme-toggle" className="flex items-center cursor-pointer mt-2">
                            <div className="relative">
                                <input type="checkbox" id="theme-toggle" className="sr-only" checked={isDarkTheme} onChange={toggleTheme} />
                                <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${isDarkTheme ? 'translate-x-full' : ''}`}></div>
                            </div>
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="bg-[#DC143C] text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-[#B22222] transition shadow-md" onClick={handleLogout}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" x2="9" y1="12" y2="12"></line>
                            </svg>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-grow p-4 space-x-4 h-[calc(100vh-80px)]">
                <aside className={`w-1/4 p-6 rounded-lg ${isDarkTheme ? 'bg-[#040727]' : 'bg-white'} shadow-lg`}>
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mr-2 text-[#8a2be2]">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                        Knowledge Base
                    </h2>
                    <ul className="space-y-4">
                        <li className="flex items-center text-gray-400 hover:text-gray-200 cursor-pointer transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" x2="8" y1="13" y2="13"></line>
                                <line x1="16" x2="8" y1="17" y2="17"></line>
                                <line x1="10" x2="8" y1="9" y2="9"></line>
                            </svg>
                            <div>
                                <a href="/SquareOneBrochure.pdf" 
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-sm underline hover:text-blue-400'>
                                    SquareOneBrochure.pdf
                                </a>
                            </div>
                        </li>
                    </ul>

                    <div className="mt-8 space-y-4">
                        <button className="w-full bg-[#008080] text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-[#006666] transition shadow-md"> {/* Teal */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                                <path d="M2 6h4"></path>
                                <path d="M2 10h4"></path>
                                <path d="M2 14h4"></path>
                                <path d="M2 18h4"></path>
                                <rect x="8" y="2" width="14" height="20" rx="2"></rect>
                                <path d="M12 8h6"></path>
                                <path d="M12 12h6"></path>
                                <path d="M12 16h6"></path>
                            </svg>
                            <span>Academic Resources</span>
                        </button>
                        <button className="w-full bg-[#4169E1] text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-[#3151B5] transition shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h3.79a4.5 4.5 0 1 1 0 9Z"></path>
                            </svg>
                            <span>Campus Services</span>
                        </button>
                    </div>
                </aside>

                <main className={`flex-1 p-6 rounded-lg ${isDarkTheme ? 'bg-[#20203a]' : 'bg-white'} shadow-lg flex flex-col`}>
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mr-2 text-[#8a2be2]">
                            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                        </svg>
                        BotBhaiya Chat
                    </h2>
                    <p className="text-gray-400 text-sm mb-6">Ask anything you want to know about IIITB</p>

                    <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-lg border border-gray-700 bg-[#1a1a2e]">
                    </div>

                    <div className="mt-6 flex items-center space-x-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Try: 'What are the different clubs and societies of IIITB?'"
                                className={`w-full p-3 pr-12 rounded-lg ${isDarkTheme ? 'bg-[#1a1a2e] text-gray-100' : 'bg-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-[#8a2be2]`}
                            />
                        </div>
                        <button className="bg-[#FF4500] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#CC3700] transition shadow-md"> {/* OrangeRed */}
                            Send
                        </button>
                    </div>
                </main>

            </div>
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div
                        style={{ backgroundColor: isDarkTheme ? "#20203a" : "white" }}
                        className="p-6 rounded-lg shadow-lg w-[90%] max-w-sm"
                    >
                        <h2 className="text-lg font-semibold mb-4 text-center text-red-500">Confirm Logout</h2>
                        <p className="text-sm text-center text-gray-400 mb-6">Are you sure you want to logout?</p>
                        <div className="flex justify-around">
                            <button
                                onClick={confirmLogout}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition shadow-md"
                            >
                                Yes
                            </button>
                            <button
                                onClick={cancelLogout}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition shadow-md"
                            >
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