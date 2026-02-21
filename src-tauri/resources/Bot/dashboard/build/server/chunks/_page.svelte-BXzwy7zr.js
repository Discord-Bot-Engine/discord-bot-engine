import { p as push, e as pop, u as bind_props, x as spread_props, q as spread_attributes, t as clsx, k as stringify, g as escape_html, o as ensure_array_like, v as copy_payload, w as assign_payload, j as attr, f as attr_class, y as props_id } from './index-Ct39Tk77.js';
import { S as Scroll_area } from './card-title-CUAsGUmh.js';
import { I as Input_1, D as Dialog, f as Dialog_title } from './Input-CIRWi-sJ.js';
import { s as setSidebar, T as TooltipProviderState, S as SIDEBAR_COOKIE_NAME, a as SIDEBAR_COOKIE_MAX_AGE, b as SIDEBAR_WIDTH, c as SIDEBAR_WIDTH_ICON, u as useSidebar, d as Sheet_content, e as SIDEBAR_WIDTH_MOBILE, f as Sidebar_menu_button } from './sheet-content-Pn2foTu1.js';
import { d as boxWith, c as cn, B as Button, a as createId, m as mergeProps } from './use-id-r7Hqn7_D.js';
import { I as Icon, d as DialogDescriptionState } from './x-BKdX8_Hm.js';
import './events-ClNAEvdo.js';

