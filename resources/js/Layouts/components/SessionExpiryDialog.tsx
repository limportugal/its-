import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePage } from "@inertiajs/react";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import { PageProps } from "@/types";

type SessionPageProps = PageProps<{
    session?: {
        lifetime_minutes?: number;
        warning_seconds?: number;
    };
}>;

const SESSION_FALLBACK_MINUTES = 30;
const WARNING_FALLBACK_SECONDS = 60;

const SessionExpiryDialog: React.FC = () => {
    const { props } = usePage<SessionPageProps>();
    const isAuthenticated = Boolean(props?.auth?.user);
    const lifetimeMinutes = Number(props?.session?.lifetime_minutes ?? SESSION_FALLBACK_MINUTES);
    const warningSeconds = Number(props?.session?.warning_seconds ?? WARNING_FALLBACK_SECONDS);

    const idleMs = Math.max(1, lifetimeMinutes) * 60 * 1000;
    const preWarningMs = Math.max(0, idleMs - Math.max(1, warningSeconds) * 1000);

    const [open, setOpen] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(Math.max(1, warningSeconds));
    const [actionLoading, setActionLoading] = useState<"logout" | "stay" | null>(null);
    const warnedAtRef = useRef<number>(Date.now());
    const warningTimeoutRef = useRef<number | null>(null);
    const countdownRef = useRef<number | null>(null);
    const redirectingRef = useRef(false);

    const clearClientState = useCallback(async () => {
        try {
            window.sessionStorage.clear();
        } catch {}

        try {
            window.localStorage.clear();
        } catch {}

        if ("caches" in window) {
            try {
                const keys = await window.caches.keys();
                await Promise.all(keys.map((k) => window.caches.delete(k)));
            } catch {}
        }
    }, []);

    const requestServerLogout = useCallback(async () => {
        try {
            const csrfResponse = await fetch(route("csrf-token"), {
                method: "GET",
                credentials: "same-origin",
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
            });

            let csrfToken = "";
            if (csrfResponse.ok) {
                const data = await csrfResponse.json();
                csrfToken = String(data?.csrf_token ?? "");
            }

            await fetch(route("logout"), {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    ...(csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}),
                },
                body: JSON.stringify(csrfToken ? { _token: csrfToken } : {}),
            });
        } catch {}
    }, []);

    const clearTimers = useCallback(() => {
        if (warningTimeoutRef.current) {
            window.clearTimeout(warningTimeoutRef.current);
            warningTimeoutRef.current = null;
        }

        if (countdownRef.current) {
            window.clearInterval(countdownRef.current);
            countdownRef.current = null;
        }
    }, []);

    const hardLogout = useCallback(async () => {
        if (redirectingRef.current) {
            return;
        }

        redirectingRef.current = true;
        setActionLoading("logout");
        clearTimers();
        await requestServerLogout();
        await clearClientState();
        window.location.replace("/");
    }, [clearClientState, clearTimers, requestServerLogout]);

    const startCountdown = useCallback(() => {
        warnedAtRef.current = Date.now();
        setOpen(true);
        setSecondsLeft(Math.max(1, warningSeconds));

        countdownRef.current = window.setInterval(() => {
            const elapsed = Math.floor((Date.now() - warnedAtRef.current) / 1000);
            const next = Math.max(0, Math.max(1, warningSeconds) - elapsed);
            setSecondsLeft(next);

            if (next <= 0) {
                clearTimers();
                hardLogout();
            }
        }, 250);
    }, [clearTimers, hardLogout, warningSeconds]);

    const scheduleWarning = useCallback(() => {
        clearTimers();

        if (!isAuthenticated) {
            return;
        }

        warningTimeoutRef.current = window.setTimeout(() => {
            startCountdown();
        }, preWarningMs);
    }, [clearTimers, isAuthenticated, preWarningMs, startCountdown]);

    const markActivity = useMemo(
        () => () => {
            if (open || actionLoading !== null) {
                return;
            }

            scheduleWarning();
        },
        [actionLoading, open, scheduleWarning],
    );

    const keepSessionAlive = useCallback(async () => {
        if (actionLoading !== null) {
            return;
        }

        setActionLoading("stay");

        try {
            const response = await fetch(route("csrf-token"), {
                method: "GET",
                credentials: "same-origin",
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
            });

            if (!response.ok) {
                await hardLogout();
                return;
            }

            const data = await response.json();
            const token = data?.csrf_token;
            if (typeof token === "string" && token.length > 0) {
                const meta = document.querySelector('meta[name="csrf-token"]');
                if (meta) {
                    meta.setAttribute("content", token);
                }
            }

            setOpen(false);
            setActionLoading(null);
            scheduleWarning();
        } catch {
            await hardLogout();
        }
    }, [actionLoading, hardLogout, scheduleWarning]);

    useEffect(() => {
        scheduleWarning();
        return clearTimers;
    }, [clearTimers, scheduleWarning]);

    useEffect(() => {
        const events: Array<keyof WindowEventMap> = [
            "mousemove",
            "mousedown",
            "keydown",
            "scroll",
            "touchstart",
            "focus",
        ];

        events.forEach((eventName) => window.addEventListener(eventName, markActivity, { passive: true }));
        return () => {
            events.forEach((eventName) => window.removeEventListener(eventName, markActivity));
        };
    }, [markActivity]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <Dialog open={open} disableEscapeKeyDown maxWidth="xs" fullWidth>
            <DialogTitle>Session Expiring</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary">
                    Your session is about to end due to inactivity.
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h3" fontWeight={700} textAlign="center">
                        {secondsLeft}s
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button color="inherit" onClick={hardLogout} disabled={actionLoading !== null}>
                    {actionLoading === "logout" ? (
                        <>
                            <CircularProgress size={16} sx={{ mr: 1 }} />
                            Logging out...
                        </>
                    ) : (
                        "Logout"
                    )}
                </Button>
                <Button variant="contained" onClick={keepSessionAlive} disabled={actionLoading !== null}>
                    {actionLoading === "stay" ? (
                        <>
                            <CircularProgress size={16} sx={{ mr: 1, color: "inherit" }} />
                            Please wait...
                        </>
                    ) : (
                        "Stay Logged In"
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SessionExpiryDialog;
