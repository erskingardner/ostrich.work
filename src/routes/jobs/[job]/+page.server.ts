import type { PageServerLoad } from './$types';
import ndkStore from '$lib/stores/ndk';
import { get } from 'svelte/store';
import type { NDKEvent, NDKTag } from '@nostr-dev-kit/ndk';
import { displayableName, firstTagValue } from '$lib/utils/helpers';
import { contractTypeOptions, categoryOptions } from '$lib/data/formOptions.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    const jobAddr: string = params.job;
    const ndk = get(ndkStore);
    let title: string;
    let description: string;
    let location: string;
    let summary: string;
    let priceTags: NDKTag[] = [];
    let createdAt: number | undefined;
    let publishedAt: number;
    let authorImage: string | undefined;
    let authorPubkey: string;
    let authorName: string | undefined;
    let hashtags: NDKTag[] = [];
    const jobCategories: string[] = [];
    let contractType: string | undefined;
    let tagReference: NDKTag;

    const job: NDKEvent | null = await ndk.fetchEvent(jobAddr);
    if (job) {
        title = firstTagValue(job, 'title');
        description = job.content;
        location = firstTagValue(job, 'location');
        summary = firstTagValue(job, 'summary');
        priceTags = job.getMatchingTags('price');
        publishedAt = parseInt(firstTagValue(job, 'published_at'));
        createdAt = job.created_at as number;
        authorPubkey = job.pubkey;
        hashtags = job.getMatchingTags('t');
        hashtags.forEach((tag) => {
            const contractTypeMatch = contractTypeOptions.find(
                (element) => element.value === tag[1]
            );
            if (contractTypeMatch) contractType = contractTypeMatch.name;

            const categoryMatch = categoryOptions.find((element) => element.value === tag[1]);
            if (categoryMatch) jobCategories.push(categoryMatch.name);
        });

        const author = ndk.getUser({ hexpubkey: job.pubkey });
        await author.fetchProfile();
        authorImage = author.profile?.image;
        authorName = displayableName(author);
        tagReference = job.tagReference();
    } else {
        throw error(404, 'Job listing not found');
    }

    return {
        authorPubkey,
        authorImage,
        authorName,
        contractType,
        description,
        hashtags,
        jobAddr,
        jobCategories,
        location,
        priceTags,
        createdAt,
        publishedAt,
        summary,
        title,
        tagReference
    };
};
