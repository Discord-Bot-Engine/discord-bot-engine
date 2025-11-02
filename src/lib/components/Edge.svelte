<script>
    import {
        getBezierPath,
        BaseEdge,
        useSvelteFlow,
        EdgeLabel,
    } from '@xyflow/svelte';
    import {Button} from "$lib/components/ui/button/index.js";
    import {App} from "$lib/classes/App.svelte.js"

    let {
        id,
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        markerEnd,
        style,
    } = $props();

    let [edgePath, labelX, labelY] = $derived(
        getBezierPath({
            sourceX,
            sourceY,
            sourcePosition,
            targetX,
            targetY,
            targetPosition,
        }),
    );

    const { deleteElements } = useSvelteFlow();

    const onEdgeClick = () => {
        App.updateUndo()
        deleteElements({ edges: [{ id }] });
    }
    let isHovering = $state(false)
    let isHoveringBtn = $state(false)
</script>

<BaseEdge class="!stroke-primary" onmouseenter={() => isHovering = true} onmouseleave={() => isHovering = false} path={edgePath} {markerEnd} {style} />
{#if isHovering || isHoveringBtn}
<EdgeLabel x={labelX} y={labelY} onmouseenter={() => isHoveringBtn = true} onmouseleave={() => isHoveringBtn = false} class="button-edge__label !bg-transparent">
    <Button class="size-3 p-0" onclick={onEdgeClick}> × </Button>
</EdgeLabel>
    {/if}