<script>
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { CodeXmlIcon, HouseIcon, SettingsIcon, BlocksIcon, PaletteIcon, CheckIcon, LanguagesIcon } from '@lucide/svelte';
	import { page } from '$app/state';
	import {Button} from "$lib/components/ui/button/index.js";
	import {App} from "$lib/classes/App.svelte.js"
	import {cn} from "$lib/utils.js";
	import {PluginManager} from "$lib/classes/PluginManager.svelte.js";
	import Translation from "$lib/components/Translation.svelte";
	import {ScrollArea} from "$lib/components/ui/scroll-area/index.js";

	const items = [
		{
			title: 'Home',
			url: '/',
			icon: HouseIcon
		},
		{
			title: 'Editor',
			url: '/editor',
			icon: CodeXmlIcon
		},
		{
			title: 'Settings',
			url: '/settings',
			icon: SettingsIcon
		},
		{
			title: 'Plugins',
			url: '/plugins',
			icon: BlocksIcon
		}
	];
	function setTheme(t) {
		localStorage.setItem('theme', t);
		if(t === null) localStorage.removeItem('theme');
		App.selectedTheme = t;
	}
	function setLanguage(l) {
		localStorage.setItem('language', l);
		App.selectedLanguage = l;
	}
	const languages = [
		{ label: "Afrikaans", value: "af" },
		{ label: "Albanian", value: "sq" },
		{ label: "Amharic", value: "am" },
		{ label: "Arabic", value: "ar" },
		{ label: "Armenian", value: "hy" },
		{ label: "Azerbaijani", value: "az" },
		{ label: "Basque", value: "eu" },
		{ label: "Belarusian", value: "be" },
		{ label: "Bengali", value: "bn" },
		{ label: "Bosnian", value: "bs" },
		{ label: "Bulgarian", value: "bg" },
		{ label: "Catalan", value: "ca" },
		{ label: "Cebuano", value: "ceb" },
		{ label: "Chinese (Simplified)", value: "zh-CN" },
		{ label: "Chinese (Traditional)", value: "zh-TW" },
		{ label: "Corsican", value: "co" },
		{ label: "Croatian", value: "hr" },
		{ label: "Czech", value: "cs" },
		{ label: "Danish", value: "da" },
		{ label: "Dutch", value: "nl" },
		{ label: "English", value: "en" },
		{ label: "Esperanto", value: "eo" },
		{ label: "Estonian", value: "et" },
		{ label: "Finnish", value: "fi" },
		{ label: "French", value: "fr" },
		{ label: "Frisian", value: "fy" },
		{ label: "Galician", value: "gl" },
		{ label: "Georgian", value: "ka" },
		{ label: "German", value: "de" },
		{ label: "Greek", value: "el" },
		{ label: "Gujarati", value: "gu" },
		{ label: "Haitian Creole", value: "ht" },
		{ label: "Hausa", value: "ha" },
		{ label: "Hawaiian", value: "haw" },
		{ label: "Hebrew", value: "he" },
		{ label: "Hindi", value: "hi" },
		{ label: "Hmong", value: "hmn" },
		{ label: "Hungarian", value: "hu" },
		{ label: "Icelandic", value: "is" },
		{ label: "Igbo", value: "ig" },
		{ label: "Indonesian", value: "id" },
		{ label: "Irish", value: "ga" },
		{ label: "Italian", value: "it" },
		{ label: "Japanese", value: "ja" },
		{ label: "Javanese", value: "jv" },
		{ label: "Kannada", value: "kn" },
		{ label: "Kazakh", value: "kk" },
		{ label: "Khmer", value: "km" },
		{ label: "Korean", value: "ko" },
		{ label: "Kurdish", value: "ku" },
		{ label: "Kyrgyz", value: "ky" },
		{ label: "Lao", value: "lo" },
		{ label: "Latin", value: "la" },
		{ label: "Latvian", value: "lv" },
		{ label: "Lithuanian", value: "lt" },
		{ label: "Luxembourgish", value: "lb" },
		{ label: "Macedonian", value: "mk" },
		{ label: "Malagasy", value: "mg" },
		{ label: "Malay", value: "ms" },
		{ label: "Malayalam", value: "ml" },
		{ label: "Maltese", value: "mt" },
		{ label: "Maori", value: "mi" },
		{ label: "Marathi", value: "mr" },
		{ label: "Mongolian", value: "mn" },
		{ label: "Myanmar (Burmese)", value: "my" },
		{ label: "Nepali", value: "ne" },
		{ label: "Norwegian", value: "no" },
		{ label: "Nyanja (Chichewa)", value: "ny" },
		{ label: "Odia (Oriya)", value: "or" },
		{ label: "Pashto", value: "ps" },
		{ label: "Persian", value: "fa" },
		{ label: "Polish", value: "pl" },
		{ label: "Portuguese", value: "pt" },
		{ label: "Punjabi", value: "pa" },
		{ label: "Romanian", value: "ro" },
		{ label: "Russian", value: "ru" },
		{ label: "Samoan", value: "sm" },
		{ label: "Scots Gaelic", value: "gd" },
		{ label: "Serbian", value: "sr" },
		{ label: "Sesotho", value: "st" },
		{ label: "Shona", value: "sn" },
		{ label: "Sindhi", value: "sd" },
		{ label: "Sinhala", value: "si" },
		{ label: "Slovak", value: "sk" },
		{ label: "Slovenian", value: "sl" },
		{ label: "Somali", value: "so" },
		{ label: "Spanish", value: "es" },
		{ label: "Sundanese", value: "su" },
		{ label: "Swahili", value: "sw" },
		{ label: "Swedish", value: "sv" },
		{ label: "Tagalog (Filipino)", value: "tl" },
		{ label: "Tajik", value: "tg" },
		{ label: "Tamil", value: "ta" },
		{ label: "Tatar", value: "tt" },
		{ label: "Telugu", value: "te" },
		{ label: "Thai", value: "th" },
		{ label: "Turkish", value: "tr" },
		{ label: "Turkmen", value: "tk" },
		{ label: "Ukrainian", value: "uk" },
		{ label: "Urdu", value: "ur" },
		{ label: "Uyghur", value: "ug" },
		{ label: "Uzbek", value: "uz" },
		{ label: "Vietnamese", value: "vi" },
		{ label: "Welsh", value: "cy" },
		{ label: "Xhosa", value: "xh" },
		{ label: "Yiddish", value: "yi" },
		{ label: "Yoruba", value: "yo" },
		{ label: "Zulu", value: "zu" }
	];

