import "@css/app.css";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot, hydrateRoot } from "react-dom/client";
import AppProvider from "@/Providers/AppProvider";

// GET APP NAME
const appName = import.meta.env.VITE_APP_NAME || "Laravel";

// CREATE INERTIA APP
createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx"),
        ),
    setup({ el, App, props }) {
        const RootComponent = (
            <AppProvider>
                <App {...props} />
            </AppProvider>
        );

        if (import.meta.env.SSR) {
            hydrateRoot(el, RootComponent);
        } else {
            createRoot(el).render(RootComponent);
        }
    },
    progress: {
        color: "#64b5f6",
    },
});
