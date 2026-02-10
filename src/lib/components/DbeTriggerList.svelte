<svelte:options customElement={{tag: "dbe-trigger-list", shadow: "none"}} />
<script>
    import {BotManager} from "$lib/classes/BotManager.svelte.js";
    import SearchSelect from "$lib/components/SearchSelect.svelte";
    let {triggerType, change = "() => {}", ...other} = $props()
    let types = $state(triggerType.split(",").map(el => el.toLowerCase()))
    let triggers = $derived(BotManager.selectedBot.triggers)
    let statevalue = $state(undefined)
    let statevalues = $derived(triggers.filter(v => types.includes(v.type.toLowerCase()) || types.includes("any")).sort((a, b) => a.name.localeCompare(b.name)))
    let ref
    $host().setTriggerType = (newType) => {
        types = [newType].flat().split(",").map(el => el.toLowerCase());
        ref.setValues(triggers.filter(v => types.includes(v.type.toLowerCase()) || types.includes("any")).map(el => el.name).sort())
    }
    $host().setValue = (value) => {
        if(value === undefined) return;
        statevalue = value
    }
    $host().getValue = () => statevalue
    $host().init = () => {
        change = new Function(`return (${change})`)()
        change(statevalue, $host())
    }
</script>
<SearchSelect {...other} values={statevalues.sort((a, b) => a.name.localeCompare(b.name)).map((el)=>({label: el.name, value:el.id}))} onvaluechange={(v) => change(v, $host())} bind:value={statevalue}/>
