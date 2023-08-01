import type { PageServerLoad } from './$types';
import ndkStore from '$lib/stores/ndk';
import { get } from 'svelte/store';

export const load: PageServerLoad = async ({ params }) => {
    const npub = params.npub;
    const ndk = get(ndkStore);
    const user = ndk.getUser({ npub: npub });
    await user.fetchProfile();

    return {
        npub: npub,
        userProfile: user.profile
    };
};
