<script>
    import {Handle, Position, useSvelteFlow} from '@xyflow/svelte';
    import {App} from "$lib/classes/App.svelte.js"
    import {NodeResizer} from "@xyflow/svelte";
    let { id, data, selected } = $props();
    const group = $derived(App.selectedTrigger.actions.find(act => act.id === id));
    if(group) {
        group.width = data.get("width")
        group.height = data.get("height")
    }
</script>

{#if selected}
    <NodeResizer onResize={(ev, {width, height}) => {
        data.set("width", width);
        data.set("height", height);
    }} class="!border-primary !bg-primary" minWidth={120} minHeight={100} />
{/if}
    <div class="text-lg w-full h-full">
<input class="w-full !outline-none text-secondary-foreground nodrag" placeholder="Group" value={data.get("text") ?? ""}
       oninput={(evt) => {
           data.set("text", evt.target.value)
      }}
/>
</div>