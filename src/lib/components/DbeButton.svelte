<svelte:options customElement={{tag: "dbe-button", shadow: "none"}} />
<script>
    import {Button} from "$lib/components/ui/button/index.js";
    import Translation from "$lib/components/Translation.svelte";
    let { click = "() => {}", name, ...other} = $props()
    click = new Function(`return (${click})`)()

</script>
<Button onclick={click} {...other}>
    <Translation text={name} />
</Button>