<script lang="ts">
    export let value: string;
    export let fieldName: string;
    export let fieldLabel: string;
    export let required: boolean;
</script>

<label for={fieldName} class="flex flex-col gap-1 w-full font-bold italic text-lg">
    {fieldLabel}
    {required ? "*" : ""}
    <input
        name={fieldName}
        bind:value
        type="text"
        placeholder={$$props.placeholder}
        class="border-zinc-400 dark:border-zinc-600 bg-transparent p-2 font-normal border"
        {required}
    />
</label>
