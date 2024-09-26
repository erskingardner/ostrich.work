import { PRIVATE_OSTRICH_WORK_NSEC_HEX } from "$env/static/private";
import { NDKEvent, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import { unixTimeNowInSeconds } from "$lib/utils/helpers";
import ndkStore from "$lib/stores/ndk";
import { get } from "svelte/store";

export const POST = async ({ request }) => {
    const { nip19, posterNpub, title, tagline } = await request.json();

    if (!nip19 || !posterNpub || !title || !tagline)
        return new Response(JSON.stringify({ error: "Missing required parameter" }), {
            status: 422
        });

    const ndk = get(ndkStore);
    const ostrichNote: NDKEvent = new NDKEvent(ndk, {
        kind: 1,
        content: `🤙 New job posted by @${posterNpub}!\n\n${title}\n${tagline}\n\nCheck it out on Ostrich Work:\nhttps://ostrich.work/jobs/${nip19}\n\n#OstrichWork #job #work`,
        pubkey: "7c163c5d6a90a0a2bad7b6d80495185c9b7766c12c2e7d9797307d97ef21b653",
        created_at: unixTimeNowInSeconds(),
        tags: [
            ["t", "work"],
            ["t", "job"],
            ["t", "OstrichWork"],
            ["r", `https://ostrich.work/jobs/${nip19}`]
        ]
    });
    const pkSigner = new NDKPrivateKeySigner(PRIVATE_OSTRICH_WORK_NSEC_HEX);
    await ostrichNote.sign(pkSigner);

    try {
        await ostrichNote.publish();
        return new Response(JSON.stringify({ ostrichNote }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: `Unable to publish note: ${error}` }), {
            status: 422
        });
    }
};
