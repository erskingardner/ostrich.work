<script lang="ts">
    import '../../app.css';
    import Header from '../../lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import { currentUser } from '$lib/stores/currentUser';
    import ndk from '$lib/stores/ndk';
    import { NDKNip07Signer } from '@nostr-dev-kit/ndk';
    import { dateTomorrow } from '$lib/utils/helpers';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';
    import toast, { Toaster } from 'svelte-french-toast';
    import { Modal } from 'flowbite-svelte';
    import { PlausibleAnalytics } from '@accuser/svelte-plausible-analytics';
    import { pa } from '@accuser/svelte-plausible-analytics';

    let savestore = false;
    let signerModal = false;

    $: if (savestore && $currentUser) {
        // Get the user
        window.sessionStorage.setItem('ostrichWorkCurrentUser', JSON.stringify($currentUser));
    }

    if (browser) {
        const storedUser = window.sessionStorage.getItem('ostrichWorkCurrentUser');
        if (storedUser) {
            currentUser.set(JSON.parse(storedUser));
            document.cookie = `userNpub=${
                $currentUser?.npub
            }; expires=${dateTomorrow()}; SameSite=Lax; Secure`;
        }
        savestore = true;
    }

    async function login(domEvent: any) {
        try {
            const signer = new NDKNip07Signer();
            $ndk.signer = signer;
            ndk.set($ndk);
            signer.user().then(async (ndkUser) => {
                if (!!ndkUser.npub) {
                    ndkUser.ndk = $ndk;
                    currentUser.set(ndkUser);
                    window.sessionStorage.setItem(
                        'ostrichWorkCurrentUser',
                        JSON.stringify(ndkUser)
                    );
                    document.cookie = `userNpub=${ndkUser.npub};
                expires=${dateTomorrow()}; SameSite=Lax; Secure`;
                    if (window.plausible) pa.addEvent('Log in');
                    toast.success('Logged in');
                }
            });
            if (domEvent?.detail?.redirect) goto(domEvent.detail.redirect);
        } catch (error: any) {
            console.error(error.message);
            signerModal = true;
        }
    }

    function logout(e: Event) {
        e.preventDefault();
        currentUser.set(undefined);
        window.sessionStorage.removeItem('ostrichWorkCurrentUser');
        document.cookie = 'userNpub=';
        if (window.plausible) pa.addEvent('Log out');
        goto('/');
    }
</script>

<PlausibleAnalytics apiHost="/stats" domain="ostrich.work" />

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
    <Header on:login={login} on:logout={logout} />
    <div class="md:max-w-5xl lg:max-w-7xl mx-auto prose dark:prose-invert">
        <slot />
    </div>
    <Footer />
</div>
