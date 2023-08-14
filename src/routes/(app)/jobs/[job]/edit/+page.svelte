<script lang="ts">
    import { NDKEvent, NDKUser, NDKNip07Signer } from '@nostr-dev-kit/ndk';
    import type { NDKTag } from '@nostr-dev-kit/ndk';
    import ndk from '$lib/stores/ndk';
    import { currentUser } from '$lib/stores/currentUser';
    import { unixTimeNowInSeconds, slugify } from '$lib/utils/helpers';
    import MarkdownTextarea from '$lib/components/Forms/MarkdownTextarea.svelte';
    import { goto } from '$app/navigation';
    import toast from 'svelte-french-toast';
    import { browser } from '$app/environment';
    import TextInput from '$lib/components/Forms/TextInput.svelte';
    import { Select, MultiSelect } from 'flowbite-svelte';
    import { contractTypeOptions, categoryOptions } from '$lib/data/formOptions';
    import { firstTagValue } from '$lib/utils/helpers';



    export let data;

    if(browser) {
        if(!$currentUser) redirectUnauthorized();

        let userPubkey = $ndk.getUser({npub: $currentUser?.npub}).hexpubkey();
        if(data.eventPubkey !== userPubkey) redirectUnauthorized();
    }

    console.log(data)
    let job: NDKEvent;
    let title:string;
    let description:string;
    let location:string;
    let summary:string;
    let contractType:string;
    let categories:string[] = [];
    let price:string;
    let publishedAt:string;
    let author: NDKUser;
    let hashtags: NDKTag[]


    $ndk.fetchEvent(data.jobAddr).then((event) => {
        if (event) {
            job = event as NDKEvent;
            title = firstTagValue(job, "title");
            description = job.content;
            location = firstTagValue(job, "location");
            summary = firstTagValue(job, "summary");
            price = firstTagValue(job, "price");
            // This is in seconds and needs to stay that way
            publishedAt = firstTagValue(job, "published_at");
            author = $ndk.getUser({hexpubkey: job.pubkey});
            hashtags = job.getMatchingTags("t");
            hashtags.forEach((tag) => {
                let contractTypeMatch = contractTypeOptions.find(element => element.value === tag[1]);
                if (contractTypeMatch) contractType = contractTypeMatch.value;
                let categoryMatch = categoryOptions.find(element => element.value === tag[1]);
                if (categoryMatch) categories.push(categoryMatch.value);
            });
        } else {
            console.error("No event found")
        }
    });
    let submitDisabled:boolean = false;

    if (browser) {
        const signer = new NDKNip07Signer();
        $ndk.signer = signer;
    }

    function redirectUnauthorized() {
        toast.error("You're not allowed to do that");
        goto("/");
    }

    function publishJobEvent() {
        submitDisabled = true;

        const jobEvent: NDKEvent = new NDKEvent($ndk, {
            kind: 30402, // https://rb.gy/43la8
            pubkey: author.hexpubkey(),
            content: description,
            created_at: unixTimeNowInSeconds(),
            tags: [
                // This d tag means that jobs with the same title from the same
                // user will overwrite each other. You can't have more than one.
                ['d', slugify(title)],
                ['title', title],
                ['summary', summary],
                ['published_at', publishedAt],
                ['location', location],
                ['price', price],
                ['t', contractType],
                ['t', 'job'],
                ['t', 'work'],
                ['t', 'employment']
            ]
        });

        categories.forEach((category) => {
            jobEvent.tags.push(['t', category]);
        });

        toast.promise(
            jobEvent.publish(), {
                loading: 'Publishing...',
                success: 'Job posting published!',
                error: 'Error publishing job post'
            }
        ).then(() => {
            goto("/");
        })
    }

</script>

<svelte:head>
    <title>Ostrich Work: Post a new job</title>
    <meta
        name="description"
        content="Edit your job on Ostrich Jobs. The first and best Nostr focused job board on the internet."
    />
</svelte:head>

<h2>Edit Job</h2>

<div>
    <form
        on:submit|preventDefault={publishJobEvent}
        id="newJobForm"
        class="w-full flex flex-col gap-12 items-start"
    >
        <div class="flex flex-col md:flex-row gap-4 w-full">
            <TextInput
                fieldName="title"
                fieldLabel="Job Title"
                bind:value={title}
                placeholder="Job Title"
                required={true}
            />
            <TextInput
                fieldName="location"
                fieldLabel="Location"
                bind:value={location}
                placeholder="Remote or somewhere specific"
                required={true}
            />
        </div>
        <TextInput
            fieldName="tagline"
            fieldLabel="Job Tagline"
            bind:value={summary}
            placeholder="1 sentence summary or teaser"
            required={true}
        />

        <div class="flex flex-col md:flex-row gap-4 w-full">
            <label for="contractType" class="flex flex-col gap-1 w-full font-bold italic text-lg">
                Contract Type *
                <Select
                    defaultClass="border-zinc-400 dark:border-zinc-600 bg-transparent px-2 py-1.5 font-normal border font-normal"
                    items={contractTypeOptions}
                    bind:value={contractType}
                    required
                />
            </label>
            <TextInput
                fieldName="price"
                fieldLabel="Salary or Wage"
                bind:value={price}
                placeholder="E.g. $80,000 per year"
                required={true}
            />
        </div>
        <label for="categories" class="flex flex-col gap-1 w-full font-bold italic text-lg">
            Categories
            <MultiSelect
                class="border-zinc-400 dark:border-zinc-600 bg-transparent px-2 py-1.5 font-normal border w-full rounded-none not-italic"
                dropdownClass="bg-white dark:bg-black hover:rounded-none border-zinc-400 dark:border-zinc-600 px-2 py-1.5 font-normal border w-full rounded-none"
                items={categoryOptions}
                bind:value={categories}
            />
        </label>
        <div class="flex flex-col md:flex-row gap-4 justify-between items-start w-full">
            <MarkdownTextarea
                bind:value={description}
                fieldName={"description"}
                fieldLabel="Job Description"
                placeholder="Tell us about the job and about your company or project. Markdown accepted."/>
        </div>
        <button
            type="submit"
            disabled={submitDisabled}
            class="mx-auto flex flex-row py-2 px-4 focus:outline-none border-none no-underline text-2xl duration-1000 hover:duration-500 font-extrabold italic text-white bg-purple-700 -skew-x-12 shadow-square-grey hover:shadow-square-orange-lg disabled:hover:shadow-square-grey disabled:opacity-70"
        >
            <span class="skew-x-12">Update job posting</span>
        </button>
    </form>

</div>
