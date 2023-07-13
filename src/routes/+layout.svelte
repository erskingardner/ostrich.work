<script lang="ts">
    import '../app.css';
    import Header from '../lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import { currentUser } from '$lib/stores/currentUser';
    import ndk from '$lib/stores/ndk';
    import { NDKNip07Signer } from '@nostr-dev-kit/ndk';
    import { onMount } from 'svelte';
    import { dateTomorrow } from '$lib/utils/helpers';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';
    import toast, { Toaster } from 'svelte-french-toast';

    let savestore = false;

    $: if (savestore && $currentUser) {
        // Get the user
        window.sessionStorage.setItem('ostrichWorkCurrentUser', JSON.stringify($currentUser));
    }

    if (browser)   {
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
        const signer = new NDKNip07Signer();
        $ndk.signer = signer;
        ndk.set($ndk);
        signer.user().then(async (ndkUser) => {
            if (!!ndkUser.npub) {
                ndkUser.ndk = $ndk;
                currentUser.set(ndkUser);
                window.sessionStorage.setItem('ostrichWorkCurrentUser', JSON.stringify(ndkUser));
                document.cookie = `userNpub=${ndkUser.npub};
                expires=${dateTomorrow()}; SameSite=Lax; Secure`;
                toast.success("Logged in");
            }
        });

        if (domEvent?.detail?.redirect) goto(domEvent.detail.redirect);
    }

    function logout(e: Event) {
        e.preventDefault();
        currentUser.set(undefined);
        window.sessionStorage.removeItem('ostrichWorkCurrentUser');
        document.cookie = 'userNpub=';
        goto('/');
    }
</script>

<Toaster />
<div class="mx-auto md:max-w-5xl lg:max-w-7xl px-4">
    <Header on:login={login} on:logout={logout} />
    <div class="md:max-w-5xl lg:max-w-7xl mx-auto prose dark:prose-invert">
        <slot />
    </div>
    <Footer />
</div>
