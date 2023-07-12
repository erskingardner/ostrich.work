/** @type {import('./$types').PageLoad} */
import { get as getStore } from 'svelte/store';
import ndkStore from '$lib/stores/ndk';

export function load({ params }) {
    const jobAddr = params.job;
    const ndk = getStore(ndkStore);
    const job = ndk.fetchEvent(jobAddr);

    return {
        job: job
    };
}
