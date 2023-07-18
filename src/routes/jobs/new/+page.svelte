<script lang="ts">
    import { NDKEvent, NDKUser } from '@nostr-dev-kit/ndk';
    import type { NDKTag } from '@nostr-dev-kit/ndk';
    import { NDKNip07Signer } from '@nostr-dev-kit/ndk';
    import ndk from '$lib/stores/ndk';
    import { currentUser } from '$lib/stores/currentUser';
    import { unixTimeNowInSeconds, slugify } from '$lib/utils/helpers';
    import { goto } from '$app/navigation';
    import toast from 'svelte-french-toast';
    import { browser } from '$app/environment';
    import { Select, MultiSelect } from 'flowbite-svelte';
    import { contractTypeOptions, categoryOptions, currencyOptions, frequencyOptions } from '$lib/data/formOptions';
    import MarkdownTextarea from '$lib/components/Forms/MarkdownTextarea.svelte';
    import TextInput from '$lib/components/Forms/TextInput.svelte';
    import WaitingSpinner from '$lib/components/WaitingSpinner.svelte';
    import PriceInput from '$lib/components/Forms/PriceInput.svelte';
    import QRCode from 'qrcode';
    import { dev } from '$app/environment';

    // 🤮 JavaScript
    import _LNBits from "lnbits";
    let LNBits: any;

    if (_LNBits.default) {
        LNBits = _LNBits.default;
    } else {
        LNBits = _LNBits;
    }

    if(!$currentUser && browser) {
        toast.error("Unauthorized")
        goto("/")
    }

    let user:NDKUser;

    let title:string;
    let location:string;
    let tagline:string;
    let contractType:string;
    let currency:string;
    let price:number;
    let frequency:string;
    let description: string = "";
    let categories:string[];

    let submitDisabled:boolean = false;
    let invoiceGenerated:boolean = false;
    let invoicePaid:boolean = false;
    let paymentCheckInterval: any;
    let paymentRequestUrl:string;

    if (browser) {
        const signer = new NDKNip07Signer();
        $ndk.signer = signer;
    }

    const { wallet } = LNBits({
        invoiceReadKey: dev ? "86f957d676f14a038a58151dfbbb9fe7" : "fb400ba1854542df9fac1b13b97bc6d3",
        adminKey: "",
        endpoint: 'https://legend.lnbits.com'
    });

    function awaitAndHandlePayment(invoice: any) {
        paymentCheckInterval = setInterval(() => {
            wallet.checkInvoice({ payment_hash: invoice.payment_hash }).then((checkedInvoice) => {
                if (checkedInvoice.paid) {
                    invoicePaid = true;
                    clearInterval(paymentCheckInterval);
                    publishJobEvent();
                }
            })
        }, 1000);
    }

    function handleFormSubmit(event: any) {
        submitDisabled = true;

        wallet.createInvoice({
            amount: 20_000,
            memo: `Job posting on Ostrich.work: ${title}`,
            out: false
        })
        .then((newInvoice) => {
            try {
                paymentRequestUrl = `lightning:${newInvoice.payment_request.toUpperCase()}`;
                const invoiceCanvas = document.getElementById("invoice");

                QRCode.toCanvas(
                    invoiceCanvas,
                    paymentRequestUrl,
                    {errorCorrectionLevel: 'H', width: 250},
                    (error:any) => {
                        if (error) {
                            console.log(error);
                        } else {
                            invoiceGenerated = true;
                            awaitAndHandlePayment(newInvoice);
                            setTimeout(() => invoiceCanvas?.scrollIntoView({ block: 'start',  behavior: 'smooth' }), 100);
                        }
                });
            } catch (error:any) {
                console.error(error);
                toast.error(error);
                submitDisabled = false;
            }
        }).catch((error) => {
            console.error(error);
            toast.error(error);
            submitDisabled = false;
        });
    }

    function generatePriceTag(): NDKTag {
        const priceTag: NDKTag = ["price"]
        if(currency === 'sats') {
            // Convert sats to btc
            priceTag.push((price / 100_000_000).toString());
            priceTag.push("btc");
        } else {
            priceTag.push(price.toString());
            priceTag.push(currency);
        }
        if (frequency !== 'once') priceTag.push(frequency);
        return priceTag;
    }

    function publishJobEvent() {
        // Calculate and formulate the price tag
        const priceTag = generatePriceTag();

        const jobEvent: NDKEvent = new NDKEvent($ndk, {
            kind: 30402, // https://rb.gy/43la8
            pubkey: user.hexpubkey(),
            content: description,
            created_at: unixTimeNowInSeconds(),
            tags: [
                // This d tag means that jobs with the same title from the same
                // user will overwrite each other. You can't have more than one.
                ['d', slugify(title)],
                ['title', title],
                ['summary', tagline],
                ['published_at', `${unixTimeNowInSeconds()}`],
                ['location', location],
                priceTag,
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

    $: if($currentUser) user = $ndk.getUser({npub: $currentUser?.npub});
</script>

<svelte:head>
    <title>Ostrich Work: Post a new job</title>
    <meta
        name="description"
        content="Post a new job on Ostrich Jobs. The first and best Nostr focused job board on the internet."
    />
</svelte:head>

<h2>Post a new job</h2>

<div>
    <form
        on:submit|preventDefault={handleFormSubmit}
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
            bind:value={tagline}
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
            <PriceInput
                bind:currency={currency}
                bind:value={price}
                bind:frequency={frequency}
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
            <span class="skew-x-12">Create new job posting</span>
        </button>
    </form>

    <div id="invoiceContainer" class="mx-auto w-2/3 text-center {invoiceGenerated ? '' : 'hidden'}">
        <h2>Just one more step before we publish your posting...</h2>
        <h4 class="text-xl font-normal">Please pay this Lightning invoice for 20,000 sats.</h4>
        {#if !invoicePaid}
            <div id="awaitingPayment" class="flex flex-row gap-4 items-center text-lg font-medium justify-center mt-10 mb-4">
                Awaiting payment...
                <WaitingSpinner />
            </div>
            <a href={paymentRequestUrl} class="w-full">
                <canvas id="invoice" class="mx-auto md:w-full"></canvas>
            </a>
        {:else}
            <div class="mt-10 mb-4 flex flex-row gap-4 items-center text-lg font-medium justify-center text-green-500">
            Paid! Thank you.
            </div>
        {/if}
    </div>
</div>
