// ZIGGY ROUTES & INIERTIA JS USE PAGE & REACT HOOKS
import { route } from "ziggy-js";
import { usePage } from "@inertiajs/react";
import { useMemo } from "react";

// MUI COMPONENTS
import NavTabs from "@/Components/Mui/NavTabs";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

// MUI ICONS
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// PAGES COMPONENTS
import IndexActiveUsers from '@/Pages/Users/Indexes/IndexActiveUsers';
import IndexInactiveUsers from '@/Pages/Users/Indexes/IndexInactiveUsers';

// TYPES
interface UserNavTabsProps {
    userRoles: any[];
    userPermissions: any[];
}

export default function UserNavTabs({ userRoles, userPermissions }: UserNavTabsProps) {
    const { url } = usePage();

    const routes = useMemo(
        () => [
            {
                label: "Active Users",
                href: route("users.active-users.index"),
                icon: <KeyboardArrowRightIcon />,
            },
            {
                label: "Inactive Users",
                href: route("users.inactive-users.index"),
                icon: <KeyboardArrowRightIcon />,
            },
        ],
        []
    );

    const initialTab = useMemo(() => {
        return routes.findIndex((r) => url.startsWith(r.href));
    }, [routes, url]);

    return (
        <AuthenticatedLayout>
            <NavTabs routes={routes} initialTab={initialTab}>
                <IndexActiveUsers userRoles={userRoles} userPermissions={userPermissions} />
                <IndexInactiveUsers userRoles={userRoles} userPermissions={userPermissions} />
            </NavTabs>
        </AuthenticatedLayout>
    );
}
