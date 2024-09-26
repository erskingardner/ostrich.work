<script lang="ts">
    import type { NDKUser, NDKUserProfile } from "@nostr-dev-kit/ndk";
    import ndk from "$lib/stores/ndk";

    interface Props {
        pubkey: string;
        className?: string;
    }
    let { pubkey, className }: Props = $props();

    const user: NDKUser = $state($ndk.getUser({ pubkey }));
    let profile: NDKUserProfile | null = $state(null);

    $effect(async () => {
        const userProfile = await user.fetchProfile();
        profile = userProfile;
    });
</script>

<div class={className}>
    {#if profile?.image}
        <img
            src={profile.image}
            alt="avatar"
            class="shrink-0 w-full h-full object-cover py-0 my-0"
        />
    {:else}
        <div
            class="w-full h-full font-semibold text-xl font-mono shrink-0 flex flex-col justify-center text-center"
            style="background-color: #{pubkey.slice(0, 6)};"
        >
            {pubkey.slice(0, 2)}
        </div>
    {/if}
</div>
