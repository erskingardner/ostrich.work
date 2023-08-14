import { json } from '@sveltejs/kit';
import { OSTRICH_WORK_NPUB_HEX, OSTRICH_WORK_NSEC_HEX } from '$env/static/private';
import { NDKEvent, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
import { unixTimeNowInSeconds } from '$lib/utils/helpers';
import ndkStore from '$lib/stores/ndk';
import { get } from 'svelte/store';

export const POST = async ({ request }) => {
    const { nip19, posterNpub, title, tagline } = await request.json();

    if (!nip19 || !posterNpub || !title || !tagline) return json({ error: 'Missing required parameter' }, { status: 422 });

    const ndk = get(ndkStore);
    const ostrichNote: NDKEvent = new NDKEvent(ndk, {
        kind: 1,
        content: `🤙 New job posted by @${posterNpub}!\n\n${title}\n${tagline}\n\nCheck it out on Ostrich Work:\nhttps://ostrich.work/jobs/${nip19}\n\n#OstrichWork #job #work`,
        pubkey: OSTRICH_WORK_NPUB_HEX,
        created_at: unixTimeNowInSeconds(),
        tags: [
            ['t', 'work'],
            ['t', 'job'],
            ['t', 'OstrichWork'],
            ['r', `https://ostrich.work/jobs/${nip19}`]
        ]
    })
    const pkSigner = new NDKPrivateKeySigner(OSTRICH_WORK_NSEC_HEX);
    await ostrichNote.sign(pkSigner);

    ostrichNote.publish().then(() => {
        return json({ ostrichNote }, { status: 200 });
    }).catch((error) => {
        return json({ error: `Unable to publish note: ${error}` }, { status: 422 });
    });
};