<svelte:options customElement={{tag:"dbe-action-list", shadow:"none"}} />
<script>
    import Actions from "$lib/components/Actions.svelte";
    let {name, title} = $props()
    let state = $state([])
    $host().getItems = () => state
    $host().setItems = (items) => state = items
</script>
<Actions actions={state} {title} />