<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Inertia\Inertia;
use Spatie\Permission\Exceptions\UnauthorizedException;
use Illuminate\Queue\MaxAttemptsExceededException;
use Illuminate\Queue\WorkerOptions;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    // Register the exception handling callbacks for the application.
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            // Let Laravel handle exception reporting
        });
    }

    // Render an exception into an HTTP response.
    public function render($request, Throwable $exception)
    {
        // HANDLE QUEUE JOB EXCEPTIONS - Let Laravel handle logging

        // HANDLE AUTHORIZATION EXCEPTIONS
        if ($exception instanceof UnauthorizedException) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => $exception->getMessage(),
                ], 403);
            }

            return Inertia::location(route('login'));
        }

        // HANDLE 404 EXCEPTIONS (ModelNotFoundException and NotFoundHttpException)
        if ($exception instanceof ModelNotFoundException || $exception instanceof NotFoundHttpException) {
            return $this->handle404Exception($request, $exception);
        }

        return parent::render($request, $exception);
    }

    protected function handle404Exception(Request $request, Throwable $exception)
    {
        // FOR API REQUESTS, RETURN JSON RESPONSE
        if ($request->expectsJson() || $request->wantsJson()) {
            return response()->json([
                'message' => 'Resource not found.',
                'error' => 'Not Found',
                'status' => 404,
            ], 404);
        }

        // FOR INERTIA REQUESTS, RETURN INERTIA RESPONSE WITH 404 PAGE
        if ($request->header('X-Inertia')) {
            return Inertia::render('Errors/404', [
                'status' => 404,
                'message' => 'The page you are looking for could not be found.',
            ])->toResponse($request)->setStatusCode(404);
        }

        // FOR REGULAR WEB REQUESTS, SHOW CUSTOM 404 PAGE
        return response()->view('errors.404', [
            'exception' => $exception,
        ], 404);
    }
}