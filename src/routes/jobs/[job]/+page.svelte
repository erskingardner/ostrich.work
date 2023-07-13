<script lang="ts">
    import { displayableName, firstTagValue, formattedDate } from "$lib/utils/helpers.js";
    import ndk from "$lib/stores/ndk.js";
    import type { NDKEvent, NDKUser, NDKTag } from "@nostr-dev-kit/ndk";
    import { Avatar } from "@nostr-dev-kit/ndk-svelte-components";
    import { cleanMarkdown } from "$lib/utils/markdown.js";
    import JobStatPills from "$lib/components/JobStatPills.svelte";
    import { contractTypeOptions, categoryOptions } from "$lib/data/formOptions.js";
    import { browser } from "$app/environment";
    import { currentUser } from "$lib/stores/currentUser.js";

    export let data;

    let job: NDKEvent;
    let title:string;
    let description:string;
    let location:string;
    let summary:string;
    let contractType:string;
    let jobCategories:string[] = [];
    let price:string | undefined;
    let publishedAt:number;
    let author: NDKUser;
    let hashtags: NDKTag[]


    $ndk.fetchEvent(data.jobAddr).then((event) => {
        job = event as NDKEvent;
        title = firstTagValue(job, "title");
        description = job.content;
        location = firstTagValue(job, "location");
        summary = firstTagValue(job, "summary");
        price = firstTagValue(job, "price");
        publishedAt = parseInt(firstTagValue(job, "published_at"));
        author = $ndk.getUser({hexpubkey: job.pubkey});
        hashtags = job.getMatchingTags("t");
        hashtags.forEach((tag) => {
            let contractTypeMatch = contractTypeOptions.find(element => element.value === tag[1]);
            if (contractTypeMatch) contractType = contractTypeMatch.name;

            let categoryMatch = categoryOptions.find(element => element.value === tag[1]);
            if (categoryMatch) jobCategories.push(categoryMatch.name);
        });
    });

</script>

<svelte:head>
	<title>Ostrich Work: {title}</title>
    <meta
        name="description"
        content={`Ostrich Work Job - ${title}: ${summary}`}
    />
</svelte:head>

{#key job}
    {#if job}
        <div class="prose dark:prose-invert mx-auto">
            {#if $currentUser?.npub === author.npub}
                <div class="flex flex-row justify-end">
                    <a href={`/jobs/${data.jobAddr}/edit`} class="py-2 px-4 transition-all focus:outline-none border-none no-underline text-2xl duration-1000 hover:duration-500 font-extrabold italic text-white hover:text-white bg-purple-700 -skew-x-12 shadow-square-grey hover:shadow-square-orange-lg">
                        <span class="skew-x-12 block">Edit</span>
                    </a>
                </div>
            {/if}
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
    {/if}
{/key}

<!-- {#if author && browser}
    <script
    src="https://nostri.chat/public/bundle.js"
    data-chat-type="DM"
    data-website-owner-pubkey={author.hexpubkey()}
    data-relays="wss://nostr.band, wss://relay.damus.io, wss://nos.lol, wss://relay.snort.social"
    ></script>
{/if} -->