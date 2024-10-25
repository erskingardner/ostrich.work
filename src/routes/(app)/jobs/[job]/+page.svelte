<script lang="ts">
    import {
        displayableName,
        firstTagValue,
        formattedDate,
        unixTimeNowInSeconds
    } from "$lib/utils/helpers.js";
    import ndk from "$lib/stores/ndk.js";
    import {
        NDKEvent,
        type NDKUser,
        type NDKTag,
        NDKNip07Signer,
        type NDKUserProfile
    } from "@nostr-dev-kit/ndk";
    import { cleanMarkdown } from "$lib/utils/markdown.js";
    import JobStatPills from "$lib/components/JobStatPills.svelte";
    import { currentUser } from "$lib/stores/currentUser.js";
    import ClockIcon from "$lib/elements/icons/Clock.svelte";
    import LinkOutIcon from "$lib/elements/icons/LinkOut.svelte";
    import CheckBadgeIcon from "$lib/elements/icons/CheckBadge.svelte";
    import ArrowCircleIcon from "$lib/elements/icons/ArrowCircle.svelte";
    import { Modal, Button, Tooltip } from "flowbite-svelte";
    import toast from "svelte-french-toast";
    import Avatar from "$lib/components/Avatar.svelte";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { contractTypeOptions, categoryOptions } from "$lib/data/formOptions.js";
    import Name from "$lib/components/Name.svelte";

    let jobAddr: string = $page.params.job;
    let job: NDKEvent | null = $state(null);

    onMount(async () => {
        job = await $ndk.fetchEvent($page.params.job);
        if (!job) console.error("Job not found");
    });

    let author: NDKUser | null = $derived(
        job ? $ndk.getUser({ pubkey: (job as NDKEvent).pubkey as string }) : null
    );
    let authorProfile: NDKUserProfile | null = $state(null);

    $effect(() => {
        if (author) {
            author.fetchProfile().then((profile) => {
                authorProfile = profile;
            });
        }
    });

    let title: string = $derived(job ? firstTagValue(job, "title") : "");
    let description: string = $derived(job ? (job as NDKEvent).content : "");
    let location: string = $derived(job ? firstTagValue(job, "location") : "");
    let summary: string = $derived(job ? firstTagValue(job, "summary") : "");
    let priceTags: NDKTag[] = $derived(job ? (job as NDKEvent).getMatchingTags("price") : []);
    let createdAt: number | undefined = $derived(job ? (job as NDKEvent).created_at : undefined);
    let publishedAt: number | undefined = $derived(
        job ? parseInt(firstTagValue(job, "published_at")) : createdAt
    );
    let authorImage: string | undefined = $derived(authorProfile?.image || undefined);
    let authorPubkey: string | undefined = $derived(author?.pubkey || undefined);
    let authorName: string | undefined = $derived(
        authorProfile ? displayableName(authorProfile) : undefined
    );
    let tagReference: NDKTag | undefined = $derived(
        job ? (job as NDKEvent).tagReference() : undefined
    );
    let hashtags: NDKTag[] = $derived(job ? (job as NDKEvent).getMatchingTags("t") : []);
    let jobCategories: string[] = $derived.by(() => {
        const jobCategories: string[] = [];
        hashtags.forEach((tag) => {
            const categoryMatch = categoryOptions.find((element) => element.value === tag[1]);
            if (categoryMatch) jobCategories.push(categoryMatch.name);
        });
        return jobCategories;
    });
    let contractType: string | undefined = $derived.by(() => {
        const contractTypeMatch = contractTypeOptions.find((element) =>
            hashtags.some((tag) => tag[1] === element.value)
        );
        return contractTypeMatch?.name;
    });

    let deleteModalOpen = $state(false);
    let messageModalOpen = $state(false);
    let messageContent: string = $state("");

    async function sendDirectMessage() {
        if ($currentUser) {
            const message = new NDKEvent($ndk, {
                kind: 4,
                content: `New message via Ostrich.Work about your job posting "${title}"\n\n ${messageContent}`,
                created_at: unixTimeNowInSeconds(),
                pubkey: $currentUser?.pubkey as string,
                tags: [["p", authorPubkey as string]]
            });

            if (!$ndk.signer) {
                const signer = new NDKNip07Signer();
                $ndk.signer = signer;
            }
            // Encrypt for the job author
            await message.encrypt(author as NDKUser);

            toast
                .promise(
                    message.publish(),
                    {
                        loading: "Sending message...",
                        success: "Message sent. Good luck!",
                        error: "Sorry, something went wrong sending the message. Try again."
                    },
                    {
                        duration: 3000
                    }
                )
                .then(() => {
                    messageModalOpen = false;
                    messageContent = "";
                });
        }
    }

    async function deletePost() {
        const deleteEvent = new NDKEvent($ndk, {
            kind: 5,
            pubkey: authorPubkey as string,
            content: "Event deleted by owner",
            tags: [["t", "job"], ["t", "work"], ["t", "employment"], tagReference as NDKTag],
            created_at: unixTimeNowInSeconds()
        });

        if (!$ndk.signer) {
            const signer = new NDKNip07Signer();
            $ndk.signer = signer;
        }

        toast
            .promise(
                deleteEvent.publish(),
                {
                    loading: "Deleteing job post...",
                    success: "Job post deleted!",
                    error: "Sorry, something went wrong deleting the post. Try again."
                },
                {
                    duration: 3000
                }
            )
            .then(() => {
                deleteModalOpen = false;
            });
    }
