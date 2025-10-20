<svelte:options customElement={{tag: "dbe-input", shadow: "none"}} />
<script>
    import {Input} from "$lib/components/ui/input/index.js";
    import {Textarea} from "$lib/components/ui/textarea/index.js";
    let { change = "() => {}", multiline=false, value, ...others} = $props()
    let state = $state(value)
    change = eval(`(${change})`)
    let interval = setInterval(() => {
        let value = $host().children[0].value
        if(value !== undefined)
            change(value, $host())
        clearInterval(interval)
    },10)
</script>
{#if multiline}
    <Textarea value={state} oninput={(ev) => change(ev.target.value, $host())} {...others} />
{:else}
    <Input value={state} oninput={(ev) => change(ev.target.value, $host())} {...others} />
{/if}
