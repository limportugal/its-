let lastFetchTime = 0;
const throttleTime = 1000; // 1 SECOND INTERVAL

export const throttle = (callback: () => void, throttleTime: number): void => {
    const currentTime = new Date().getTime();
    if (currentTime - lastFetchTime > throttleTime) {
        lastFetchTime = currentTime; // UPDATE LAST FETCH TIME
        callback();
    }
};
