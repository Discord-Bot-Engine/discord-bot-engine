<svelte:options customElement={{tag: "dbe-label", shadow: "none"}} />
<script>
    import {Label} from "$lib/components/ui/label/index.js";
    const {name, ...other} = $props()
</script>
<Label {...other} >
    {name}
</Label>
