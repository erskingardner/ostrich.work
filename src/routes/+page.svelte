<script lang="ts">
    import { goto } from "$app/navigation";
    import { currentUser } from "$lib/stores/currentUser";

    function postOrLogIn() {
        if ($currentUser) {
            goto("/jobs/new");
        } else {
            const loginButton = document.getElementById("loginButton");
            if (loginButton) loginButton.click();
        }
    }

</script>

<h2>The first and best <a href="https://nostr.how" target="_blank" class="no-underline">Nostr</a> Jobs board on the internet.</h2>
<div class="flex flex-col md:flex-row items-center md:gap-6">
    <button on:click={postOrLogIn} class="border py-2 px-4 font-semibold hover:bg-purple-500/20 dark:hover:bg-purple-400/20">Post a job</button>
    <p class="text-center md:text-start text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r
    from-orange-400 to-orange-600">
    ⭐ Special launch pricing ⭐<br>Just 10,000 sats per 30 days
    </p>
</div>

<h2>Active Jobs</h2>
<div id="jobs-container" class="flex flex-col gap-4">
    <!-- Jobs go here -->
</div>
