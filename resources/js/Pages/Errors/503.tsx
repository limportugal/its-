import React from 'react';
import { Head, Link } from '@inertiajs/react';

interface Props {
    status?: number;
    title?: string;
    message?: string;
    isAuthenticated?: boolean;
}

export default function Error503({ 
    status = 503, 
    title = 'Service Unavailable',
    message = 'The service is temporarily unavailable due to maintenance. Please try again in a few minutes.',
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
            <Head title="Service Unavailable - EMS" />
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

                            {/* Main Toolbox */}
                            <rect x="70" y="60" width="60" height="40" rx="5" fill="url(#grad1)" opacity="0.9">
                                <animate attributeName="y" values="60;58;60" dur="3s" repeatCount="indefinite" />
                            </rect>
                            <rect x="75" y="65" width="50" height="30" rx="3" fill="#ffffff" opacity="0.9" />

                            {/* Toolbox Handle */}
                            <rect x="95" y="55" width="10" height="10" rx="2" fill="url(#grad1)" opacity="0.9" />

                            {/* Tools inside toolbox */}
                            <rect x="80" y="70" width="15" height="3" rx="1" fill="url(#grad2)" />
                            <rect x="80" y="75" width="20" height="3" rx="1" fill="url(#grad2)" />
                            <rect x="80" y="80" width="12" height="3" rx="1" fill="url(#grad2)" />
                            <rect x="80" y="85" width="18" height="3" rx="1" fill="url(#grad2)" />

                            {/* Wrench */}
                            <g opacity="0.8">
                                <rect x="40" y="40" width="25" height="4" rx="2" fill="url(#grad1)">
                                    <animateTransform attributeName="transform" type="rotate" values="15 52 42;-15 52 42;15 52 42" dur="4s" repeatCount="indefinite" />
                                </rect>
                                <circle cx="40" cy="42" r="6" fill="url(#grad1)" opacity="0.8" />
                                <circle cx="40" cy="42" r="3" fill="#ffffff" />
                            </g>

                            {/* Screwdriver */}
                            <g opacity="0.8">
                                <rect x="150" y="80" width="20" height="3" rx="1" fill="url(#grad1)">
                                    <animateTransform attributeName="transform" type="rotate" values="-10 160 82;10 160 82;-10 160 82" dur="5s" repeatCount="indefinite" />
                                </rect>
                                <rect x="170" y="79" width="8" height="5" rx="1" fill="url(#grad2)" />
                            </g>

                            {/* Hammer */}
                            <g opacity="0.8">
                                <rect x="45" y="105" width="3" height="20" rx="1" fill="url(#grad1)">
                                    <animateTransform attributeName="transform" type="rotate" values="0 46 115;20 46 115;0 46 115" dur="3s" repeatCount="indefinite" />
                                </rect>
                                <rect x="40" y="102" width="13" height="8" rx="2" fill="url(#grad1)" />
                            </g>

                            {/* Progress Bars / Maintenance Indicators */}
                            <g opacity="0.9">
                                <rect x="120" y="30" width="40" height="4" rx="2" fill="#e3f2fd" />
                                <rect x="120" y="30" width="25" height="4" rx="2" fill="url(#grad1)">
                                    <animate attributeName="width" values="10;35;10" dur="3s" repeatCount="indefinite" />
                                </rect>
                            </g>

                            <g opacity="0.9">
                                <rect x="120" y="38" width="40" height="4" rx="2" fill="#e3f2fd" />
                                <rect x="120" y="38" width="30" height="4" rx="2" fill="url(#grad1)">
                                    <animate attributeName="width" values="15;30;15" dur="4s" repeatCount="indefinite" />
                                </rect>
                            </g>

                            {/* Floating maintenance particles */}
                            <circle cx="60" cy="30" r="2" fill="#64b5f6">
                                <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
                                <animateTransform attributeName="transform" type="translate" values="0 0;5 -5;0 0" dur="3s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="140" cy="120" r="1.5" fill="#64b5f6">
                                <animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite" />
                                <animateTransform attributeName="transform" type="translate" values="0 0;-3 5;0 0" dur="4s" repeatCount="indefinite" />
                            </circle>

                            {/* "Under Maintenance" sign */}
                            <rect x="80" y="125" width="40" height="15" rx="3" fill="url(#grad1)" opacity="0.9" />
                            <rect x="85" y="130" width="30" height="2" rx="1" fill="#ffffff" opacity="0.8" />
                            <rect x="85" y="133" width="25" height="2" rx="1" fill="#ffffff" opacity="0.8" />
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
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
} 