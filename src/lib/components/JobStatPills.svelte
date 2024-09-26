<script lang="ts">
    import type { NDKTag } from "@nostr-dev-kit/ndk";
    import MapPinIcon from "$lib/elements/icons/MapPin.svelte";
    import BanknotesIcon from "$lib/elements/icons/Banknotes.svelte";
    import BriefcaseIcon from "$lib/elements/icons/Briefcase.svelte";
    import TagIcon from "$lib/elements/icons/Tag.svelte";
    import { format } from "mathjs";

    interface Props {
        location: string | undefined;
        priceTags: NDKTag[];
        contractType: string | undefined;
        jobCategories: string[];
    }

    let { location, priceTags, contractType, jobCategories }: Props = $props();

    let frequency: string | undefined = $derived(priceTags[0]?.[3]);
    let currency: string | undefined = $derived(priceTags[0]?.[2]);
    let price: string | undefined = $derived.by(() => {
        let price = undefined;
        if (priceTags?.length > 0) {
            price = priceTags[0][1];

            // Fix broken scientific notation
            if (price.includes("e-")) {
                price = format(parseFloat(price), { notation: "fixed" });
            }
        }
        return price;
    });
</script>

<div class="flex flex-row gap-2 items-start text-sm flex-wrap">
    {#if contractType}
        <span
            class="flex flex-row gap-1.5 items-center bg-orange-800 pl-2 pr-3 py-1 rounded-full text-white capitalize"
        >
            <BriefcaseIcon class="w-5 h-5" />
            {contractType}
        </span>
    {/if}
    {#if location}
        <span
            class="flex flex-row gap-1.5 items-center bg-blue-700 pl-2 pr-3 py-1 rounded-full text-white"
        >
            <MapPinIcon class="w-5 h-5" />
            {location}
        </span>
    {/if}
    {#if priceTags?.length > 0}
        <span
            class="flex flex-row gap-1.5 items-center bg-green-800 pl-2 pr-3 py-1 rounded-full text-white"
        >
            <BanknotesIcon class="w-5 h-5" />
            {price}
            {#if currency}
                {currency.toUpperCase()}
            {/if}
            {#if frequency}
                per {frequency}
            {/if}
        </span>
    {/if}
    {#each jobCategories as category}
        <span
            class="flex flex-row gap-1.5 items-center bg-fuchsia-800 pl-2 pr-3 py-1 rounded-full text-white capitalize"
        >
            <TagIcon class="w-5 h-5" />
            {category}
        </span>
    {/each}
</div>
