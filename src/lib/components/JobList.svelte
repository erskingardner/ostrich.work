<script lang="ts">
    import JobCard from "./JobCard.svelte";
    import ndk from "$lib/stores/ndk";
    import type { NDKEvent } from "@nostr-dev-kit/ndk";
    import { mostRecentPostTime, firstTagValue } from "$lib/utils/helpers";
    import CircleXIcon from "$lib/elements/icons/CircleX.svelte";
    import { blacklist, blacklistEvents } from "$lib/data/blacklist";

    let jobEvents: NDKEvent[] = [];
    let jobEventsDTags: string[] = [];
    let deletedJobEvents: NDKEvent[] = [];

    const jobSub = $ndk.subscribe(
        { kinds: [30402], "#t": ["jobs", "work", "employment"] },
        { closeOnEose: false }
    );

    jobSub.on("event", (event) => {
        if (blacklistEvents.includes(event.id)) return; // skip test events
        if (blacklist.includes(event.pubkey)) return; // skip blacklisted pubkeys
        if (!jobEventsDTags.includes(event.tagId())) {
            jobEvents.push(event);
            jobEventsDTags.push(event.tagId());
            jobEvents.sort(
                (a, b) =>
                    parseInt(firstTagValue(b, "published_at")) -
                    parseInt(firstTagValue(a, "published_at"))
            );
            jobEvents = jobEvents;
        }
    });

    const deletedJobsSub = $ndk.subscribe(
        { kinds: [5], "#t": ["jobs", "work", "employment"] },
        { closeOnEose: false }
    );

    deletedJobsSub.on("event", (deletedEvent) => {
        if (!deletedJobEvents.includes(deletedEvent)) {
            deletedJobEvents.push(deletedEvent);
            const newJobEvents = jobEvents.filter(
                (event) => event.tagId() !== deletedEvent.tagId()
            );
            jobEvents = newJobEvents;
        }
    });

    let latestPostAt: string | undefined;
    $: if (jobEvents.length > 0) latestPostAt = mostRecentPostTime(jobEvents);
</script>

<h2 class="flex flex-row items-baseline gap-4">
    Active Jobs
    {#if latestPostAt}
        <span class="text-lg font-light">Latest post about {latestPostAt}</span>
    {/if}
</h2>

<div id="jobs-container" class="flex flex-col gap-8">
    {#if jobEvents.length > 0}
        {#each jobEvents as job}
            {#key job}
                <JobCard {job} />
            {/key}
        {/each}
    {:else}
        <div
            class="flex flex-row items-center gap-2 text-lg font-medium bg-zinc-50 dark:bg-zinc-950 border border-zinc-700/50 dark:border-zinc-50/50 p-4 shadow-square-grey-sm duration-1000 hover:duration-500"
        >
            <CircleXIcon />
            No active jobs...come back soon.
        </div>
    {/if}
</div>
