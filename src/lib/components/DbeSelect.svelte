<svelte:options customElement={{tag: "dbe-select", shadow: "none"}} />
<script>
    import {App} from "$lib/classes/App.svelte.js"
    import SearchSelect from "$lib/components/SearchSelect.svelte";
    import {onMount} from "svelte";
    let {change = "() => {}", value, values, ...other} = $props()
    values = values ?? []
    let init = false
    let statevalues = $state(values.split(","))
    let statevalue = $state(value)
    let translatedvalues = $state([])
    async function translate() {
        translatedvalues = await Promise.all(customSort(statevalues.filter(el => el.trim())).map((el)=>({label: el, value:el})))
    }
    function customSort(arr) {
        if (arr.every(item => !isNaN(item))) {
            return arr.sort((a, b) => a - b);
        } else {
            return arr.map(String).sort((a, b) => a.localeCompare(b));
        }
    }
    $host().setValues = (newValues) => {
        statevalues = newValues
        translate()
    }
    $host().setValue = (value) => {
        if(value === undefined) return;
        statevalue = value
        if(init) change(value, $host())
    }
    $host().getValue = () => statevalue
    $host().init = () => {
        translate()
        init = true
        change = new Function(`return (${change})`)()
        change(statevalue, $host())
    }
</script>
<SearchSelect {...other} values={translatedvalues} onvaluechange={(v) => change(v, $host())} bind:value={statevalue}/>
