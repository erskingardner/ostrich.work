<script lang="ts">
    import "../../app.css";
    import Header from "../../lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import { currentUser, currentUserFollows, fetchFollowers } from "$lib/stores/currentUser";
    import ndk from "$lib/stores/ndk";
    import { signin, signout } from "$lib/utils/auth";
    import { Toaster } from "svelte-french-toast";
    import { Modal } from "flowbite-svelte";
    import type { LayoutServerData } from "./$types";

    export let data: LayoutServerData;
    let signerModal = false;
    if (data.cookie) {
        $currentUser = $ndk.getUser({ npub: data.cookie });
        if ($currentUser && $currentUserFollows.length === 0) {
            // fetchFollowers($currentUser).catch(console.error);
        }
    }

    async function login() {
        await signin($ndk);
    }
</script>

<Toaster />

<Modal title="Nostr Signing Extension Not Found" bind:open={signerModal} autoclose>
    <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
        Ostrich Work is an app built on <span class="font-bold">Nostr</span>. To log in and use the
        site you need to sign events with your Nostr keys using a browser extension like Alby or
        nos2x in Chrome or Brave.
    </p>
    <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
        If you're unsure what Nostr is and want to learn more please check out <a
            href="https://nostr.how?utm_source=ostrichWork&utm_medium=signerModal">Nostr.how</a
        >
    </p>
    <svelte:fragment slot="footer">
        <div
            class="flex flex-col gap-8 md:flex-row items-center justify-center md:justify-around w-full"
        >
            <a
                href="https://getalby.com?utm_source=ostrichWork&utm_medium=signerModal"
                class="not-styled mx-auto flex flex-row py-2 px-4 focus:outline-none border-none no-underline text-lg transition-all duration-1000 hover:duration-500 font-extrabold italic text-white bg-purple-700 -skew-x-12 shadow-square-grey hover:shadow-square-orange-lg disabled:hover:shadow-square-grey disabled:opacity-70"
                target="_blank"
            >
                <span class="skew-x-12">Get Alby</span>
            </a>
            <a
                href="https://github.com/fiatjaf/nos2x"
                class="not-styled mx-auto flex flex-row py-2 px-4 focus:outline-none border-none no-underline text-lg transition-all duration-1000 hover:duration-500 font-extrabold italic text-white bg-purple-700 -skew-x-12 shadow-square-grey hover:shadow-square-orange-lg disabled:hover:shadow-square-grey disabled:opacity-70"
                target="_blank"
            >
                <span class="skew-x-12">Get nos2X</span>
            </a>
            <a
                href="https://nostr.how?utm_source=ostrichWork&utm_medium=signerModal"
                class="not-styled mx-auto flex flex-row py-2 px-4 focus:outline-none border-none no-underline text-lg transition-all duration-1000 hover:duration-500 font-extrabold italic text-white bg-purple-700 -skew-x-12 shadow-square-grey hover:shadow-square-orange-lg disabled:hover:shadow-square-grey disabled:opacity-70"
                target="_blank"
            >
                <span class="skew-x-12">Learn more</span>
            </a>
        </div>
    </svelte:fragment>
</Modal>

<div class="mx-auto md:max-w-5xl lg:max-w-7xl px-4">
    <Header on:login={login} on:logout={signout} />
    <div class="md:max-w-5xl lg:max-w-7xl mx-auto prose dark:prose-invert">
        <slot />
    </div>
    <Footer />
</div>
