<svelte:options customElement={{tag: "dbe-label", shadow: "none"}} />
<script>
    import {Label} from "$lib/components/ui/label/index.js";
    import Translation from "$lib/components/Translation.svelte";
    const {name, ...other} = $props()
</script>
<Label {...other} >
    <Translation text={name} />
</Label>
