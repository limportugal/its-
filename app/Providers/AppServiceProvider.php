<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Spatie\Permission\PermissionServiceProvider;
use App\Models\Ticket;
use App\Services\Ticket\StoreTicketService;
use Illuminate\Support\Facades\Route;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register the Spatie Permission service provider
        $this->app->register(PermissionServiceProvider::class);
        
        // Register custom services
        $this->app->singleton(StoreTicketService::class, function ($app) {
            return new StoreTicketService();
        });
        
        Route::model('ticket', Ticket::class);
    }

    public function boot(): void
    {
        // FORCE HTTPS IN PRODUCTION
        if (env('APP_ENV') !== 'local') {
            URL::forceScheme('https');
        }
        
        // REGISTER UUID PATTERNS FOR ALL ROUTES
        Route::pattern('uuid', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
        Route::pattern('ticket_uuid', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
    }
}
