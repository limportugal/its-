import React from 'react';
import { Head, Link } from '@inertiajs/react';

interface Props {
    status?: number;
    title?: string;
    message?: string;
    isAuthenticated?: boolean;
}

export default function Error500({ 
    status = 500, 
    title = 'Internal Server Error',
    message = 'Something went wrong on our end. Our team has been notified and is working to fix this issue.',
    isAuthenticated = false
}: Props) {
    const homeUrl = isAuthenticated ? route('tickets.indexPendingTickets') : route('login');

    // CSS animations as style objects
    const floatKeyframes = `
        @keyframes float {
            0%, 100% { 
                transform: translateY(0px) rotate(0deg);
                opacity: 0.7;
            }
            50% { 
                transform: translateY(-20px) rotate(180deg);
                opacity: 1;
            }
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }
    `;

    return (
        <>
            <Head title="Internal Server Error - EMS" />
            <style dangerouslySetInnerHTML={{ __html: floatKeyframes }} />
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
                style={{ background: '#f8f9fa' }}>

                {/* Animated Background Shapes */}
                <div className="absolute w-full h-full overflow-hidden z-0">
                    <div className="absolute w-20 h-20 rounded-full opacity-70"
                        style={{
                            background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.08), rgba(25, 118, 210, 0.05))',
                            top: '10%',
                            left: '10%',
                            animation: 'float 6s ease-in-out infinite'
                        }}></div>
                    <div className="absolute w-30 h-30 rounded-full opacity-70"
                        style={{
                            background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.08), rgba(25, 118, 210, 0.05))',
                            top: '70%',
                            left: '80%',
                            animation: 'float 6s ease-in-out infinite 2s'
                        }}></div>
                    <div className="absolute w-25 h-25 rounded-full opacity-70"
                        style={{
                            background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.08), rgba(25, 118, 210, 0.05))',
                            top: '20%',
                            left: '80%',
                            animation: 'float 6s ease-in-out infinite 4s'
                        }}></div>
                    <div className="absolute w-15 h-15 rounded-full opacity-70"
                        style={{
                            background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.08), rgba(25, 118, 210, 0.05))',
                            top: '80%',
                            left: '20%',
                            animation: 'float 6s ease-in-out infinite 1s'
                        }}></div>
                </div>

                <div className="text-center relative z-10 w-full mx-auto p-3 sm:p-4 md:p-6 lg:p-6 xl:p-8">

                    {/* 3D Animated Illustration */}
                    <div className="mb-4 sm:mb-6" style={{ animation: 'bounce 2s ease-in-out infinite' }}>
                        <svg width="120" height="100" viewBox="0 0 200 160" fill="none" className="mx-auto sm:w-32 sm:h-28 md:w-36 md:h-32 lg:w-40 lg:h-36 xl:w-44 xl:h-40">
                            <defs>
                                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#2196f3', stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: '#1976d2', stopOpacity: 1 }} />
                                </linearGradient>
                                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#42a5f5', stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: '#1e88e5', stopOpacity: 1 }} />
                                </linearGradient>
                            </defs>

                            {/* Main Gear */}
                            <circle cx="100" cy="80" r="35" fill="url(#grad1)" opacity="0.9">
                                <animateTransform attributeName="transform" type="rotate" values="0 100 80;360 100 80" dur="8s" repeatCount="indefinite" />
                            </circle>
                            
                            {/* Gear Teeth */}
                            <g>
                                <rect x="95" y="40" width="10" height="10" fill="url(#grad1)" />
                                <rect x="130" y="75" width="10" height="10" fill="url(#grad1)" />
                                <rect x="95" y="110" width="10" height="10" fill="url(#grad1)" />
                                <rect x="60" y="75" width="10" height="10" fill="url(#grad1)" />
                                <rect x="120" y="55" width="8" height="8" fill="url(#grad1)" />
                                <rect x="120" y="95" width="8" height="8" fill="url(#grad1)" />
                                <rect x="80" y="95" width="8" height="8" fill="url(#grad1)" />
                                <rect x="80" y="55" width="8" height="8" fill="url(#grad1)" />
                                <animateTransform attributeName="transform" type="rotate" values="0 100 80;360 100 80" dur="8s" repeatCount="indefinite" />
                            </g>

                            {/* Center Hole */}
                            <circle cx="100" cy="80" r="8" fill="#ffffff" opacity="0.9" />

                            {/* Smaller Broken Gear */}
                            <circle cx="60" cy="50" r="20" fill="url(#grad2)" opacity="0.8">
                                <animateTransform attributeName="transform" type="rotate" values="0 60 50;-360 60 50" dur="6s" repeatCount="indefinite" />
                            </circle>
                            <g opacity="0.8">
                                <rect x="57" y="25" width="6" height="6" fill="url(#grad2)" />
                                <rect x="75" y="47" width="6" height="6" fill="url(#grad2)" />
                                <rect x="57" y="69" width="6" height="6" fill="url(#grad2)" />
                                <rect x="39" y="47" width="6" height="6" fill="url(#grad2)" />
                                <animateTransform attributeName="transform" type="rotate" values="0 60 50;-360 60 50" dur="6s" repeatCount="indefinite" />
                            </g>
                            <circle cx="60" cy="50" r="5" fill="#ffffff" opacity="0.9" />

                            {/* Another Broken Gear */}
                            <circle cx="140" cy="110" r="15" fill="url(#grad2)" opacity="0.8">
                                <animateTransform attributeName="transform" type="rotate" values="0 140 110;360 140 110" dur="10s" repeatCount="indefinite" />
                            </circle>
                            <g opacity="0.8">
                                <rect x="137" y="90" width="6" height="6" fill="url(#grad2)" />
                                <rect x="150" y="107" width="6" height="6" fill="url(#grad2)" />
                                <rect x="137" y="124" width="6" height="6" fill="url(#grad2)" />
                                <rect x="124" y="107" width="6" height="6" fill="url(#grad2)" />
                                <animateTransform attributeName="transform" type="rotate" values="0 140 110;360 140 110" dur="10s" repeatCount="indefinite" />
                            </g>
                            <circle cx="140" cy="110" r="4" fill="#ffffff" opacity="0.9" />

                            {/* Error Sparks */}
                            <circle cx="80" cy="40" r="2" fill="#64b5f6">
                                <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
                                <animateTransform attributeName="transform" type="translate" values="0 0;5 -3;0 0" dur="2s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="150" cy="70" r="1.5" fill="#64b5f6">
                                <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                                <animateTransform attributeName="transform" type="translate" values="0 0;-4 4;0 0" dur="3s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="40" cy="90" r="1" fill="#64b5f6">
                                <animate attributeName="opacity" values="1;0.5;1" dur="1.8s" repeatCount="indefinite" />
                                <animateTransform attributeName="transform" type="translate" values="0 0;3 2;0 0" dur="2.5s" repeatCount="indefinite" />
                            </circle>

                            {/* Warning Lightning */}
                            <path d="M90 130 L95 140 L85 140 Z M95 140 L100 150 L90 150 Z" fill="url(#grad1)" opacity="0.7">
                                <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" />
                            </path>
                        </svg>
                    </div>

                    <div className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold mb-2 sm:mb-3 leading-none"
                        style={{
                            color: '#2196f3',
                            textShadow: '0 0 30px rgba(33, 150, 243, 0.2)'
                        }}>
                        {status}
                    </div>

                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl font-bold text-slate-800 mb-2 sm:mb-3 tracking-tight">
                        {title}
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg lg:text-lg xl:text-lg text-slate-600 mb-4 sm:mb-6 md:mb-8 leading-relaxed max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-lg mx-auto">
                        {message}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center max-w-sm mx-auto sm:max-w-none">
                        <Link
                            href={homeUrl}
                            className="group inline-flex items-center gap-2 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-3 font-semibold rounded-lg text-white transition-all duration-300 relative overflow-hidden w-full sm:w-auto text-xs sm:text-sm"
                            style={{
                                background: '#2196f3',
                                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.background = '#1976d2';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(33, 150, 243, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.background = '#2196f3';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(33, 150, 243, 0.3)';
                            }}
                        >
                            <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                            </svg>
                            Back to Dashboard
                        </Link>

                        <button
                            onClick={() => window.location.reload()}
                            className="group inline-flex items-center gap-2 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-3 font-semibold rounded-lg text-slate-800 transition-all duration-300 border w-full sm:w-auto text-xs sm:text-sm"
                            style={{
                                background: 'white',
                                borderColor: '#cbd5e1',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.background = '#f1f5f9';
                                e.currentTarget.style.borderColor = '#94a3b8';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.borderColor = '#cbd5e1';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                            }}
                        >
                            <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                            Refresh Page
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
} 