<script lang="ts">
    import type { NDKEvent } from "@nostr-dev-kit/ndk";
    import { displayableName, firstTagValue, formattedDate } from "$lib/utils/helpers.js";
    import ndk from "$lib/stores/ndk.js";
    import type { NDKUser, NDKTag } from "@nostr-dev-kit/ndk";
    import { Avatar } from "@nostr-dev-kit/ndk-svelte-components";
    import { cleanMarkdown } from "$lib/utils/markdown.js";
    import JobStatPills from "$lib/components/JobStatPills.svelte";
    import { contractTypeOptions, categoryOptions } from "$lib/data/formOptions.js";

    export let data;
    const job: NDKEvent = data.job as NDKEvent;

    let title:string = firstTagValue(job, "title");
    let description:string = job.content;
    let location:string = firstTagValue(job, "location");
    let summary:string = firstTagValue(job, "summary");
    let contractType:string;
    let jobCategories:string[] = [];
    let price:string | undefined = firstTagValue(job, "price");
    let publishedAt:number = parseInt(firstTagValue(job, "published_at")) * 1000;
    let author: NDKUser = $ndk.getUser({hexpubkey: job.pubkey});

    let hashtags: NDKTag[] = job.getMatchingTags("t");
    hashtags.forEach((tag) => {
        let contractTypeMatch = contractTypeOptions.find(element => element.value === tag[1]);
        if (contractTypeMatch) contractType = contractTypeMatch.name;

        let categoryMatch = categoryOptions.find(element => element.value === tag[1]);
        if (categoryMatch) jobCategories.push(categoryMatch.name);
    });
</script>

<svelte:head>
	<title>Ostrich Work: {title}</title>
    <meta
        name="description"
        content={`Ostrich Work Job - ${title}: ${summary}`}
    />
</svelte:head>

<div class="prose dark:prose-invert mx-auto">
    <h1 class="mt-10 mb-2 text-orange-600 border-b-2 border-b-orange-500 pb-1">{title}</h1>
    <span class="italic text-lg font-bold">{summary}</span>
    {#await author.fetchProfile() then value}
        <div class="flex flex-row gap-4 items-center font-medium mt-10">
            <a href={`/${author.npub}`} class="border-none"><Avatar ndk={$ndk} npub={author.npub} class="w-10 h-10 m-0 shadow-square-grey-sm hover:shadow-square-orange hover:duration-500 duration-1000" /></a>
            <span class="mt-2">Posted by {displayableName(author)} on {formattedDate(publishedAt)}</span>
        </div>
    {/await}
    <div class="mt-4">
        <JobStatPills {location} {price} {contractType} {jobCategories} />
    </div>
    <div class="flex flex-col gap-8">
        <div>
            <h2 class="text-orange-600 border-b-2 border-b-orange-500">Job Description</h2>
            <div class="markdownContent">{@html cleanMarkdown(description)}</div>
        </div>
    </div>
</div>