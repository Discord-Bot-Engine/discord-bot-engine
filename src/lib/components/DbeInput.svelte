<svelte:options customElement={{tag: "dbe-input", shadow: "none"}} />
<script>
    import {Input} from "$lib/components/ui/input/index.js";
    import {Textarea} from "$lib/components/ui/textarea/index.js";
    import {onMount} from "svelte";
    let { change = "() => {}", multiline=false, value, ...others} = $props()
    let state = $state(value)
    if(!Object.getOwnPropertyDescriptor($host(), "value")) Object.defineProperty($host(), "value", {
        set(x) {
            state = x;
            change(x, $host())
        },
        get() {
            return state
        }
    })
    $host().init = () => {
        change = eval(`(${change})`)
        change(statevalue, $host())
    }
</script>
{#if multiline}
    <Textarea value={state} oninput={(ev) => change(ev.target.value, $host())} {...others} style="overflow:hidden" />
{:else}
    <Input value={state} oninput={(ev) => change(ev.target.value, $host())} {...others} />
{/if}
