import { writable } from "svelte/store";
import type { NDKUser } from "@nostr-dev-kit/ndk";

export const currentUser = writable<NDKUser | null>(null);
// Store the user's current follower list as an array of hexpubkeys
export const currentUserFollows = writable<string[]>([]);

export async function fetchFollowers(ndkUser: NDKUser): Promise<string[]> {
    const follows = await ndkUser.follows();
    return [...follows].map((f) => f.pubkey);
}
