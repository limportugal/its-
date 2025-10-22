<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    @if (env('APP_ENV') !== 'local')
    @endif

    @auth
    <meta name="user-id" content="{{ auth()->id() }}">
    @endauth
    
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title inertia>{{ config('app.name') }}</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
    
    @if(request()->is('/'))
    <link rel="preload" href="{{ asset('img/logo.png') }}" as="image" type="image/png">
    @endif

    <!-- Scripts -->
    @routes

    @if (env('APP_ENV') === 'local')
    @viteReactRefresh
    @endif

    @vite(['resources/js/app.tsx', 'resources/css/app.css'])


    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>