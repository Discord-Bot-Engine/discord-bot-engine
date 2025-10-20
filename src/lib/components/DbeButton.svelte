<svelte:options customElement={{tag: "dbe-button", shadow: "none"}} />
<script>
    import {Button} from "$lib/components/ui/button/index.js";
    let { click = "() => {}", name, ...other} = $props()
    click = eval(`(${click})`)
</script>
<Button onclick={click} {...other}>
    {name}
</Button>