<script>
    import {Handle, Position, useSvelteFlow} from '@xyflow/svelte';
    import {App} from "$lib/classes/App.svelte.js"
    import {NodeResizer} from "@xyflow/svelte";
    let { id, data, selected } = $props();
</script>

{#if selected}
    <NodeResizer class="!border-primary !bg-primary" width="" minWidth={120} minHeight={100} />
{/if}
    <div class="text-lg w-full h-full">
<input class="w-full !outline-none text-muted-foreground nodrag" value={data.get("text") ?? ""}
       oninput={(evt) => {
           data.set("text", evt.target.value)
      }}
/>
</div>