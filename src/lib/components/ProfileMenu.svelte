<script lang="ts">
    import { currentUser } from "$lib/stores/currentUser";
    import { Popover } from "flowbite-svelte";
    import Avatar from "./Avatar.svelte";
    import CirclePlusIcon from "../elements/icons/CirclePlus.svelte";
    import PersonIcon from "../elements/icons/Person.svelte";
    import LogoutIcon from "../elements/icons/Logout.svelte";
    import { createEventDispatcher } from "svelte";
    import type { NDKUserProfile } from "@nostr-dev-kit/ndk";

    const dispatch = createEventDispatcher();

    let profile: NDKUserProfile | undefined = $state(undefined);

    $effect(() => {
        $currentUser?.fetchProfile().then((profile) => {
            profile = profile;
        });
    });
</script>

{#if $currentUser}
    <button id="popoverArrow" class="h-12 w-12 rounded-none p-0">
        {#if profile}
            <Avatar
                pubkey={$currentUser.pubkey}
                className="block w-12 h-12 bg-cover shadow-square-grey-sm hover:shadow-square-orange duration-1000 hover:duration-500 border border-zinc-700/50 hover:border-zinc-700 dark:border-zinc-50/50 hover:dark:border-zinc-50"
            />
        {/if}
    </button>
    <Popover
        arrow={false}
        triggeredBy="#popoverArrow"
        placement="bottom-start"
        offset={15}
        style="position: absolute; z-index: 10;"
        class="
        w-80 right-80 flex flex-col
        bg-zinc-100 dark:bg-zinc-900
        px-2 py-3 shadow-md rounded-none
        border border-zinc-200 dark:border-zinc-800
    "
    >
        <div class="panel-contents flex flex-col gap-2">
            <a href={"/jobs/new"} class="popoverPanelLink not-styled justify-start rounded-none">
                <CirclePlusIcon />
                New job posting
            </a>
            <a
                href={`/${$currentUser.npub}`}
                class="popoverPanelLink not-styled justify-start rounded-none"
            >
                <PersonIcon />
                My profile
            </a>
            <button
                on:click={() => dispatch("logout")}
                class="popoverPanelLink not-styled justify-start rounded-none"
            >
                <LogoutIcon />
                Log out
            </button>
            <div class="border-b border-zinc-200 dark:border-zinc-800 mt-2 mb-1" />
            <!-- <h4 class="font-semibold">Relays</h4>
            <RelayList ndk={$ndk} /> -->
        </div>
    </Popover>
{:else}
    <button
        id="loginButton"
        on:click={() => dispatch("login")}
        class="border py-2 px-4 font-semibold hover:bg-purple-500/20 dark:hover:bg-purple-400/20"
        >Log in</button
    >
{/if}
