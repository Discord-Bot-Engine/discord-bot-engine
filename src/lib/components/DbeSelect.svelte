<svelte:options customElement={{tag: "dbe-select", shadow: "none"}} />
<script>
    import SearchSelect from "$lib/components/SearchSelect.svelte";
    let {onChange = "() => {}", value, values, ...other} = $props()
    onChange = eval(`(${onChange})`)
    values = values ?? []
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
        onChange(statevalue)
    }, 50)
</script>
<SearchSelect {...other} values={customSort(statevalues.split(",").filter(el => el.trim())).map(el=>({label:el, value:el}))} onValueChange={onChange} bind:value={statevalue}/>