</script>

<svelte:head>
    <title>{title} from @{authorName}</title>
    <meta name="description" content={summary} />

    <meta property="og:title" content="{title} from @{authorName}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://ostrich.work/jobs/{jobAddr}" />
    <meta property="og:image" content={authorImage} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta property="twitter:domain" content="ostrich.work" />
    <meta name="twitter:title" content="{title} from @{authorName}" />
    <meta name="twitter:description" content={summary} />
    <meta property="twitter:url" content="https://ostrich.work/jobs/{jobAddr}" />
    <meta name="twitter:image" content={authorImage} />
</svelte:head>

<Modal
    title="Delete this post"
    bind:open={deleteModalOpen}
    outsideclose
    class="not-prose rounded-none"
>
    <p>Are you sure you want to delete this post? There is no way to undo this.</p>
    <svelte:fragment slot="footer">
        <div class="flex flex-row gap-8 items-center justify-end w-full">
            <Button
                on:click={deletePost}
                class="shrink-0 rounded-none py-2 px-4 transition-all text-center focus:outline-none border-none no-underline text-base duration-1000 hover:duration-500 font-extrabold italic text-white hover:text-white bg-purple-700 dark:bg-purple-700 hover:dark:bg-purple-700 hover:bg-purple-700 -skew-x-12 shadow-square-grey hover:shadow-square-orange-lg"
            >
                <span class="skew-x-12 block">Yes, please delete this post</span>
            </Button>
        </div>
    </svelte:fragment>
</Modal>

<Modal
    title="Message the job poster"
    bind:open={messageModalOpen}
    outsideclose
    class="not-prose rounded-none"
>
    <form>
        <textarea
            name="messageContent"
            bind:value={messageContent}
            placeholder="What do you want to say?"
            class="bg-transparent w-full h-48"
        ></textarea>
    </form>
    <svelte:fragment slot="footer">
        <div class="flex flex-row gap-8 items-start justify-between">
            <span class="text-sm line-clamp-2"
                >Your message will be sent as a Nostr DM to the job poster. You'll be able to find
                the conversation in all your Nostr clients.
            </span>
            <Button
                on:click={sendDirectMessage}
                class="shrink-0 rounded-none py-2 px-4 transition-all text-center focus:outline-none border-none no-underline text-base duration-1000 hover:duration-500 font-extrabold italic text-white hover:text-white bg-purple-700 dark:bg-purple-700 hover:dark:bg-purple-700 hover:bg-purple-700 -skew-x-12 shadow-square-grey hover:shadow-square-orange-lg"
            >
                <span class="skew-x-12 block">Send message</span>
            </Button>
        </div>
    </svelte:fragment>
</Modal>

