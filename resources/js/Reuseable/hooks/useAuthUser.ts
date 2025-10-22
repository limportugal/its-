import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import { PageProps } from '@/types';
import { User } from '@/types';

interface Role {
    id: number;
    name: string;
    permissions?: string[];
    pivot?: { model_id: number; role_id: number; };
}

interface AuthUser extends Omit<User, 'roles'> {
    permissions?: string[];
    roles?: Role[];
}

export const useAuthUser = () => {
    const page = usePage<PageProps>();
    const auth = page.props?.auth;

    const user = useMemo<AuthUser | null>(() => (auth?.user as unknown as AuthUser) || null, [auth]);

    const hasRole = (roles: string | string[]): boolean => {
        if (!user?.roles) return false;

        const userRoleNames = user.roles.map((role) => role.name.toLowerCase());
        const rolesToCheck = Array.isArray(roles) ? roles : [roles];

        return rolesToCheck.some((role) => userRoleNames.includes(role.toLowerCase()));
    };

    const hasPermission = (permissions: string | string[]): boolean => {
        if (!user) return false;

        // Check direct user permissions
        const userPermissions = user.permissions || [];
        
        // Check role permissions
        const rolePermissions = user.roles?.flatMap(role => (role as any).permissions || []) || [];
        
        // Combine all permissions
        const allPermissions = [...userPermissions, ...rolePermissions];
        
        if (Array.isArray(permissions)) {
            return permissions.some((permission) => allPermissions.includes(permission));
        }

        return allPermissions.includes(permissions);
    };

    return {
        user,
        hasRole,
        hasPermission,
    };
};
