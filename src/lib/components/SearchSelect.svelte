<script lang="ts">
    import CheckIcon from "@lucide/svelte/icons/check";
    import {ChevronDownIcon} from "@lucide/svelte";
    import { tick } from "svelte";
    import * as Command from "$lib/components/ui/command/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { cn } from "$lib/utils.js";
    import {ScrollArea} from "$lib/components/ui/scroll-area/index.js";

    let {values, type = "single", value = $bindable(), onValueChange=() => {}, ...prop} = $props()
    let open = $state(false);
    let triggerRef = $state<HTMLButtonElement>(null!);
    if(type === "multiple") value = []
    const selectedValue = $derived(
        type === "single" ? values.find((f) => f.value === value)?.label : values.filter((f) => value?.includes(f.value))?.map(el => el.label)
    );
    function closeAndFocusTrigger() {
        open = false;
        tick().then(() => {
            triggerRef.focus();
        });
    }
</script>

<Popover.Root bind:open>
    <Popover.Trigger {...prop} class="{prop.class} w-full" bind:ref={triggerRef}>
        {#snippet child({ props })}
            <Button
                    variant="outline"
                    class="w-full text-left"
                    {...props}
                    role="combobox"
                    aria-expanded={open}
            >
                <label class="text-ellipsis white-space-nowrap overflow-hidden">{selectedValue || "Select an option"}</label>
                <ChevronDownIcon class="ml-auto size-4 shrink-0 opacity-50" />
            </Button>
        {/snippet}
    </Popover.Trigger>
    <Popover.Content class="w-full p-0">
        <Command.Root>
            <Command.Input placeholder="Search option" />
            <ScrollArea class="max-h-[30vh]">
            <Command.List class="!overflow-visible !max-h-[200px]">
                <Command.Empty>No option found.</Command.Empty>
                <Command.Group>
                        {#each values as v}
                            <Command.Item
                                    disabled={v.disabled}
                                    value={v.value}
                                    onSelect={() => {type === "single" ? value = v.value : value.push(v.value); closeAndFocusTrigger(); onValueChange(value)}}
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