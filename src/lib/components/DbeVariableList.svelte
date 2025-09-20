<svelte:options customElement={{tag: "dbe-variable-list", shadow: "none"}} />
<script>
    import {App} from "$lib/classes/App.svelte.js";
    let {variableType, ...props} = $props()
    let types = variableType.split(",").map(el => el.toLowerCase())
    let variables = $derived(App.selectedTrigger.variables)
    let ref
    $host().setVariableType = (newType) => {
        types = newType.split(",").map(el => el.toLowerCase());
        ref.setValues(App.selectedTrigger.variables.keys().toArray().sort().filter(v => types.includes(App.selectedTrigger.variables.get(v).toLowerCase()) || types.includes("any")).toString())
    }
</script>
<dbe-select bind:this={ref} {...props} values={variables.keys().toArray().sort().filter(v => types.includes(variables.get(v).toLowerCase()) || types.includes("any")).toString()}/>