function Sidebar_content($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out.push(`<div${spread_attributes(
    {
      "data-slot": "sidebar-content",
      "data-sidebar": "content",
      class: clsx(cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className)),
      ...restProps
    }
  )}>`);
  children?.($$payload);
  $$payload.out.push(`<!----></div>`);
  bind_props($$props, { ref });
  pop();
}
function Sidebar_group_content($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out.push(`<div${spread_attributes(
    {
      "data-slot": "sidebar-group-content",
      "data-sidebar": "group-content",
      class: clsx(cn("w-full text-sm", className)),
      ...restProps
    }
  )}>`);
  children?.($$payload);
  $$payload.out.push(`<!----></div>`);
  bind_props($$props, { ref });
  pop();
}
function Sidebar_group_label($$payload, $$props) {
  push();
  let {
    ref = null,
    children,
    child,
    class: className,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const mergedProps = {
    class: cn("text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0", className),
    "data-slot": "sidebar-group-label",
    "data-sidebar": "group-label",
    ...restProps
  };
  if (child) {
    $$payload.out.push("<!--[-->");
    child($$payload, { props: mergedProps });
    $$payload.out.push(`<!---->`);
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<div${spread_attributes({ ...mergedProps })}>`);
    children?.($$payload);
    $$payload.out.push(`<!----></div>`);
  }
  $$payload.out.push(`<!--]-->`);
  bind_props($$props, { ref });
  pop();
}
function Sidebar_group($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out.push(`<div${spread_attributes(
    {
      "data-slot": "sidebar-group",
      "data-sidebar": "group",
      class: clsx(cn("relative flex w-full min-w-0 flex-col p-2", className)),
      ...restProps
    }
  )}>`);
  children?.($$payload);
  $$payload.out.push(`<!----></div>`);
  bind_props($$props, { ref });
  pop();
}
function Dialog_description($$payload, $$props) {
  push();
  const uid = props_id($$payload);
  let {
    id = createId(uid),
    children,
    child,
    ref = null,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const descriptionState = DialogDescriptionState.create({
    id: boxWith(() => id),
    ref: boxWith(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, descriptionState.props);
  if (child) {
    $$payload.out.push("<!--[-->");
    child($$payload, { props: mergedProps });
    $$payload.out.push(`<!---->`);
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<div${spread_attributes({ ...mergedProps })}>`);
    children?.($$payload);
    $$payload.out.push(`<!----></div>`);
  }
  $$payload.out.push(`<!--]-->`);
  bind_props($$props, { ref });
  pop();
}
function Tooltip_provider$1($$payload, $$props) {
  push();
  let {
    children,
    delayDuration = 700,
    disableCloseOnTriggerClick = false,
    disableHoverableContent = false,
    disabled = false,
    ignoreNonKeyboardFocus = false,
    skipDelayDuration = 300
  } = $$props;
  TooltipProviderState.create({
    delayDuration: boxWith(() => delayDuration),
    disableCloseOnTriggerClick: boxWith(() => disableCloseOnTriggerClick),
    disableHoverableContent: boxWith(() => disableHoverableContent),
    disabled: boxWith(() => disabled),
    ignoreNonKeyboardFocus: boxWith(() => ignoreNonKeyboardFocus),
    skipDelayDuration: boxWith(() => skipDelayDuration)
  });
  children?.($$payload);
  $$payload.out.push(`<!---->`);
  pop();
}
function Tooltip_provider($$payload, $$props) {
  let { $$slots, $$events, ...restProps } = $$props;
  $$payload.out.push(`<!---->`);
  Tooltip_provider$1($$payload, spread_props([restProps]));
  $$payload.out.push(`<!---->`);
}
function Sidebar_menu_item($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out.push(`<li${spread_attributes(
    {
      "data-slot": "sidebar-menu-item",
      "data-sidebar": "menu-item",
      class: clsx(cn("group/menu-item relative", className)),
      ...restProps
    }
  )}>`);
  children?.($$payload);
  $$payload.out.push(`<!----></li>`);
  bind_props($$props, { ref });
  pop();
}
function Sidebar_menu($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out.push(`<ul${spread_attributes(
    {
      "data-slot": "sidebar-menu",
      "data-sidebar": "menu",
      class: clsx(cn("flex w-full min-w-0 flex-col gap-1", className)),
      ...restProps
    }
  )}>`);
  children?.($$payload);
  $$payload.out.push(`<!----></ul>`);
  bind_props($$props, { ref });
  pop();
}
function Sidebar_provider($$payload, $$props) {
  push();
  let {
    ref = null,
    open = true,
    onOpenChange = () => {
    },
    class: className,
    style,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  setSidebar({
    open: () => open,
    setOpen: (value) => {
      open = value;
      onOpenChange(value);
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    }
  });
  $$payload.out.push(`<!---->`);
  Tooltip_provider($$payload, {
    delayDuration: 0,
    children: ($$payload2) => {
      $$payload2.out.push(`<div${spread_attributes(
        {
          "data-slot": "sidebar-wrapper",
          style: `--sidebar-width: ${stringify(SIDEBAR_WIDTH)}; --sidebar-width-icon: ${stringify(SIDEBAR_WIDTH_ICON)}; ${stringify(style)}`,
          class: clsx(cn("group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full", className)),
          ...restProps
        }
      )}>`);
      children?.($$payload2);
      $$payload2.out.push(`<!----></div>`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!---->`);
  bind_props($$props, { ref, open });
  pop();
}
function Sheet($$payload, $$props) {
  push();
  let { open = false, $$slots, $$events, ...restProps } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out.push(`<!---->`);
    Dialog($$payload2, spread_props([
      restProps,
      {
        get open() {
          return open;
        },
        set open($$value) {
          open = $$value;
          $$settled = false;
        }
      }
    ]));
    $$payload2.out.push(`<!---->`);
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { open });
  pop();
}
function Sheet_header($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out.push(`<div${spread_attributes(
    {
      "data-slot": "sheet-header",
      class: clsx(cn("flex flex-col gap-1.5 p-4", className)),
      ...restProps
    }
  )}>`);
  children?.($$payload);
  $$payload.out.push(`<!----></div>`);
  bind_props($$props, { ref });
  pop();
}
function Sheet_title($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out.push(`<!---->`);
    Dialog_title($$payload2, spread_props([
      {
        "data-slot": "sheet-title",
        class: cn("text-foreground font-semibold", className)
      },
      restProps,
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        }
      }
    ]));
    $$payload2.out.push(`<!---->`);
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function Sheet_description($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out.push(`<!---->`);
    Dialog_description($$payload2, spread_props([
      {
        "data-slot": "sheet-description",
        class: cn("text-muted-foreground text-sm", className)
      },
      restProps,
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        }
      }
    ]));
    $$payload2.out.push(`<!---->`);
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function Sidebar($$payload, $$props) {
  push();
  let {
    ref = null,
    side = "left",
    variant = "sidebar",
    collapsible = "offcanvas",
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const sidebar = useSidebar();
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    if (collapsible === "none") {
      $$payload2.out.push("<!--[-->");
      $$payload2.out.push(`<div${spread_attributes(
        {
          class: clsx(cn("bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col", className)),
          ...restProps
        }
      )}>`);
      children?.($$payload2);
      $$payload2.out.push(`<!----></div>`);
    } else {
      $$payload2.out.push("<!--[!-->");
      if (sidebar.isMobile) {
        $$payload2.out.push("<!--[-->");
        var bind_get = () => sidebar.openMobile;
        var bind_set = (v) => sidebar.setOpenMobile(v);
        $$payload2.out.push(`<!---->`);
        Sheet($$payload2, spread_props([
          {
            get open() {
              return bind_get();
            },
            set open($$value) {
              bind_set($$value);
            }
          },
          restProps,
          {
            children: ($$payload3) => {
              $$payload3.out.push(`<!---->`);
              Sheet_content($$payload3, {
                "data-sidebar": "sidebar",
                "data-slot": "sidebar",
                "data-mobile": "true",
                class: "bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",
                style: `--sidebar-width: ${stringify(SIDEBAR_WIDTH_MOBILE)};`,
                side,
                children: ($$payload4) => {
                  $$payload4.out.push(`<!---->`);
                  Sheet_header($$payload4, {
                    class: "sr-only",
                    children: ($$payload5) => {
                      $$payload5.out.push(`<!---->`);
                      Sheet_title($$payload5, {
                        children: ($$payload6) => {
                          $$payload6.out.push(`<!---->Sidebar`);
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out.push(`<!----> <!---->`);
                      Sheet_description($$payload5, {
                        children: ($$payload6) => {
                          $$payload6.out.push(`<!---->Displays the mobile sidebar.`);
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out.push(`<!---->`);
                    },
                    $$slots: { default: true }
                  });
                  $$payload4.out.push(`<!----> <div class="flex h-full w-full flex-col">`);
                  children?.($$payload4);
                  $$payload4.out.push(`<!----></div>`);
                },
                $$slots: { default: true }
              });
              $$payload3.out.push(`<!---->`);
            },
            $$slots: { default: true }
          }
        ]));
        $$payload2.out.push(`<!---->`);
      } else {
        $$payload2.out.push("<!--[!-->");
        $$payload2.out.push(`<div class="text-sidebar-foreground group peer hidden md:block"${attr("data-state", sidebar.state)}${attr("data-collapsible", sidebar.state === "collapsed" ? collapsible : "")}${attr("data-variant", variant)}${attr("data-side", side)} data-slot="sidebar"><div data-slot="sidebar-gap"${attr_class(clsx(cn("relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)")))}></div> <div${spread_attributes(
          {
            "data-slot": "sidebar-container",
            class: clsx(cn(
              "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
              side === "left" ? "start-0 group-data-[collapsible=offcanvas]:start-[calc(var(--sidebar-width)*-1)]" : "end-0 group-data-[collapsible=offcanvas]:end-[calc(var(--sidebar-width)*-1)]",
              variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-e group-data-[side=right]:border-s",
              className
            )),
            ...restProps
          }
        )}><div data-sidebar="sidebar" data-slot="sidebar-inner" class="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm">`);
        children?.($$payload2);
        $$payload2.out.push(`<!----></div></div></div>`);
      }
      $$payload2.out.push(`<!--]-->`);
    }
    $$payload2.out.push(`<!--]-->`);
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function Chevron_left($$payload, $$props) {
  push();
  /**
   * @license @lucide/svelte v0.561.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2023 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   */
  let { $$slots, $$events, ...props } = $$props;
  const iconNode = [["path", { "d": "m15 18-6-6 6-6" }]];
  Icon($$payload, spread_props([
    { name: "chevron-left" },
    /**
     * @component @name ChevronLeft
     * @description Lucide SVG icon component, renders SVG Element with children.
     *
     * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTUgMTgtNi02IDYtNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/chevron-left
     * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
     *
     * @param {Object} props - Lucide icons props and any valid SVG attribute
     * @returns {FunctionalComponent} Svelte component
     *
     */
    props,
    {
      iconNode,
      children: ($$payload2) => {
        props.children?.($$payload2);
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
  pop();
}
function Chevron_right($$payload, $$props) {
  push();
  /**
   * @license @lucide/svelte v0.561.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2023 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   */
  let { $$slots, $$events, ...props } = $$props;
  const iconNode = [["path", { "d": "m9 18 6-6-6-6" }]];
  Icon($$payload, spread_props([
    { name: "chevron-right" },
    /**
     * @component @name ChevronRight
     * @description Lucide SVG icon component, renders SVG Element with children.
     *
     * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtOSAxOCA2LTYtNi02IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/chevron-right
     * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
     *
     * @param {Object} props - Lucide icons props and any valid SVG attribute
     * @returns {FunctionalComponent} Svelte component
     *
     */
    props,
    {
      iconNode,
      children: ($$payload2) => {
        props.children?.($$payload2);
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
  pop();
}
function Pages($$payload, $$props) {
  push();
  const sidebar = useSidebar();
  const { guild, items } = $$props;
  $$payload.out.push(`<!---->`);
  Sidebar($$payload, {
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->`);
      Sidebar_content($$payload2, {
        children: ($$payload3) => {
          $$payload3.out.push(`<!---->`);
          Sidebar_group($$payload3, {
            children: ($$payload4) => {
              $$payload4.out.push(`<!---->`);
              Sidebar_group_label($$payload4, {
                class: "text-md",
                children: ($$payload5) => {
                  if (guild.icon) {
                    $$payload5.out.push("<!--[-->");
                    $$payload5.out.push(`<img class="mr-3 h-7 w-7 rounded-xl"${attr("src", `https://cdn.discordapp.com/icons/${stringify(guild.id)}/${stringify(guild.icon)}.png?size=100&quality=lossless`)}/>`);
                  } else {
                    $$payload5.out.push("<!--[!-->");
                  }
                  $$payload5.out.push(`<!--]-->${escape_html(guild.name)}`);
                },
                $$slots: { default: true }
              });
              $$payload4.out.push(`<!----> <!---->`);
              Sidebar_group_content($$payload4, {
                class: "mt-3",
                children: ($$payload5) => {
                  $$payload5.out.push(`<!---->`);
                  Sidebar_menu($$payload5, {
                    children: ($$payload6) => {
                      const each_array = ensure_array_like(items);
                      $$payload6.out.push(`<!--[-->`);
                      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                        let item = each_array[$$index];
                        $$payload6.out.push(`<!---->`);
                        Sidebar_menu_item($$payload6, {
                          children: ($$payload7) => {
                            $$payload7.out.push(`<!---->`);
                            {
                              let child = function($$payload8, { props }) {
                                $$payload8.out.push(`<a${spread_attributes({ href: item.url, ...props })}><span>${escape_html(item.title)}</span></a>`);
                              };
                              Sidebar_menu_button($$payload7, { child, $$slots: { child: true } });
                            }
                            $$payload7.out.push(`<!---->`);
                          },
                          $$slots: { default: true }
                        });
                        $$payload6.out.push(`<!---->`);
                      }
                      $$payload6.out.push(`<!--]-->`);
                    },
                    $$slots: { default: true }
                  });
                  $$payload5.out.push(`<!---->`);
                },
                $$slots: { default: true }
              });
              $$payload4.out.push(`<!---->`);
            },
            $$slots: { default: true }
          });
          $$payload3.out.push(`<!---->`);
        },
        $$slots: { default: true }
      });
      $$payload2.out.push(`<!---->`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    variant: "ghost",
    class: "mt-auto mb-auto",
    onclick: sidebar.toggle,
    children: ($$payload2) => {
      if (sidebar.open) {
        $$payload2.out.push("<!--[-->");
        Chevron_left($$payload2, {});
      } else {
        $$payload2.out.push("<!--[!-->");
        Chevron_right($$payload2, {});
      }
      $$payload2.out.push(`<!--]-->`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!---->`);
  pop();
}
function _page($$payload, $$props) {
  push();
  const { data } = $$props;
  let pages = [
    ...new Set(data.inputs.map((i) => i.page?.toUpperCase() ?? "GENERAL"))
  ];
  async function setValue(name, value) {
    const res = await fetch(`./${data.guild.id}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, value })
    });
    if (!res.ok) {
      const text = await res.text();
      alert("Error: " + text);
    }
  }
  $$payload.out.push(`<!---->`);
  Sidebar_provider($$payload, {
    children: ($$payload2) => {
      Pages($$payload2, {
        guild: data.guild,
        items: pages.map((p) => ({ title: p, url: `./${p}` }))
      });
      $$payload2.out.push(`<!----> <div class="h-full w-full p-3"><h1 class="text-xl font-bold">${escape_html(data.page.toUpperCase())}</h1> `);
      Scroll_area($$payload2, {
        class: "h-full w-full",
        children: ($$payload3) => {
          const each_array = ensure_array_like(data.inputs.filter((i) => (i.page?.toLowerCase() ?? "general") === data.page.toLowerCase()).sort((a, b) => a.name.localeCompare(b.name)));
          $$payload3.out.push(`<div class="mt-3 grid w-full gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4"><!--[-->`);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let input = each_array[$$index];
            Input_1($$payload3, {
              roles: data.roles,
              members: data.members,
              channels: data.channels,
              input,
              onChange: setValue
            });
          }
          $$payload3.out.push(`<!--]--></div>`);
        },
        $$slots: { default: true }
      });
      $$payload2.out.push(`<!----></div>`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!---->`);
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BXzwy7zr.js.map
