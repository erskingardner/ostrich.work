<script lang="ts">
    import type { NDKTag } from "@nostr-dev-kit/ndk";
    import MapPinIcon from "$lib/elements/icons/MapPin.svelte";
    import BanknotesIcon from "$lib/elements/icons/Banknotes.svelte";
    import BriefcaseIcon from "$lib/elements/icons/Briefcase.svelte";
    import TagIcon from "$lib/elements/icons/Tag.svelte";

    export let location: string;
    export let priceTags: NDKTag[];
    export let contractType: string;
    export let jobCategories: string[];

    let frequency: string | undefined;
    let currency: string | undefined;
    let price: string | undefined;

    if (priceTags.length > 0) {
        price = priceTags[0][1]
        currency = priceTags[0][2]
        if (priceTags[0].length === 4) frequency = priceTags[0][3]
    }
</script>

<div class="flex flex-row gap-2 items-start text-sm flex-wrap">
    <span class="flex flex-row gap-1.5 items-center bg-orange-800 pl-2 pr-3 py-1 rounded-full text-white capitalize">
        <BriefcaseIcon class="w-5 h-5" />
        {contractType}
    </span>
    <span class="flex flex-row gap-1.5 items-center bg-blue-700 pl-2 pr-3 py-1 rounded-full text-white">
        <MapPinIcon class="w-5 h-5" />
        {location}
    </span>
    {#if priceTags.length > 0}
        <span class="flex flex-row gap-1.5 items-center bg-green-800 pl-2 pr-3 py-1 rounded-full text-white">
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
        <span class="flex flex-row gap-1.5 items-center bg-fuchsia-800 pl-2 pr-3 py-1 rounded-full text-white capitalize">
            <TagIcon class="w-5 h-5" />
            {category}
        </span>
    {/each}
</div>