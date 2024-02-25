/** @type {import('./$types').PageLoad} */
import { nip19 } from "nostr-tools";
import type { AddressPointer } from "nostr-tools/lib/nip19.js";

export async function load({ params }) {
    const jobAddr = params.job;
    const eventPubkey = (nip19.decode(jobAddr).data as AddressPointer).pubkey;

    return {
        jobAddr,
        eventPubkey
    };
}
