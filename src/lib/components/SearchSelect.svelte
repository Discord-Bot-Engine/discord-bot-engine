<script>
    import CheckIcon from "@lucide/svelte/icons/check";
    import {ChevronDownIcon} from "@lucide/svelte";
    import {onMount, tick} from "svelte";
    import * as Command from "$lib/components/ui/command/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { cn } from "$lib/utils.js";
    import {ScrollArea} from "$lib/components/ui/scroll-area/index.js";
    import {Separator} from "$lib/components/ui/separator/index.js";
    import Translation from "$lib/components/Translation.svelte";
    import {App} from "$lib/classes/App.svelte.js";

    let {values, type = "single", value = $bindable(), onvaluechange=() => {}, ...other} = $props()
    let search = $state("")
    let open = $state(false);
    let triggerRef = $state(null);
    let ref = $state(null);
    if(type === "multiple") value = []
    const selectedValue = $derived(
        type === "single" ? values.find((f) => f.value === value)?.label ?? value : values.filter((f) => value?.includes(f.value))?.map(el => el.label).length ? values.filter((f) => value?.includes(f.value))?.map(el => el.label) : value
    );
    function closeAndFocusTrigger() {
        open = false;
        tick().then(() => {
            triggerRef.focus();
        });
    }
    $effect(() => {
            if(ref)  {
                ref.oninput = (ev) => {
                    if(search.match(/\${(.*?)}/g))
                        value = search
                }
            }
    })
</script>

<Popover.Root bind:open>
    <Popover.Trigger {...other} class="{other.class} w-full" bind:ref={triggerRef}>
        {#snippet child({ props })}
            <Button
                    variant="outline"
                    class="w-full text-left !p-0 !h-fit"
                    {...props}
                    role="combobox"
                    aria-expanded={open}
            >
                <label class="text-ellipsis white-space-nowrap overflow-hidden">
                    {#await App.translate("Select an option", App.selectedLanguage) then text}
                        {selectedValue?.length ? selectedValue : text}
                    {/await}
                </label>
                <ChevronDownIcon class="ml-auto mt-auto mb-auto size-4 shrink-0 opacity-50" />
            </Button>
        {/snippet}
    </Popover.Trigger>
    <Popover.Content class="w-full p-0">
        <Command.Root>
            {#await App.translate("Search option", App.selectedLanguage)}
                <Command.Input bind:ref={ref} bind:value={search} placeholder="Search option" />
            {:then value}
                <Command.Input bind:ref={ref} bind:value={search} placeholder={value} />
            {:catch error}
                <Command.Input bind:ref={ref} bind:value={search} placeholder="Search option" />
            {/await}
            <ScrollArea class="max-h-[30vh]">
            <Command.List class="!overflow-visible !max-h-[200px]">
                <Command.Empty><Translation text="No option found."/></Command.Empty>
                <Command.Group>
                    {#if other.extra}
                    <Command.Item
                            onSelect={() => {closeAndFocusTrigger(); other.extra.onclick()}}
                            class="justify-center"
                    >
                        {other.extra.label}
                    </Command.Item>
                        <Separator/>
                    {/if}
                    {#each values as v}
                            <Command.Item
                                    disabled={v.disabled}
                                    value={v.value}
                                    onSelect={() => {type === "single" ? value = v.value : value.push(v.value); closeAndFocusTrigger(); onvaluechange(value)}}
                            >
                                <CheckIcon
                                        class={cn("mr-2 size-4", (type === "single" ? value !== v.value : !value?.includes(v.value)) && "text-transparent")}
                                />
                                {v.label}
                            </Command.Item>
                        {/each}
                </Command.Group>
            </Command.List>
            </ScrollArea>
        </Command.Root>
    </Popover.Content>
</Popover.Root>