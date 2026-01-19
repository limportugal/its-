@extends('layouts.app')

@section('title', 'Request Timeout')

@section('content')
<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
        <div class="text-center">
            <div class="mx-auto h-24 w-24 text-yellow-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 48 48">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
            </div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Request Timeout
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600">
                {{ $message ?? 'The request took too long to process.' }}
            </p>
            <p class="mt-2 text-center text-xs text-gray-500">
                Timeout limit: {{ $timeout ?? 30 }} seconds
            </p>
        </div>

        <div class="mt-8 space-y-4">
            <a href="{{ route('login') }}"
               class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Try Again
            </a>

            <a href="{{ url('/') }}"
               class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Go to Homepage
            </a>
        </div>

        <div class="mt-8 text-center">
            <p class="text-xs text-gray-500">
                If this problem persists, please contact support.
            </p>
        </div>
    </div>
</div>
@endsection