export const extractId = (url: string) => {
    if (!url) return 0;
    const segments = url.replace(/\/$/, '').split('/');
    return parseInt(segments[segments.length - 1], 10);
}
