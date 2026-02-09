<svelte:options customElement={{tag: "dbe-code", shadow: "none"}} />
<script>
    import CodeMirror from "svelte-codemirror-editor";
    import { javascript } from "@codemirror/lang-javascript";
    import { tokyoNightStorm } from '@fsegurai/codemirror-theme-bundle'
    let {change = "() => {}", value = "", ...other} = $props()
    let init = false
    let statevalue = $state(value)
    $host().setValue = (value) => {
        if(value === undefined) return;
        statevalue = value
        if(init) change(value, $host())
    }
    $host().getValue = () => statevalue
    $host().init = () => {
        init = true
        change = eval(`(${change})`)
        change(statevalue, $host())
    }
</script>
<CodeMirror bind:value={statevalue} onchange={(v) => {change(v, $host())}} lang={javascript()} theme={tokyoNightStorm} {...other} />
