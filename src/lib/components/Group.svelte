<script>
    import {Handle, Position, useSvelteFlow} from '@xyflow/svelte';
    import {App} from "$lib/classes/App.svelte.js"
    import {NodeResizer} from "@xyflow/svelte";
    import Translation from "$lib/components/Translation.svelte";
    import {onMount} from "svelte";
    import {BotManager} from "$lib/classes/BotManager.svelte.js";
    let { id, data, selected } = $props();
    const group = $derived(App.selectedTrigger.actions.find(act => act.id === id));
    $effect(() => {
        if(group) {
            group.width = data.get("width") ?? 120
            group.height = data.get("height") ?? 100
        }
    })
</script>

{#if selected}
    <NodeResizer onResizeStart={() => {
        BotManager.selectedBot.markAsModified(App.selectedTrigger.id)
        App.updateUndo()
    }} onResize={(ev, {width, height}) => {
        data.set("width", width);
        data.set("height", height);
    }} class="!border-primary !bg-primary" minWidth={120} minHeight={100} />
{/if}
    <div class="text-3xl w-full h-full ">
        {#snippet groupSnip(text)}
<input class="w-full !outline-none text-primary nodrag" placeholder={text} value={data.get("text") ?? ""} noVariables
       oninput={(evt) => {
           data.set("text", evt.target.value)
      }}
       onfocus={() => {
          BotManager.selectedBot.markAsModified(App.selectedTrigger.id)
          App.updateUndo()
      }}
/>
            {/snippet}
        <Translation text="Group" el={groupSnip}/>
</div>