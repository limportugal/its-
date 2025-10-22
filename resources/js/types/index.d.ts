export interface User {
    roles: boolean;
    role?: ReactNode;
    avatar_url?: string | undefined;
    id: number;
    uuid: string;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    csrf_token: string;
    flash: {
        success?: string;
        error?: string;
    };
    userRoles: string[];
};
