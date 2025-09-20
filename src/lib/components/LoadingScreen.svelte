<script>
    let {isLoading} = $props()
    import {Loader2Icon} from "@lucide/svelte";
</script>
{#if isLoading}
    <div class="w-screen h-screen absolute top-0 left-0 flex flex-col justify-center items-center bg-black/50 z-10">
        <Loader2Icon class="animate-spin text-primary size-14" />
        <span class="text-lg font-semibold">Loading...</span>
    </div>
{/if}