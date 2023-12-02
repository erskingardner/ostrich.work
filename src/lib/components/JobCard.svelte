<script lang="ts">
    import type { NDKEvent, NDKTag, NDKUser } from '@nostr-dev-kit/ndk';
    import ndk from '$lib/stores/ndk';
    import { firstTagValue, formattedDate } from '$lib/utils/helpers';
    import { Avatar } from '@nostr-dev-kit/ndk-svelte-components';
    import JobStatPills from './JobStatPills.svelte';
    import { contractTypeOptions, categoryOptions } from '$lib/data/formOptions';

    export let job: NDKEvent;

    let title: string = firstTagValue(job, 'title');
    let location: string = firstTagValue(job, 'location');
    let tagline: string = firstTagValue(job, 'summary');
    let contractType: string;
    let jobCategories: string[] = [];
    let priceTags: NDKTag[] = job.getMatchingTags('price');
    let publishedAt: number = parseInt(firstTagValue(job, 'published_at'));
    let author: NDKUser = $ndk.getUser({ hexpubkey: job.pubkey });

    let hashtags: NDKTag[] = job.getMatchingTags('t');
    hashtags.forEach((tag) => {
        let contractTypeMatch = contractTypeOptions.find((element) => element.value === tag[1]);
        if (contractTypeMatch) contractType = contractTypeMatch.name;

        let categoryMatch = categoryOptions.find((element) => element.value === tag[1]);
        if (categoryMatch) jobCategories.push(categoryMatch.name);
    });
</script>

<a
    href={`/jobs/${job.encode()}`}
    class="not-styled transition-all bg-zinc-50 dark:bg-zinc-950 border dark:hover:text-zinc-50 no-underline border-zinc-700/50 hover:border-zinc-700 dark:border-zinc-50/50 hover:dark:border-zinc-50 p-4 shadow-square-grey-sm duration-1000 hover:duration-500 hover:shadow-square-orange"
>
    <div class="flex flex-row justify-between items-center mb-4">
        <span class="font-medium flex flex-row gap-1 items-center">
            {#await author.fetchProfile() then eventSet}
                <Avatar ndk={$ndk} npub={author.npub} class="w-8 h-8 rounded-sm m-0" />
                {author.profile?.displayName ?? `${author.npub.slice(0, 5)}...${author.npub.slice(-5)}`}
            {/await}
        </span>
        <span class="opacity-70">
            {formattedDate(publishedAt)}
        </span>
    </div>
    <div class="flex flex-row gap-4 items-center">
        <h3 class="mt-0 font-bold">{title}</h3>
    </div>
    <span class="mb-6 block">{tagline}</span>
    <JobStatPills {location} {priceTags} {contractType} {jobCategories} />
</a>