{#key jobAddr}
    {#if jobAddr}
        <div class="flex flex-col lg:flex-row gap-20 items-start justify-between">
            <div class="prose dark:prose-invert xl:max-w-4xl">
                <h1 class="mt-10 mb-2 text-orange-600 border-b-2 border-b-orange-500 pb-1 italic">
                    {title}
                </h1>
                <span class="italic text-lg font-bold">{summary}</span>
                <div class="flex flex-col gap-8">
                    <div>
                        <h2 class="text-orange-600 border-b-2 border-b-orange-500 italic">
                            Job Description
                        </h2>
                        <div class="markdownContent">{@html cleanMarkdown(description)}</div>
                    </div>
                </div>
            </div>
            <div class="w-full md:w-1/3 flex flex-col gap-8 md:mt-10">
                <h1 class="mb-2 text-orange-600 border-b-2 border-b-orange-500 pb-1 italic">
                    Posted by
                </h1>
                <div>
                    {#if author}
                        <div class="flex flex-row gap-4 items-start font-medium w-full">
                            <a href={`/${author.npub}`} class="border-none flex w-28 h-28 shrink-0"
                                ><Avatar
                                    pubkey={author.pubkey}
                                    className="w-28 h-28 m-0 shadow-square-grey-sm hover:shadow-square-orange hover:duration-500 duration-1000"
                                /></a
                            >
                            <div class="flex flex-col gap-1 items-start break-words shrink">
                                <div class="flex flex-row gap-1 items-center">
                                    <LinkOutIcon class="w-4 h-4" />
                                    <a href="https://primal.net/profile/{author.npub}">
                                        <Name user={author} />
                                    </a>
                                </div>
                                <div class="flex flex-row gap-1 items-center">
                                    <CheckBadgeIcon class="w-5 h-5" />
                                    {author.profile?.nip05}
                                </div>
                            </div>
                        </div>
                        <div class="mt-8">{author.profile?.about}</div>
                    {/if}
                </div>
                <div>
                    <div class="flex flex-row gap-1 items-center">
                        <ClockIcon class="w-5 h-5" />
                        First posted: {publishedAt ? formattedDate(publishedAt) : "unknown"}
                    </div>
                    <div class="flex flex-row gap-1 items-center">
                        <ArrowCircleIcon class="w-5 h-5" />
                        Last updated: {createdAt ? formattedDate(createdAt) : "unknown"}
                    </div>
                </div>
                <div>
                    <JobStatPills {location} {priceTags} {contractType} {jobCategories} />
                </div>
                <div>
                    <button
                        disabled={$currentUser?.npub ? false : true}
                        onclick={() => (messageModalOpen = true)}
                        class="w-full py-2 px-4 transition-all text-center focus:outline-none border-none no-underline text-xl duration-1000 hover:duration-500 font-extrabold italic text-white hover:text-white bg-purple-700 -skew-x-12 shadow-square-grey hover:shadow-square-orange-lg"
                    >
                        <span class="skew-x-12 block">Message the poster</span>
                    </button>
                </div>
                {#if !$currentUser?.npub}
                    <Tooltip>Log in to message the poster</Tooltip>
                {/if}
                {#if $currentUser?.npub === author?.npub}
                    <div class="flex flex-row justify-end">
                        <a
                            href={`/jobs/${jobAddr}/edit`}
                            class="not-styled w-full text-center py-2 px-4 transition-all focus:outline-none border-none no-underline text-xl duration-1000 hover:duration-500 font-extrabold italic text-white hover:text-white bg-purple-700 -skew-x-12 shadow-square-grey hover:shadow-square-orange-lg"
                        >
                            <span class="skew-x-12 block">Edit your post</span>
                        </a>
                    </div>
                    <div class="flex flex-row justify-end">
                        <button
                            onclick={() => (deleteModalOpen = true)}
                            class="w-full py-2 px-4 transition-all text-center focus:outline-none border-none no-underline text-xl duration-1000 hover:duration-500 font-extrabold italic text-white hover:text-white bg-purple-700 -skew-x-12 shadow-square-grey hover:shadow-square-orange-lg"
                        >
                            <span class="skew-x-12 block">Delete this post</span>
                        </button>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
{/key}
