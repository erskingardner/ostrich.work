<script lang="ts">
    import { cleanMarkdown } from '$lib/utils/markdown';

    export let value: string ='';
    export let fieldName: string;
    export let fieldLabel: string;
    let preview: string = '';

    function matchContentHeight(event:any) {
        const previewHeight = document.getElementById(`${fieldName}PreviewContainer`)?.scrollHeight || 0;
        event.target.style.height = (previewHeight < 128 ? 128 : previewHeight) + "px";
    }

    $: if(value.length > 0) preview = cleanMarkdown(value);
</script>


<label for={fieldName} class="flex flex-col gap-1 w-full h-full font-bold italic text-lg">
    {fieldLabel} *
    <textarea
        name={fieldName}
        bind:value={value}
        on:input={matchContentHeight}
        placeholder={$$props.placeholder}
        class="border-zinc-400 dark:border-zinc-600 bg-transparent px-2 flex-grow py-1 block font-normal border w-full text-base"
        required
    />
</label>
<div class="flex flex-col gap-1 w-full">
    <span class="font-bold italic text-lg">{fieldLabel} Preview</span>
    <div id="{fieldName}PreviewContainer" class="w-full border border-zinc-400 dark:border-zinc-600 bg-transparent px-2 py-1 text-base">{@html preview}</div>
</div>