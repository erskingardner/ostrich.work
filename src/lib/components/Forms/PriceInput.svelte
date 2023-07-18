<script lang="ts">
    import { Select } from "flowbite-svelte";
    import { currencyOptions, frequencyOptions } from "$lib/data/formOptions";

    export let currency:string;
    export let value:number;
    export let frequency:string;

</script>

<label for="price" class="flex flex-col gap-1 w-full font-bold italic text-lg">
    Salary or Wage *
    <div class="flex flex-row -gap-1">
        <Select
            defaultClass="border-zinc-400 dark:border-zinc-600 bg-transparent px-2 py-1.5 font-normal border font-normal w-1/4"
            items={currencyOptions}
            bind:value={currency}
            required
            />
        <input
            name="price"
            bind:value={value}
            type="number"
            class="border-zinc-400 dark:border-zinc-600 bg-transparent p-2 font-normal border w-1/2"
            required
        />
        <Select
            defaultClass="border-zinc-400 dark:border-zinc-600 bg-transparent px-2 py-1.5 font-normal border font-normal w-1/4"
            items={frequencyOptions}
            bind:value={frequency}
            required
            />
    </div>
</label>