declare module '@react-pdf-viewer/core' {
    export const Viewer: React.FC<any>;
    export const Worker: React.FC<any>;
}

declare module '@react-pdf-viewer/default-layout' {
    export const defaultLayoutPlugin: () => any;
}

declare module '@react-pdf-viewer/zoom' {
    export const zoomPlugin: () => any;
}

declare module '@react-pdf-viewer/search' {
    export const searchPlugin: () => any;
}

declare module '@react-pdf-viewer/thumbnail' {
    export const thumbnailPlugin: () => any;
} 