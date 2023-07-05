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

<div class="flex flex-col md:flex-row items-center md:gap-6">
    <button on:click={postOrLogIn} class="text-white transition-all py-2 px-4 text-xl italic font-extrabold shadow-square-br shadow-orange-600 hover:shadow-orange-600 bg-purple-700 hover:bg-purple-600">
        Post a job
    </button>
    <p class="text-center md:text-start text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r
    from-orange-400 to-orange-600">
    ⭐ Special launch pricing ⭐<br>Just 10,000 sats per 30 days
    </p>
</div>