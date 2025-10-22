<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Traits\HasRoles;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */

     public function handle(Request $request, Closure $next, $role)
     {
         if (!Auth::check()) {
             return redirect('/');
         }
         
         // Split the roles by pipe (|) to support multiple roles
         $roles = explode('|', $role);
         
         // Check if the user has any of the specified roles
         $hasRole = false;
         foreach ($roles as $r) {
             if (Auth::user()->hasRole(trim($r))) {
                 $hasRole = true;
                 break;
             }
         }
         
         if (!$hasRole) {
             return redirect('/'); 
         }
 
         return $next($request);
     }
}
