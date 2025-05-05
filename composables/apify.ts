export default function apify(path: string) {
    const config = useRuntimeConfig();
    return `${config.public.api}/${path}/`;
}
