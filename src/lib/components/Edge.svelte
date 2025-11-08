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
</script>

<BaseEdge class="!stroke-primary" onclick={onEdgeClick} path={edgePath} {markerEnd} {style} />
