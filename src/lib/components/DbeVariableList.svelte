<svelte:options customElement={{tag: "dbe-variable-list", shadow: "none"}} />
<script>
    import {App} from "$lib/classes/App.svelte.js";
    let {variableType, ...other} = $props()
    let types = variableType.split(",").map(el => el.toLowerCase())
    let variables = $derived(App.selectedTrigger.variables)
    let ref
    $host().setVariableType = (newType) => {
        types = [newType].flat().map(el => el.toLowerCase());
        ref.setValues(App.selectedTrigger.variables.keys().toArray().sort().filter(v => types.includes(App.selectedTrigger.variables.get(v).toLowerCase()) || types.includes("any")))
    }
</script>
<dbe-select check="false" bind:this={ref} {...other} values={variables.keys().toArray().sort().filter(v => types.includes(variables.get(v).toLowerCase()) || types.includes("any")).toString()}/>