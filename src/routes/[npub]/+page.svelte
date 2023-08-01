<script lang="ts">
    import type { NDKUser, NDKUserProfile } from '@nostr-dev-kit/ndk';
    import type { PageData } from './$types';
    import ndk from '$lib/stores/ndk';
    import { Name, Avatar, truncatedNip05 } from '@nostr-dev-kit/ndk-svelte-components';
    import { goto } from '$app/navigation';
    import { truncatedBech } from '$lib/utils/helpers';
    import CheckBadgeIcon from '$lib/elements/icons/CheckBadge.svelte';

    export let data: PageData;

    const name:string = data.userProfile?.name || data.userProfile?.displayName || truncatedBech(data.npub);

    function handleUsernameClick(event:any) {
        if(event.detail.npub !== data.npub) {
            goto(`/${event.detail.npub}`);
        }
    }

    const defaultBannerImage =
        'https://nostr.build/i/nostr.build_e76387d298587c61e40913929eafe746ce6a780938750d21913a7b488228a146.webp';
</script>

<svelte:head>
    <title>Ostrich Work: {name} </title>
    <meta
        name="description"
        content={`Ostrich Work: User profile for ${name}`}
    />
    <meta property='og:title' content={name} />
    <meta property='og:type' content='profile' />
    <meta property='og:profile:username' content={data.npub} />
    <meta property='og:url' content="https://ostrich.work/{data.npub}" />
    <meta property='og:image' content={data.userProfile?.image} />
</svelte:head>


<div class="profileWrapper relative w-full mb-14 mt-10">
    <div
        class="absolute inset-0 w-full min-h-[286px] h-full bg-center bg-cover z-0 shadow-square-grey border border-zinc-700/50 hover:border-zinc-700 dark:border-zinc-50/50 hover:dark:border-zinc-50"
        style={`background-image: url(${ data.userProfile?.banner || defaultBannerImage})`}
    />
    <div class="z-1 absolute inset-0 w-full min-h-[286px] h-full bg-gradient-to-b from-transparent to-zinc-50 dark:to-zinc-950" />

    <div class="relative profileMetadata flex flex-col gap-2 ml-10 max-w-lg">
        <Avatar ndk={$ndk} npub={data.npub} class="w-36 h-36 object-cover shadow-square-grey" />
        <h1 class="text-2xl font-bold mb-0">
            <Name ndk={$ndk} npub={data.npub} class="no-underline cursor-pointer border-none" on:click={handleUsernameClick}/>
        </h1>
        {#if data.userProfile?.nip05}
            <p class="flex flex-row gap-1 text-lg font-medium items-center my-0">
                {truncatedNip05(data.userProfile)}
                <CheckBadgeIcon />
            </p>
        {/if}

        <p class="font-medium break-words">{data.userProfile?.about}</p>
    </div>
</div>


<div>
<!-- Job listings for the user -->
</div>