</script>

<Sidebar.Root class="border-none" collapsible="icon">
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Discord Bot Engine</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each items as item, i (i)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton class={page.url.pathname === item.url ? "!bg-primary !text-primary-foreground" : ""}>
								{#snippet child({ props })}
									{#await App.translate(item.title, App.selectedLanguage)}
									<a
										title={item.title}
										href={item.url}
										{...props}>
										<item.icon />
									</a>
										{:then title}
										<a
												{title}
												href={item.url}
												{...props}>
											<item.icon />
										</a>
										{:catch error}
										<a
												title={item.title}
												href={item.url}
												{...props}>
											<item.icon />
										</a>
									{/await}
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
					<Sidebar.MenuItem>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger><Sidebar.MenuButton>
								{#snippet child({ props })}
									{#await App.translate("Theme", App.selectedLanguage)}
									<Button title="Theme" class="w-8 h-8" variant="ghost"
											>
										<PaletteIcon/>
									</Button>
									{:then title}
										<Button {title} class="w-8 h-8" variant="ghost"
										>
											<PaletteIcon/>
										</Button>
										{:catch error}
										<Button title="Theme" class="w-8 h-8" variant="ghost"
										>
											<PaletteIcon/>
										</Button>
									{/await}
								{/snippet}
							</Sidebar.MenuButton></DropdownMenu.Trigger>
							<DropdownMenu.Content side="right">
								<DropdownMenu.Group>
									<ScrollArea class="max-h-[50vh] [&>div]:max-h-[50vh]">
									<DropdownMenu.Item class="!text-xs" onclick={() => setTheme(null)}><CheckIcon
											class={cn(`mr-2 size-4 ${App.selectedTheme === null ? "" : "opacity-0"}`)}
									/><Translation text="Default"/></DropdownMenu.Item>
									{#each App.themes as theme}
										<DropdownMenu.Item class="!text-xs" onclick={() => setTheme(theme)}><CheckIcon
												class={cn(`mr-2 size-4 ${App.selectedTheme === theme ? "" : "opacity-0"}`)}
										/>{@const name = theme.split("\\").join("/").split("/").at(-1)}
											{PluginManager.isThemeDownloaded(name.slice(40)) ? name.slice(40) : name}</DropdownMenu.Item>
									{/each}
												</ScrollArea>
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem>
						<DropdownMenu.Root>
												<DropdownMenu.Trigger><Sidebar.MenuButton>
												{#snippet child({ props })}
												{#await App.translate("Language", App.selectedLanguage)}
												<Button title="Language" class="w-8 h-8" variant="ghost"
												>
												<LanguagesIcon/>
												</Button>
												{:then title}
												<Button {title} class="w-8 h-8" variant="ghost"
												>
												<LanguagesIcon/>
												</Button>
												{:catch error}
												<Button title="Theme" class="w-8 h-8" variant="ghost"
												>
												<LanguagesIcon/>
												</Button>
												{/await}
												{/snippet}
												</Sidebar.MenuButton></DropdownMenu.Trigger>
												<DropdownMenu.Content side="right">
												<DropdownMenu.Group>
												<ScrollArea class="max-h-[50vh] [&>div]:max-h-[50vh]">
												{#each languages as language}
												<DropdownMenu.Item class="!text-xs" onclick={() => setLanguage(language.value)}><CheckIcon
												class={cn(`mr-2 size-4 ${App.selectedLanguage === language.value ? "" : "opacity-0"}`)}
												/>
													{#snippet langSnip(label)}
														{label[0].toUpperCase()}{label.slice(1)}
												{/snippet}
												<Translation text={language.label} el={langSnip}/>
												</DropdownMenu.Item>
									{/each}
												</ScrollArea>
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>