<svelte:options customElement={{tag: "dbe-label", shadow: "none"}} />
<script>
    import {Label} from "$lib/components/ui/label/index.js";
    const {name, children, ...props} = $props()
</script>
<Label {...props} class="{props.class}" >
    {name}
</Label>
