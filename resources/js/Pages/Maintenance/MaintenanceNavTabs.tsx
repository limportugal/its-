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
import IndexServiceCenter from "@/Pages/Maintenance/ServiceCenter/IndexServiceCenters";
import IndexPriorities from "@/Pages/Maintenance/Priorities/IndexPriorities";
import IndexSystem from "@/Pages/Maintenance/System/IndexSystem";
import IndexCompanies from "@/Pages/Maintenance/Companies/IndexCompanies";

export default function MaintenanceNavTabs() {
    const { url } = usePage();

    const routes = useMemo(
        () => [
            {
                label: "Service Centers",
                href: route("maintenance.service-centers.index"),
                icon: <KeyboardArrowRightIcon />,
            },
            {
                label: "Priorities",
                href: route("maintenance.priorities.index"),
                icon: <KeyboardArrowRightIcon />,
            },
            {
                label: "Systems",
                href: route("maintenance.systems.index"),
                icon: <KeyboardArrowRightIcon />,
            },
            {
                label: "Companies",
                href: route("maintenance.companies.index"),
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
                <IndexServiceCenter />
                <IndexPriorities />
                <IndexSystem />
                <IndexCompanies />
            </NavTabs>
        </AuthenticatedLayout>
    );
}
