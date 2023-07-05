<script lang="ts">
    import ProfileMenu from "./ProfileMenu.svelte";

</script>

<div class="py-4 mb-4 flex flex-row justify-between items-center">
    <a href="/" class="border-0 hover:text-orange-600"><h1 class="text-5xl font-extrabold">Nostr Jobs</h1></a>
    <ProfileMenu on:logout on:login  />
</div>