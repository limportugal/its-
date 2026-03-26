<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

// MODELS
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\Ticket;
use App\Models\Priority;
use App\Models\Category;
use App\Models\Company;
use App\Models\ServiceCenter;
use App\Models\User;
use App\Models\System;
use App\Models\Ownership;
use App\Models\StoreType;

// POLICIES
use App\Policies\TicketPolicy;
use App\Policies\CategoryPolicy;
use App\Policies\PriorityPolicy;
use App\Policies\CompanyPolicy;
use App\Policies\PermisionPolicy;
use App\Policies\RolePolicy;
use App\Policies\UserPolicy;
use App\Policies\ServiceCenterPolicy;
use App\Policies\SystemPolicy;
use App\Policies\OwnershipPolicy;
use App\Policies\StoreTypePolicy;
class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Ticket::class => TicketPolicy::class,
        Priority::class => PriorityPolicy::class,
        Category::class => CategoryPolicy::class,
        Company::class => CompanyPolicy::class,
        Permission::class => PermisionPolicy::class,
        Role::class => RolePolicy::class,
        User::class => UserPolicy::class,
        ServiceCenter::class => ServiceCenterPolicy::class,
        System::class => SystemPolicy::class,
        Ownership::class => OwnershipPolicy::class,
        StoreType::class => StoreTypePolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
