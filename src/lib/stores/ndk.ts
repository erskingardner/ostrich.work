import NDK from "@nostr-dev-kit/ndk";
import NDKSvelte from "@nostr-dev-kit/ndk-svelte";
import type { NDKCacheAdapter } from "@nostr-dev-kit/ndk";
import NDKCacheAdapterDexie from "@nostr-dev-kit/ndk-cache-dexie";
import { writable } from "svelte/store";
import { browser } from "$app/environment";

let cacheAdapter: NDKCacheAdapter | undefined;

if (browser) {
    cacheAdapter = new NDKCacheAdapterDexie({ dbName: "ostrich" });
}

const ndkStore = new NDKSvelte({
    explicitRelayUrls: [
        "wss://purplepag.es",
        "wss://relay.primal.net",
        "wss://relay.damus.io",
        "wss://relay.nostr.band",
        "wss://nos.lol",
        "wss://relay.snort.social"
    ],
    outboxRelayUrls: ["wss://purplepag.es", "wss://relay.primal.net"],
    autoConnectUserRelays: true,
    autoFetchUserMutelist: true,
    enableOutboxModel: false,
    cacheAdapter: cacheAdapter,
    clientName: "Ostrich Work"
});

ndkStore.connect().then(() => console.log("NDK connected"));

const ndk = writable(ndkStore);

export const bunkerNDKStore = new NDK({
    explicitRelayUrls: [
        "wss://relay.nsecbunker.com",
        "wss://purplepag.es",
        "wss://relay.primal.net",
        "wss://relay.damus.io",
        "wss://relay.nostr.band",
        "wss://nos.lol",
        "wss://relay.snort.social"
    ],
    enableOutboxModel: false
});

bunkerNDKStore.connect().then(() => console.log("Bunker NDK Connected"));
export const bunkerNdk = writable(bunkerNDKStore);

export default ndk;
