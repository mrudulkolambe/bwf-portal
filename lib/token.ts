const getToken = () => {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.split('=');
        if (key && value) {
            acc[key.trim()] = value.trim();
        }
        return acc;
    }, {} as Record<string, string>);
    return cookies['bwf-auth-token'];
}

const clearToken = () => {
    if (typeof document === 'undefined') return;
    document.cookie = 'bwf-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

const setToken = (token: string) => {
    if (typeof document === 'undefined') return;
    // Set cookie for 7 days
    const date = new Date();
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
    document.cookie = `bwf-auth-token=${token}; expires=${date.toUTCString()}; path=/;`;
}

export { getToken, clearToken, setToken }
