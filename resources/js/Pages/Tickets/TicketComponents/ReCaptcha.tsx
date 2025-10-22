import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface ReCaptchaProps {
    siteKey: string;
    onChange?: (token: string | null) => void;
    onExpired?: () => void;
    onError?: () => void;
    theme?: 'light' | 'dark';
    size?: 'compact' | 'normal' | 'invisible';
    className?: string;
}

export interface ReCaptchaRef {
    execute: () => void;
    reset: () => void;
    getValue: () => string | null;
}

const ReCaptcha = forwardRef<ReCaptchaRef, ReCaptchaProps>(
    ({ siteKey, onChange, onExpired, onError, theme = 'light', size = 'normal', className }, ref) => {
        const recaptchaRef = useRef<ReCAPTCHA>(null);

        useImperativeHandle(ref, () => ({
            execute: () => {
                recaptchaRef.current?.execute();
            },
            reset: () => {
                recaptchaRef.current?.reset();
            },
            getValue: () => {
                return recaptchaRef.current?.getValue() || null;
            },
        }));

        const handleChange = (token: string | null) => {
            onChange?.(token);
        };

        const handleExpired = () => {
            onExpired?.();
        };

        const handleError = () => {
            onError?.();
        };

        return (
            <div className={className}>
                <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={siteKey}
                    onChange={handleChange}
                    onExpired={handleExpired}
                    onErrored={handleError}
                    theme={theme}
                    size={size}
                />
            </div>
        );
    }
);

ReCaptcha.displayName = 'ReCaptcha';

export default ReCaptcha;
