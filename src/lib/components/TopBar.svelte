<script>
    import * as Menubar from "$lib/components/ui/menubar/index.js";
    import {App} from "$lib/classes/App.svelte.js";
    import Modal from "$lib/components/Modal.svelte";
    import Extension from "$lib/classes/Extension.svelte.js";
    import {BotManager} from "$lib/classes/BotManager.svelte.js";
    import {Debugger} from "$lib/classes/Debugger.svelte.js";
    let extension = $state({type:""})
    let isEditing = $state(false);
    let ref;
    let handlersCopy = {}
    let items = [
        {
            title:"Project",
            items: [
                {
                    title: "Save",
                    onclick: () => {
                        BotManager.saveBotData()
                    }
                },
            ]
        },
        {
            title: "Debug",
            items: [
                {
                    get title(){
                        if(Debugger.isAttached)
                            return "Remove debugger"
                        else return "Attach debugger"
                    },
                    get disable() {
                        return !BotManager.selectedBot.isRunning
                    },
                    onclick: () => {
                        if(Debugger.isAttached)
                            Debugger.removeDebugger(BotManager.selectedBot.path)
                        else
                            Debugger.attachDebugger()
                    }
                }
            ]
        },
        {
            title: "Extensions",
            get items() {
                return BotManager.selectedBot.extensionClasses.map(ext => {
                    return {
                        title: ext.type,
                        onclick: () => {
                            isEditing = true;
                            extension = ext
                            let interval = setInterval(() => {
                                if (!ref) return;
                                clearInterval(interval);
                                const data = BotManager.selectedBot.extensions.get(ext.type)?.data ?? new Map()
                                App.loadUIData(ref, data)
                                handlersCopy = window.handlers
                                Object.freeze(handlersCopy)
                                window.handlers = {}
                                try {
                                    BotManager.selectedBot.extensionClasses.find(ext => ext.type === extension.type)?.open?.(extension, window.handlers)
                                } catch (e) {
                                    alert(`${extension.type}\n${e.stack}`)
                                }
                            }, 10)
                        }
                    }
                })
            }
        }
    ]
    function editExtension() {
        if(!BotManager.selectedBot.extensions.get(extension.type)) BotManager.selectedBot.extensions.set(extension.type, new Extension())
        Object.keys(handlersCopy).forEach(handler => {
            window.handlers[handler] = handlersCopy[handler];
        })
        handlersCopy = window.handlers
        const data = BotManager.selectedBot.extensions.get(extension.type)?.data
        App.saveUIData(ref, data)
        isEditing = false
        try {
            BotManager.selectedBot.extensionClasses.find(ext => ext.type === extension.type)?.close?.(extension)
        }catch (e) {
            alert(`${extension.type}\n${e.stack}`)
        }
    }
</script>

<Menubar.Root class="bg-sidebar border-none rounded-none text-muted-foreground h-fit">
    {#each items as item}
    <Menubar.Menu>
        <Menubar.Trigger class="hover:bg-accent hover:text-foreground text-sm py-0">{item.title}</Menubar.Trigger>
        <Menubar.Content>
            {#each item.items ?? [] as item}
                <Menubar.Item class="text-muted-foreground hover:bg-accent hover:text-foreground text-xs" disabled={item.disable} onclick={item.onclick}>
                    {item.title}
                </Menubar.Item>
            {/each}
        </Menubar.Content>
    </Menubar.Menu>
    {/each}
</Menubar.Root>
<Modal bind:open={isEditing} title={extension.type} onDone={editExtension}>
    <div class="grid gap-4 py-4" bind:this={ref}>
        {@html extension?.html ?? ""}
    </div>
</Modal>