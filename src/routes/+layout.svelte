<script lang="ts">
    import "../app.css";
    import Header from "../lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import { currentUser } from "$lib/stores/currentUser";
    import ndk from "$lib/stores/ndk";
    import { NDKNip07Signer } from "@nostr-dev-kit/ndk";
    import { onMount } from "svelte";
    import { dateTomorrow } from "$lib/utils/helpers";
    import { goto } from "$app/navigation";


    let savestore = false;

$: if (savestore && $currentUser) {
        // Get the user
        window.sessionStorage.setItem('nostrJobsCurrentUser', JSON.stringify($currentUser));
    }

    onMount(async () => {
        const storedUser = window.sessionStorage.getItem('nostrJobsCurrentUser');
    if (storedUser) {
        currentUser.set(JSON.parse(storedUser));
        document.cookie = `userNpub=${
            $currentUser?.npub
        }; expires=${dateTomorrow()}; SameSite=Lax; Secure`;
    }
        savestore = true;
    });

    async function login(domEvent: any) {
        const signer = new NDKNip07Signer();
        $ndk.signer = signer;
        ndk.set($ndk);
        signer.user().then(async (ndkUser) => {
            if (!!ndkUser.npub) {
                ndkUser.ndk = $ndk;
                currentUser.set(ndkUser);
                window.sessionStorage.setItem('nostrJobsCurrentUser', JSON.stringify(ndkUser));
                document.cookie = `userNpub=${ndkUser.npub};
                expires=${dateTomorrow()}; SameSite=Lax; Secure`;
            }
        });

        if(domEvent?.detail?.redirect) goto(domEvent.detail.redirect);
    }

    function logout(e: Event) {
        e.preventDefault();
        currentUser.set(undefined);
        window.sessionStorage.removeItem('nostrJobsCurrentUser');
        document.cookie = 'userNpub=';
        goto('/');
    }

    </script>

    <div class="mx-auto max-w-4xl px-4">
    <Header on:login={login} on:logout={logout} />
    <div class="max-w-4xl mx-auto prose dark:prose-invert">
        <slot />
    </div>
    <Footer />
</div>
