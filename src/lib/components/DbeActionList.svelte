<svelte:options customElement={{tag:"dbe-action-list", shadow:"none"}} />
<script>
    import Actions from "$lib/components/Actions.svelte";
    import {App} from '$lib/classes/App.svelte.js';
    let {name, title} = $props()
    let state = $state([])
    $host().getItems = () => state
    $host().setItems = (items) => state = items
</script>
<Actions actions={state} {title} />