<script lang="ts">
    import PostJobButton from '$lib/components/PostJobButton.svelte';
    import JobList from '$lib/components/JobList.svelte';
</script>

<svelte:head>
    <title>Ostrich Work</title>
    <meta
        name="description"
        content="Help build a more open and transparent world on Nostr. Post jobs, find your next gig, or make the leap into a career building on Nostr."
    />
</svelte:head>

<h2 class="text-xl md:text-2xl">
    The first and best <a
        href="https://nostr.how"
        target="_blank"
        class="font-extrabold no-underline">Nostr</a
    > Jobs board on the internet.
</h2>

<h4>Post full-time, part-time, and contract work for Nostr projects.</h4>

<PostJobButton />
<JobList />
