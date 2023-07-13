<script lang="ts">
    import ProfileMenu from './ProfileMenu.svelte';
    import { DarkMode } from 'flowbite-svelte';
</script>

<div class="py-4 flex flex-row justify-between items-center">
    <a href="/" class="border-0 hover:text-orange-600 not-styled transition-colors hover:duration-500 duration-1000">
        <h1 class="text-3xl md:text-5xl font-extrabold font-montagu">Ostrich Work</h1>
    </a>
    <div class="flex flex-row items-center gap-4">
        <DarkMode size='lg' btnClass="p-2.5 hover:text-orange-600 transition-all duration-1000 hover:duration-500" />
        <ProfileMenu on:logout on:login />
    </div>
</div>
