<script>
    import {
        getBezierPath,
        BaseEdge,
        useSvelteFlow,
        EdgeLabel,
    } from '@xyflow/svelte';
    import {Button} from "$lib/components/ui/button/index.js";

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
        deleteElements({ edges: [{ id }] });
    }
</script>

<BaseEdge class="!stroke-primary" path={edgePath} {markerEnd} {style} />
<EdgeLabel x={labelX} y={labelY} class="button-edge__label !bg-transparent">
    <Button class="size-3 p-0" onclick={onEdgeClick}> × </Button>
</EdgeLabel>