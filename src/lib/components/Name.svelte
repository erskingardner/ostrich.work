<script lang="ts">
    import type { NDKUser, NDKUserProfile } from "@nostr-dev-kit/ndk";
    interface Props {
        user: NDKUser;
    }

    let { user }: Props = $props();

    let profile: NDKUserProfile | null = $state(null);

    $effect(async () => {
        const userProfile = await user.fetchProfile();
        profile = userProfile;
    });

    let name = $derived(profile?.display_name || profile?.name || user.npub);
</script>

{name}
