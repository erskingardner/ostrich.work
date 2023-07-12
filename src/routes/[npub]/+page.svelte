<script lang="ts">
    import type { NDKUser, NDKUserProfile } from '@nostr-dev-kit/ndk';
    import type { PageData } from './$types';
    import ndk from '$lib/stores/ndk';
    import { Name, Avatar } from '@nostr-dev-kit/ndk-svelte-components';
    import { goto } from '$app/navigation';
    import { displayableName } from '$lib/utils/helpers';
    import CheckBadgeIcon from '$lib/elements/icons/CheckBadge.svelte';

    export let data: PageData;

    let user: NDKUser;
    let userProfile: NDKUserProfile | undefined;
    let name:string;

    $: user = $ndk.getUser({npub: data.npub});
    $: user.fetchProfile();
    $: userProfile = user.profile;
    $: name = user.profile?.displayName || user.profile?.name || user.npub
    $: console.log(userProfile)

    function handleUsernameClick(event:any) {
        if(event.detail !== user) {
            goto(`/${event.detail.npub}`);
        }
    }

    const defaultBannerImage =
        'https://nostr.build/i/nostr.build_e76387d298587c61e40913929eafe746ce6a780938750d21913a7b488228a146.webp';
</script>

<svelte:head>
    {#await user.fetchProfile() then value}
        <title>Ostrich Work: {displayableName(user)} </title>
        <meta
            name="description"
            content={`Ostrich Work: User profile for ${displayableName(user)}`}
        />
    {/await}
</svelte:head>


<div class="profileWrapper relative w-full mb-14 mt-10">
    {#await user.fetchProfile()}
        Loading...
    {:then value}
        <div
            class="absolute inset-0 w-full min-h-[286px] h-full bg-center bg-cover z-0 shadow-square-grey border border-zinc-700/50 hover:border-zinc-700 dark:border-zinc-50/50 hover:dark:border-zinc-50"
            style={`background-image: url(${ user.profile?.banner || defaultBannerImage})`}
        />
        <div class="z-1 absolute inset-0 w-full min-h-[286px] h-full bg-gradient-to-b from-transparent to-zinc-50 dark:to-zinc-950" />

        <div class="relative profileMetadata flex flex-col gap-2 ml-10 max-w-lg">
            <Avatar ndk={$ndk} user={user} class="w-36 h-36 object-cover shadow-square-grey" />
            <h1 class="text-2xl font-bold mb-0">
                <Name ndk={$ndk} {user} class="no-underline cursor-pointer border-none" on:click={handleUsernameClick}/>
            </h1>
            {#if user.profile?.nip05}
                <p class="flex flex-row gap-1 text-lg font-medium items-center my-0">
                    {user.profile?.nip05}
                    <CheckBadgeIcon />
                </p>
            {/if}

            <p class="font-medium break-words">{user.profile?.about}</p>
        </div>
    {:catch error}
        Error loading user profile
    {/await}
</div>


<div>
<!-- Job listings for the user -->
</div>