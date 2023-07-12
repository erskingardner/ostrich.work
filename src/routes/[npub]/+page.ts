import type { PageLoad } from './$types';

export const load = (({ params }) => {
    const npub = params.npub;

    return {
        npub: npub
    };
}) satisfies PageLoad;
