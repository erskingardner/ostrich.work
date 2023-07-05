<script lang="ts">
    import { currentUser } from '$lib/stores/currentUser';
    import ndk from '$lib/stores/ndk';
    import { Popover, PopoverButton, PopoverPanel } from '@rgossiaux/svelte-headlessui';
    import { Avatar } from '@nostr-dev-kit/ndk-svelte-components';
    import { RelayList } from '@nostr-dev-kit/ndk-svelte-components';
    import CirclePlusIcon from '../../elements/icons/CirclePlus.svelte';
    import LogoutIcon from '../../elements/icons/Logout.svelte';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

</script>

{#if $currentUser}
    <Popover style="position: relative;" class="h-12 w-12">
        <PopoverButton class="h-12 w-12">
            <Avatar ndk={$ndk} npub={$currentUser.npub} class="w-12 h-12 bg-cover" />
        </PopoverButton>

        <PopoverPanel
            style="position: absolute; z-index: 10;"
            class="
                w-80 right-0 flex flex-col
                bg-zinc-100 dark:bg-zinc-900
                p-4 shadow-md
                border border-zinc-200 dark:border-zinc-800
            "
        >
            <div class="panel-contents flex flex-col gap-2">
                <PopoverButton as="a" href={'/jobs/new'} class="popoverPanelLink">
                    <CirclePlusIcon />
                    New job posting
                </PopoverButton>
                <PopoverButton on:click={() => dispatch("logout")} class="popoverPanelLink">
                    <LogoutIcon />
                    Log out
                </PopoverButton>
                <div class="border-b border-zinc-200 dark:border-zinc-800 mt-2 mb-1" />
                <h4 class="font-semibold">Relays</h4>
                <RelayList ndk={$ndk} />
            </div>
        </PopoverPanel>
    </Popover>
{:else}
    <button id="loginButton" on:click={() => dispatch("login")} class="border py-2 px-4 font-semibold hover:bg-purple-500/20 dark:hover:bg-purple-400/20">Log in</button>
{/if}
