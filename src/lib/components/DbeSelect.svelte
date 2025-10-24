<svelte:options customElement={{tag: "dbe-select", shadow: "none"}} />
<script>
    import SearchSelect from "$lib/components/SearchSelect.svelte";
    let {change = "() => {}", labels="", value, values, ...other} = $props()
    change = eval(`(${change})`)
    values = values ?? []
    labels = labels.split(",").map(el => el.trim()).filter(el => el)
    let statevalues = $state(values)
    let statevalue = $state(value)
    function customSort(arr) {
        if (arr.every(item => !isNaN(item))) {
            return arr.sort((a, b) => a - b);
        } else {
            return arr.map(String).sort((a, b) => a.localeCompare(b));
        }
    }
    $host().setValues = (newValues) => {
        statevalues = newValues
    }
    $host().setValue = (value) => {
        if(value === undefined) return;
        statevalue = value
    }
    $host().getValue = () => statevalue
    setTimeout(() => {
        change(statevalue, $host())
    }, 50)
</script>
<SearchSelect {...other} values={customSort(statevalues.split(",").filter(el => el.trim())).map((el,i)=>({label: labels[i] ?? el, value:el}))} onvaluechange={(v) => change(v, $host())} bind:value={statevalue}/>
