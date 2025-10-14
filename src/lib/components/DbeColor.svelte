<svelte:options customElement={{tag: "dbe-color", shadow: "none"}} />
<script>
    import {Input} from "$lib/components/ui/input/index.js";

    let { onChange = "() => {}", value, ...others} = $props()
    let state = $state(value)
    onChange = eval(`(${onChange})`)
    let interval = setInterval(() => {
        let value = $host().children[0].children[0].value
        if(value !== undefined) {
            state = value
            onChange(value, $host())
        }
        clearInterval(interval)
    },10)
    let ref;
</script>
<div class="relative">
    <Input value={state} style="background-color: {state}" oninput={(ev) => {state = ev.target.value; onChange(ev.target.value, $host())}} ondblclick={() => ref.click()} {...others} />
    <input type="color" value={state} bind:this={ref} oninput={(ev) => {state = ev.target.value; onChange(ev.target.value, $host())}} class="opacity-0 z-[-1] absolute top-0 left-0" />
</div>
