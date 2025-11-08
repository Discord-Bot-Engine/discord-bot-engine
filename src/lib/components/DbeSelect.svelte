<svelte:options customElement={{tag: "dbe-select", shadow: "none"}} />
<script>
    import SearchSelect from "$lib/components/SearchSelect.svelte";
    import {onMount} from "svelte";
    let {change = "() => {}", labels="", value, values, ...other} = $props()
    values = values ?? []
    labels = labels.split(",").map(el => el.trim()).filter(el => el)
    let statelabels = $state(labels)
    let statevalues = $state(values.split(","))
    let statevalue = $state(value)
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
    }
    $host().setValue = (value) => {
        if(value === undefined) return;
        statevalue = value
        change(value, $host())
    }
    $host().getValue = () => statevalue
    $host().init = () => {
        change = eval(`(${change})`)
        change(statevalue, $host())
    }
</script>
<SearchSelect {...other} values={customSort(statevalues.filter(el => el.trim())).map((el,i)=>({label: statelabels[i] ?? el, value:el}))} onvaluechange={(v) => change(v, $host())} bind:value={statevalue}/>
