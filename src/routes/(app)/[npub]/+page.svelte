<script lang="ts">
    import ndk from "$lib/stores/ndk";
    import Avatar from "$lib/components/Avatar.svelte";
    import Name from "$lib/components/Name.svelte";
    import { goto } from "$app/navigation";
    import { truncatedBech } from "$lib/utils/helpers";
    import CheckBadgeIcon from "$lib/elements/icons/CheckBadge.svelte";
    import { page } from "$app/stores";
    import type { NDKUser, NDKUserProfile } from "@nostr-dev-kit/ndk";

    const user: NDKUser = $state($ndk.getUser({ npub: $page.params.npub }));
    let profile: NDKUserProfile | null = $state(null);

    $effect(async () => {
        const userProfile = await user.fetchProfile();
        profile = userProfile;
    });

    let name = $derived(profile?.display_name || profile?.name || user.npub);

    function handleUsernameClick(event: any) {
        if (event.detail.npub !== user.npub) {
            goto(`/${event.detail.npub}`);
        }
    }

    const defaultBannerImage =
        "https://nostr.build/i/nostr.build_e76387d298587c61e40913929eafe746ce6a780938750d21913a7b488228a146.webp";
</script>

<svelte:head>
    <title>@{name}</title>
    <meta name="description" content={`User profile for @${name} on Ostrich Work`} />
    <meta property="og:title" content="@{name}" />
    <meta property="og:type" content="profile" />
    <meta property="og:profile:username" content={user.npub} />
    <meta property="og:url" content="https://ostrich.work/{user.npub}" />
    <meta property="og:image" content={profile?.image} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta property="twitter:domain" content="ostrich.work" />
    <meta property="twitter:url" content="https://ostrich.work/{user.npub}" />
    <meta name="twitter:title" content="@{name}" />
    <meta name="twitter:description" content="User profile for @{name} on Ostrich Work" />
    <meta name="twitter:image" content={profile?.image} />
</svelte:head>

<div class="profileWrapper relative w-full mb-14 mt-10">
    <div
        class="absolute inset-0 w-full min-h-[286px] h-full bg-center bg-cover z-0 shadow-square-grey border border-zinc-700/50 hover:border-zinc-700 dark:border-zinc-50/50 hover:dark:border-zinc-50"
        style={`background-image: url(${profile?.banner || defaultBannerImage})`}
    ></div>
    <div
        class="z-1 absolute inset-0 w-full min-h-[286px] h-full bg-gradient-to-b from-transparent to-zinc-50 dark:to-zinc-950"
    ></div>

    <div class="relative profileMetadata flex flex-col gap-2 ml-10 max-w-lg">
        <Avatar pubkey={user.pubkey} className="w-36 h-36 object-cover shadow-square-grey my-8" />
        <h1 class="text-2xl font-bold mb-0">
            <Name
                {user}
                class="no-underline cursor-pointer border-none"
                on:click={handleUsernameClick}
            />
        </h1>
        {#if profile?.nip05}
            <p class="flex flex-row gap-1 text-lg font-medium items-center my-0">
                {profile?.nip05}
                <CheckBadgeIcon />
            </p>
        {/if}

        <p class="font-medium break-words">{profile?.about}</p>
    </div>
</div>

<div>
    <!-- Job listings for the user -->
</div>
