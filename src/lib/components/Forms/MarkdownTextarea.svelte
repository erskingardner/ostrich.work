<script lang="ts">
    import { browser } from "$app/environment";
    import { cleanMarkdown } from "$lib/utils/markdown";
    import { onMount } from "svelte";

    export let value: string = "";
    export let fieldName: string;
    export let fieldLabel: string;
    let preview: string = "";
    let previewHeight: number;

    let previewElem: HTMLElement | null;
    let fieldElem: HTMLElement | null;

    onMount(() => {
        preview = cleanMarkdown(value);
        previewElem = document.getElementById(`${fieldName}PreviewContainer`);
        previewHeight = previewElem?.scrollHeight || 0;
        fieldElem = document.getElementById(fieldName);
        matchContentHeight({ target: fieldElem });
    });

    function matchContentHeight(event: any) {
        previewElem = document.getElementById(`${fieldName}PreviewContainer`);
        previewHeight = previewElem?.scrollHeight || 0;
        event.target.style.height = (previewHeight < 128 ? 128 : previewHeight) + "px";
    }

    $: if (value.length > 0) preview = cleanMarkdown(value);
</script>

<label for={fieldName} class="flex flex-col gap-1 w-full h-full font-bold italic text-lg">
    {fieldLabel} *
    <textarea
        name={fieldName}
        id={fieldName}
        bind:value
        on:input={matchContentHeight}
        placeholder={$$props.placeholder}
        class="border-zinc-400 dark:border-zinc-600 bg-transparent px-2 flex-grow py-1 block font-normal border w-full text-base"
        required
    />
</label>
<div class="flex flex-col gap-1 w-full">
    <span class="font-bold italic text-lg">{fieldLabel} Preview</span>
    <div
        id="{fieldName}PreviewContainer"
        class="markdownContent w-full border border-zinc-400 dark:border-zinc-600 bg-transparent px-2 py-1 text-base"
    >
        {@html preview}
    </div>
</div>
