<script lang="ts">
    import type { NDKUser, NDKUserProfile } from "@nostr-dev-kit/ndk";
    import { truncatedNpub } from "$lib/utils/helpers";
    interface Props {
        user: NDKUser;
    }

    let { user }: Props = $props();

    let userProfile: NDKUserProfile | null = $state(null);

    $effect(() => {
        user.fetchProfile().then((profile) => (userProfile = profile));
    });

    let name = $derived.by(() => {
        return userProfile?.displayName || userProfile?.name || truncatedNpub(user);
    });
</script>

{name}
