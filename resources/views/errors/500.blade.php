<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Internal Server Error - EMS</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            background: #f8f9fa;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #334155;
            overflow: hidden;
            position: relative;
        }
        
        /* Animated background shapes */
        .bg-shapes {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 0;
        }
        
        .shape {
            position: absolute;
            border-radius: 50%;
            background: linear-gradient(45deg, rgba(33, 150, 243, 0.08), rgba(25, 118, 210, 0.05));
            animation: float 6s ease-in-out infinite;
        }
        
        .shape:nth-child(1) { width: 80px; height: 80px; top: 10%; left: 10%; animation-delay: 0s; }
        .shape:nth-child(2) { width: 120px; height: 120px; top: 70%; left: 80%; animation-delay: 2s; }
        .shape:nth-child(3) { width: 100px; height: 100px; top: 20%; left: 80%; animation-delay: 4s; }
        .shape:nth-child(4) { width: 60px; height: 60px; top: 80%; left: 20%; animation-delay: 1s; }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
            50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        
        .error-container {
            text-align: center;
            padding: 1rem 0.75rem;
            width: 100%;
            max-width: 100%;
            position: relative;
            z-index: 1;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
        
        .error-illustration {
            margin-bottom: 1rem;
            animation: bounce 2s ease-in-out infinite;
        }
        
        .error-illustration svg { width: 120px; height: 100px; }
        
        .error-code {
            font-size: 5.5rem;
            font-weight: 800;
            color: #2196f3;
            line-height: 1;
            margin-bottom: 0.5rem;
            text-shadow: 0 0 30px rgba(33, 150, 243, 0.2);
        }
        
        .error-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: #1e293b; }
        .error-message { font-size: 0.875rem; color: #64748b; margin-bottom: 1rem; line-height: 1.7; max-width: 400px; margin-left: auto; margin-right: auto; }
        .error-actions { display: flex; flex-direction: column; gap: 0.5rem; justify-content: center; align-items: center; max-width: 280px; margin: 0 auto; }
        
        .btn {
            padding: 10px 14px; border: none; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.8rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
            position: relative; overflow: hidden; width: 100%; justify-content: center;
        }
        
        .btn::before {
            content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent); transition: left 0.5s;
        }
        .btn:hover::before { left: 100%; }
        
        .btn-primary {
            background: #2196f3; color: white; box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
        }
        .btn-primary:hover { background: #1976d2; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(33, 150, 243, 0.4); }
        
        .btn-secondary {
            background: white; color: #1e293b; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); border: 2px solid #cbd5e1;
        }
        .btn-secondary:hover { background: #f1f5f9; border-color: #94a3b8; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); }
        
        .icon { width: 20px; height: 20px; transition: transform 0.3s ease; }
        .btn:hover .icon { transform: scale(1.1); }
        
        /* Responsive styles */
        @media (min-width: 576px) {
            .error-container { padding: 1.5rem 1rem; }
            .error-illustration { margin-bottom: 1.5rem; }
            .error-illustration svg { width: 140px; height: 120px; }
            .error-code { font-size: 5.5rem; margin-bottom: 0.75rem; }
            .error-title { font-size: 1.5rem; margin-bottom: 0.75rem; }
            .error-message { font-size: 1rem; margin-bottom: 1.5rem; max-width: 500px; }
            .error-actions { flex-direction: row; gap: 0.75rem; max-width: none; }
            .btn { padding: 10px 16px; font-size: 0.9rem; gap: 8px; width: auto; }
        }
        
        @media (min-width: 768px) {
            .error-container { padding: 1.5rem 1.5rem; max-width: 100%; width: 100%; }
            .error-illustration svg { width: 160px; height: 140px; }
            .error-code { font-size: 5.5rem; margin-bottom: 1rem; }
            .error-title { font-size: 1.75rem; margin-bottom: 1rem; }
            .error-message { font-size: 1.125rem; margin-bottom: 1.75rem; max-width: 600px; }
            .btn { padding: 12px 20px; font-size: 0.95rem; }
        }
        
        @media (min-width: 992px) {
            .error-container { padding: 1.5rem 1.5rem; max-width: 100%; }
            .error-illustration svg { width: 170px; height: 150px; }
            .error-code { font-size: 5.5rem; }
            .error-title { font-size: 2rem; }
            .error-message { font-size: 1.125rem; margin-bottom: 1.75rem; max-width: 620px; }
            .btn { padding: 12px 22px; font-size: 1rem; }
        }
        
        @media (min-width: 1200px) {
            .error-container { padding: 2rem 2rem; max-width: 100%; }
            .error-illustration svg { width: 180px; height: 160px; }
            .error-code { font-size: 5.5rem; }
            .error-title { font-size: 2.25rem; }
            .error-message { font-size: 1.25rem; margin-bottom: 2rem; max-width: 700px; }
            .btn { padding: 14px 24px; font-size: 1rem; }
        }
    </style>
</head>
<body>
    <div class="bg-shapes">
        <div class="shape"></div>
        <div class="shape"></div>
        <div class="shape"></div>
        <div class="shape"></div>
    </div>
    
    <div class="error-container">
        <div class="error-illustration">
            <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#2196f3;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#1976d2;stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#42a5f5;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#1e88e5;stop-opacity:1" />
                    </linearGradient>
                </defs>
                
                <!-- Main Gear -->
                <circle cx="100" cy="80" r="35" fill="url(#grad1)" opacity="0.9">
                    <animateTransform attributeName="transform" type="rotate" values="0 100 80;360 100 80" dur="8s" repeatCount="indefinite"/>
                </circle>
                
                <!-- Gear Teeth -->
                <g>
                    <rect x="95" y="40" width="10" height="10" fill="url(#grad1)"/>
                    <rect x="130" y="75" width="10" height="10" fill="url(#grad1)"/>
                    <rect x="95" y="110" width="10" height="10" fill="url(#grad1)"/>
                    <rect x="60" y="75" width="10" height="10" fill="url(#grad1)"/>
                    <rect x="120" y="55" width="8" height="8" fill="url(#grad1)"/>
                    <rect x="120" y="95" width="8" height="8" fill="url(#grad1)"/>
                    <rect x="80" y="95" width="8" height="8" fill="url(#grad1)"/>
                    <rect x="80" y="55" width="8" height="8" fill="url(#grad1)"/>
                    <animateTransform attributeName="transform" type="rotate" values="0 100 80;360 100 80" dur="8s" repeatCount="indefinite"/>
                </g>
                
                <!-- Center Hole -->
                <circle cx="100" cy="80" r="8" fill="#ffffff" opacity="0.9"/>
                
                <!-- Smaller Broken Gear -->
                <circle cx="60" cy="50" r="20" fill="url(#grad2)" opacity="0.8">
                    <animateTransform attributeName="transform" type="rotate" values="0 60 50;-360 60 50" dur="6s" repeatCount="indefinite"/>
                </circle>
                <g opacity="0.8">
                    <rect x="57" y="25" width="6" height="6" fill="url(#grad2)"/>
                    <rect x="75" y="47" width="6" height="6" fill="url(#grad2)"/>
                    <rect x="57" y="69" width="6" height="6" fill="url(#grad2)"/>
                    <rect x="39" y="47" width="6" height="6" fill="url(#grad2)"/>
                    <animateTransform attributeName="transform" type="rotate" values="0 60 50;-360 60 50" dur="6s" repeatCount="indefinite"/>
                </g>
                <circle cx="60" cy="50" r="5" fill="#ffffff" opacity="0.9"/>
                
                <!-- Another Broken Gear -->
                <circle cx="140" cy="110" r="15" fill="url(#grad2)" opacity="0.8">
                    <animateTransform attributeName="transform" type="rotate" values="0 140 110;360 140 110" dur="10s" repeatCount="indefinite"/>
                </circle>
                <g opacity="0.8">
                    <rect x="137" y="90" width="6" height="6" fill="url(#grad2)"/>
                    <rect x="150" y="107" width="6" height="6" fill="url(#grad2)"/>
                    <rect x="137" y="124" width="6" height="6" fill="url(#grad2)"/>
                    <rect x="124" y="107" width="6" height="6" fill="url(#grad2)"/>
                    <animateTransform attributeName="transform" type="rotate" values="0 140 110;360 140 110" dur="10s" repeatCount="indefinite"/>
                </g>
                <circle cx="140" cy="110" r="4" fill="#ffffff" opacity="0.9"/>
                
                <!-- Error Sparks -->
                <circle cx="80" cy="40" r="2" fill="#64b5f6">
                    <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
                    <animateTransform attributeName="transform" type="translate" values="0 0;5 -3;0 0" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="150" cy="70" r="1.5" fill="#64b5f6">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
                    <animateTransform attributeName="transform" type="translate" values="0 0;-4 4;0 0" dur="3s" repeatCount="indefinite"/>
                </circle>
                
                <!-- Warning Lightning -->
                <path d="M90 130 L95 140 L85 140 Z M95 140 L100 150 L90 150 Z" fill="url(#grad1)" opacity="0.7">
                    <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite"/>
                </path>
            </svg>
        </div>
        
        <div class="error-code">{{ $status ?? 500 }}</div>
        <h1 class="error-title">{{ $title ?? 'Internal Server Error' }}</h1>
        <p class="error-message">
            {!! $message ?? 'We encountered an unexpected issue.<br>Our team has been automatically notified and is working to resolve this quickly.' !!}
        </p>
        <div class="error-actions">
            <a href="{{ route('home') }}" class="btn btn-primary" id="main-button">
                <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                Go to Home
            </a>
            <button onclick="window.location.reload()" class="btn btn-secondary">
                <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
                </svg>
                Refresh Page
            </a>
        </div>
    </div>

    <script>
        // Check if user is authenticated by making a request to check auth status
        async function checkAuthentication() {
            try {
                // Try to fetch user data from a protected endpoint
                const response = await fetch('{{ route("dashboard.index") }}', {
                    method: 'HEAD', // Use HEAD to avoid loading full page content
                    credentials: 'same-origin',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json'
                    }
                });
                
                // If we get a successful response (200-299), user is authenticated
                if (response.ok) {
                    updateButtonForAuthenticatedUser();
                } else {
                    // If we get 401/403, user is not authenticated
                    updateButtonForGuestUser();
                }
            } catch (error) {
                // If request fails, assume user is not authenticated
                updateButtonForGuestUser();
            }
        }
        
        function updateButtonForAuthenticatedUser() {
            const mainButton = document.getElementById('main-button');
            mainButton.href = '{{ route("dashboard.index") }}';
            mainButton.innerHTML = `
                <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
                Back to Dashboard
            `;
        }
        
        function updateButtonForGuestUser() {
            const mainButton = document.getElementById('main-button');
            mainButton.href = '{{ route("home") }}';
            mainButton.innerHTML = `
                <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                Go to Home
            `;
        }
        
        // Run the check when the page loads
        document.addEventListener('DOMContentLoaded', checkAuthentication);
    </script>
</body>
</html> 