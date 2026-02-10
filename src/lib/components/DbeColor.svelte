<svelte:options customElement={{tag: "dbe-color", shadow: "none"}} />
<script>
    import {Input} from "$lib/components/ui/input/index.js";

    let { change = "() => {}", value, ...others} = $props()
    let state = $state(value)
    $host().init = () => {
        change = new Function(`return (${change})`)()
        change(state, $host())
    }
    let ref;
</script>
<div class="relative">
    <Input bind:value={state} style="background-color: {state}" oninput={(ev) => {state = ev.target.value; change(ev.target.value, $host())}} ondblclick={() => ref.click()} {...others} />
    <input type="color" bind:value={state} bind:this={ref} oninput={(ev) => {state = ev.target.value; change(ev.target.value, $host())}} class="opacity-0 z-[-1] absolute top-0 left-0" />
</div>
