<svelte:options customElement={{tag: "dbe-input", shadow: "none"}} />
<script>
    import {Input} from "$lib/components/ui/input/index.js";
    import {Textarea} from "$lib/components/ui/textarea/index.js";
    let { onChange = "() => {}", multiline=false, value, ...others} = $props()
    let state = $state(value)
    onChange = eval(`(${onChange})`)
    let interval = setInterval(() => {
        let value = $host().children[0].value
        if(value !== undefined)
            onChange(value)
        clearInterval(interval)
    },10)
</script>
{#if multiline}
    <Textarea value={state} oninput={(ev) => onChange(ev.target.value)} {...others} />
{:else}
    <Input value={state} oninput={(ev) => onChange(ev.target.value)} {...others} />
{/if}
