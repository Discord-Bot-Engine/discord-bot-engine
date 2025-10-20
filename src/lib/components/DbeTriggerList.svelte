<svelte:options customElement={{tag: "dbe-trigger-list", shadow: "none"}} />
<script>
    import {BotManager} from "$lib/classes/BotManager.svelte.js";
    let {triggerType, ...other} = $props()
    let types = triggerType.split(",").map(el => el.toLowerCase())
    let triggers = $derived(BotManager.selectedBot.triggers)
    let ref
    $host().setVariableType = (newType) => {
        types = newType.split(",").map(el => el.toLowerCase());
        ref.setValues(triggers.filter(v => types.includes(v.type.toLowerCase()) || types.includes("any")).map(el => el.name).sort().toString())
    }
</script>
<dbe-select bind:this={ref} {...other} labels={triggers.filter(v => types.includes(v.type.toLowerCase()) || types.includes("any")).map(el => el.name).sort().toString()} values={triggers.filter(v => types.includes(v.type.toLowerCase()) || types.includes("any")).sort((a, b) => a.name.localeCompare(b.name)).map(el => el.id).toString()}/>