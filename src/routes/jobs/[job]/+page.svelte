<script lang="ts">
    import { displayableName, firstTagValue, formattedDate, unixTimeNowInSeconds } from "$lib/utils/helpers.js";
    import ndk from "$lib/stores/ndk.js";
    import { NDKEvent, type NDKUser, type NDKTag, NDKNip07Signer } from "@nostr-dev-kit/ndk";
    import { Avatar, truncatedNip05 } from "@nostr-dev-kit/ndk-svelte-components";
    import { cleanMarkdown } from "$lib/utils/markdown.js";
    import JobStatPills from "$lib/components/JobStatPills.svelte";
    import { contractTypeOptions, categoryOptions } from "$lib/data/formOptions.js";
    import { currentUser } from "$lib/stores/currentUser.js";
    import ClockIcon from "$lib/elements/icons/Clock.svelte";
    import LinkOutIcon from "$lib/elements/icons/LinkOut.svelte";
    import CheckBadgeIcon from "$lib/elements/icons/CheckBadge.svelte";
    import ArrowCircleIcon from "$lib/elements/icons/ArrowCircle.svelte";
    import { Modal, Button, Tooltip } from "flowbite-svelte";
    import toast from "svelte-french-toast";
    import { unix } from "dayjs";

    export let data;

    let user:NDKUser | undefined;

    let deleteModalOpen = false;

    let messageModalOpen = false;
    let messageContent:string = ""

    let job: NDKEvent;
    let title:string;
    let description:string;
    let location:string;
    let summary:string;
    let contractType:string;
    let jobCategories:string[] = [];
    let priceTags: NDKTag[];
    let publishedAt:number;
    let author: NDKUser;
    let hashtags: NDKTag[]


    $ndk.fetchEvent(data.jobAddr).then((event) => {
        job = event as NDKEvent;
        title = firstTagValue(job, "title");
        description = job.content;
        location = firstTagValue(job, "location");
        summary = firstTagValue(job, "summary");
        priceTags = job.getMatchingTags("price");
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

    async function sendDirectMessage() {
        if(user) {
            const message = new NDKEvent($ndk, {
                kind: 4,
                content: `New message via Ostrich.Work about your job posting "${title}"\n\n ${messageContent}`,
                created_at: unixTimeNowInSeconds(),
                pubkey: user?.hexpubkey() as string,
                tags: [
                    ["p", job.pubkey]
                ]
            })

            if (!$ndk.signer) {
                const signer = new NDKNip07Signer();
                $ndk.signer = signer;
            }
            // Encrypt for the job author
            await message.encrypt(author);

            toast.promise(message.publish(), {
                loading: "Sending message...",
                success: "Message sent. Good luck!",
                error: "Sorry, something went wrong sending the message. Try again."
            }, {
                duration: 3000
            }).then(() => {
                messageModalOpen = false;
                messageContent = "";
            });
        }

    }

    async function deletePost() {
        const deleteEvent = new NDKEvent($ndk, {
            kind: 5,
            pubkey: job.pubkey,
            content: 'Event deleted by owner',
            tags: [
                ['t', 'job'],
                ['t', 'work'],
                ['t', 'employment'],
                job.tagReference()
            ],
            created_at: unixTimeNowInSeconds()
        });

        if (!$ndk.signer) {
            const signer = new NDKNip07Signer();
            $ndk.signer = signer;
        }

        toast.promise(deleteEvent.publish(), {
            loading: "Deleteing job post...",
            success: "Job post deleted!",
            error: "Sorry, something went wrong deleting the post. Try again."
        }, {
            duration: 3000
        }).then(() => {
            deleteModalOpen = false;
        });


    }

    $: if($currentUser) user = $ndk.getUser({npub: $currentUser.npub});
</script>

<svelte:head>
	<title>Ostrich Work: {title}</title>
    <meta
        name="description"
        content={`Ostrich Work Job - ${title}: ${summary}`}
    />
</svelte:head>

<Modal title="Delete this post" bind:open={deleteModalOpen} outsideclose class="not-prose rounded-none">
    <p>Are you sure you want to delete this post? There is no way to undo this.</p>
    <svelte:fragment slot='footer'>
        <div class="flex flex-row gap-8 items-center justify-end w-full">
            <Button on:click={deletePost} class="shrink-0 rounded-none py-2 px-4 transition-all text-center focus:outline-none border-none no-underline text-base duration-1000 hover:duration-500 font-extrabold italic text-white hover:text-white bg-purple-700 dark:bg-purple-700 hover:dark:bg-purple-700 hover:bg-purple-700 -skew-x-12 shadow-square-grey hover:shadow-square-orange-lg">
                <span class="skew-x-12 block">Yes, please delete this post</span>
            </Button>
        </div>
    </svelte:fragment>
</Modal>

<Modal title="Message the job poster" bind:open={messageModalOpen} outsideclose class="not-prose rounded-none">
    <form>
        <textarea name='messageContent' bind:value={messageContent} placeholder="What do you want to say?" class="bg-transparent w-full h-48" />
    </form>
    <svelte:fragment slot='footer'>
        <div class="flex flex-row gap-8 items-start justify-between">
            <span class="text-sm line-clamp-2">Your message will be sent as a Nostr DM to the job poster. You'll be able to find the conversation in all your Nostr clients.
            </span>
            <Button on:click={sendDirectMessage} class="shrink-0 rounded-none py-2 px-4 transition-all text-center focus:outline-none border-none no-underline text-base duration-1000 hover:duration-500 font-extrabold italic text-white hover:text-white bg-purple-700 dark:bg-purple-700 hover:dark:bg-purple-700 hover:bg-purple-700 -skew-x-12 shadow-square-grey hover:shadow-square-orange-lg">
                <span class="skew-x-12 block">Send message</span>
            </Button>
        </div>
    </svelte:fragment>
</Modal>

{#key job}
    {#if job}
        <div class="flex flex-col lg:flex-row gap-20 items-start justify-between">
            <div class="prose dark:prose-invert xl:max-w-4xl">
                <h1 class="mt-10 mb-2 text-orange-600 border-b-2 border-b-orange-500 pb-1 italic">{title}</h1>
                <span class="italic text-lg font-bold">{summary}</span>
                <div class="flex flex-col gap-8">
                    <div>
                        <h2 class="text-orange-600 border-b-2 border-b-orange-500 italic">Job Description</h2>
                        <div class="markdownContent">{@html cleanMarkdown(description)}</div>
                    </div>
                </div>
            </div>
            <div class="w-full md:w-1/3 flex flex-col gap-8 md:mt-10">
                <h1 class="mb-2 text-orange-600 border-b-2 border-b-orange-500 pb-1 italic">Posted by</h1>
                <div>
                    {#await author.fetchProfile() then value}
                        <div class="flex flex-row gap-4 items-start font-medium w-full">
                            <a href={`/${author.npub}`} class="border-none flex w-28 h-28 shrink-0"><Avatar ndk={$ndk} npub={author.npub} class="w-28 h-28 m-0 shadow-square-grey-sm hover:shadow-square-orange hover:duration-500 duration-1000" /></a>
                            <div class="flex flex-col gap-1 items-start break-words shrink">
                                <div class="flex flex-row gap-1 items-center">
                                    <LinkOutIcon class="w-4 h-4" />
                                    <a href="https://primal.net/profile/{author.npub}">{displayableName(author)}</a>
                                </div>
                                <div class="flex flex-row gap-1 items-center">
                                    <CheckBadgeIcon class="w-5 h-5" />
                                    {truncatedNip05(author.profile)}
                                </div>
                            </div>
                        </div>
                        <div class="mt-8">{author.profile?.about}</div>
                    {/await}
                </div>
                <div>
                    <div class="flex flex-row gap-1 items-center">
                        <ClockIcon class="w-5 h-5" />
                        First posted: {formattedDate(publishedAt)}
                    </div>
                    <div class="flex flex-row gap-1 items-center">
                        <ArrowCircleIcon class="w-5 h-5" />
                        Last updated: {formattedDate(parseInt(job.created_at))}
                    </div>
                </div>
                <div>
                    <JobStatPills {location} {priceTags} {contractType} {jobCategories} />
                </div>
                <div>
                    <button disabled={$currentUser?.npub ? false : true} on:click={() => messageModalOpen = true} class="w-full py-2 px-4 transition-all text-center focus:outline-none border-none no-underline text-xl duration-1000 hover:duration-500 font-extrabold italic text-white hover:text-white bg-purple-700 -skew-x-12 shadow-square-grey hover:shadow-square-orange-lg">
                        <span class="skew-x-12 block">Message the poster</span>
                    </button>
                </div>
                {#if !$currentUser?.npub}
                    <Tooltip>Log in to message the poster</Tooltip>
                {/if}
                {#if $currentUser?.npub === author.npub}
                    <div class="flex flex-row justify-end">
                        <a href={`/jobs/${data.jobAddr}/edit`} class="not-styled w-full text-center py-2 px-4 transition-all focus:outline-none border-none no-underline text-xl duration-1000 hover:duration-500 font-extrabold italic text-white hover:text-white bg-purple-700 -skew-x-12 shadow-square-grey hover:shadow-square-orange-lg">
                            <span class="skew-x-12 block">Edit your post</span>
                        </a>
                    </div>
                    <div class="flex flex-row justify-end">
                        <button on:click={() => deleteModalOpen = true} class="w-full py-2 px-4 transition-all text-center focus:outline-none border-none no-underline text-xl duration-1000 hover:duration-500 font-extrabold italic text-white hover:text-white bg-purple-700 -skew-x-12 shadow-square-grey hover:shadow-square-orange-lg">
                            <span class="skew-x-12 block">Delete this post</span>
                        </button>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
{/key}