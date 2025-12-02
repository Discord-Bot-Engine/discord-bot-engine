<svelte:options customElement={{tag: "dbe-select", shadow: "none"}} />
<script>
    import {App} from "$lib/classes/App.svelte.js"
    import SearchSelect from "$lib/components/SearchSelect.svelte";
    import {onMount} from "svelte";
    let {change = "() => {}", labels="", value, values, ...other} = $props()
    values = values ?? []
    labels = labels.split(",").map(el => el.trim()).filter(el => el)
    let init = false
    let statelabels = $state(labels)
    let statevalues = $state(values.split(","))
    let statevalue = $state(value)
    let translatedvalues = $state([])
    async function translate() {
        translatedvalues = await Promise.all(customSort(statevalues.filter(el => el.trim())).map(async (el,i)=>({label: await App.translate(statelabels[i] ?? el, App.selectedLanguage), value:el})))
    }
    function customSort(arr) {
        if (arr.every(item => !isNaN(item))) {
            return arr.sort((a, b) => a - b);
        } else {
            return arr.map(String).sort((a, b) => a.localeCompare(b));
        }
    }
    $host().setLabels = (newLabels) => {
        statelabels = newLabels
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
        change = eval(`(${change})`)
        change(statevalue, $host())
    }
</script>
<SearchSelect {...other} values={translatedvalues} onvaluechange={(v) => change(v, $host())} bind:value={statevalue}/>
