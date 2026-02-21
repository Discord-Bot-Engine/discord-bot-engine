import { p as push, v as copy_payload, w as assign_payload, e as pop, g as escape_html, o as ensure_array_like, u as bind_props, x as spread_props, y as props_id, q as spread_attributes, t as clsx } from './index-Ct39Tk77.js';
import { S as Scroll_area } from './card-title-CUAsGUmh.js';
import { D as Dialog, I as Input_1, S as Select_label, a as Input, R as Root$1, b as Select_trigger, c as Select_content, d as Select_group, e as Select_item, f as Dialog_title$1 } from './Input-CIRWi-sJ.js';
import { b as buttonVariants, c as cn, a as createId, d as boxWith, m as mergeProps, B as Button } from './use-id-r7Hqn7_D.js';
import { P as Portal$1, D as Dialog_content$1, a as Dialog_close$1, b as DialogTriggerState, c as Dialog_overlay$1, X, I as Icon } from './x-BKdX8_Hm.js';
import './events-ClNAEvdo.js';

function Dialog_trigger$1($$payload, $$props) {
  push();
  const uid = props_id($$payload);
  let {
    id = createId(uid),
    ref = null,
    children,
    child,
    disabled = false,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const triggerState = DialogTriggerState.create({
    id: boxWith(() => id),
    ref: boxWith(() => ref, (v) => ref = v),
    disabled: boxWith(() => Boolean(disabled))
  });
  const mergedProps = mergeProps(restProps, triggerState.props);
  if (child) {
    $$payload.out.push("<!--[-->");
    child($$payload, { props: mergedProps });
    $$payload.out.push(`<!---->`);
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<button${spread_attributes({ ...mergedProps })}>`);
    children?.($$payload);
    $$payload.out.push(`<!----></button>`);
  }
  $$payload.out.push(`<!--]-->`);
  bind_props($$props, { ref });
  pop();
}
function Plus($$payload, $$props) {
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
  const iconNode = [["path", { "d": "M5 12h14" }], ["path", { "d": "M12 5v14" }]];
  Icon($$payload, spread_props([
    { name: "plus" },
    /**
     * @component @name Plus
     * @description Lucide SVG icon component, renders SVG Element with children.
     *
     * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSAxMmgxNCIgLz4KICA8cGF0aCBkPSJNMTIgNXYxNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/plus
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
function Dialog_title($$payload, $$props) {
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
    Dialog_title$1($$payload2, spread_props([
      {
        "data-slot": "dialog-title",
        class: cn("text-lg font-semibold leading-none", className)
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
function Dialog_footer($$payload, $$props) {
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
      "data-slot": "dialog-footer",
      class: clsx(cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)),
      ...restProps
    }
  )}>`);
  children?.($$payload);
  $$payload.out.push(`<!----></div>`);
  bind_props($$props, { ref });
  pop();
}
function Dialog_header($$payload, $$props) {
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
      "data-slot": "dialog-header",
      class: clsx(cn("flex flex-col gap-2 text-center sm:text-left", className)),
      ...restProps
    }
  )}>`);
  children?.($$payload);
  $$payload.out.push(`<!----></div>`);
  bind_props($$props, { ref });
  pop();
}
function Dialog_overlay($$payload, $$props) {
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
    Dialog_overlay$1($$payload2, spread_props([
      {
        "data-slot": "dialog-overlay",
        class: cn("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", className)
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
function Dialog_content($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    portalProps,
    children,
    showCloseButton = true,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out.push(`<!---->`);
    Portal($$payload2, spread_props([
      portalProps,
      {
        children: ($$payload3) => {
          $$payload3.out.push(`<!---->`);
          Dialog_overlay($$payload3, {});
          $$payload3.out.push(`<!----> <!---->`);
          Dialog_content$1($$payload3, spread_props([
            {
              "data-slot": "dialog-content",
              class: cn("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed left-[50%] top-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg", className)
            },
            restProps,
            {
              get ref() {
                return ref;
              },
              set ref($$value) {
                ref = $$value;
                $$settled = false;
              },
              children: ($$payload4) => {
                children?.($$payload4);
                $$payload4.out.push(`<!----> `);
                if (showCloseButton) {
                  $$payload4.out.push("<!--[-->");
                  $$payload4.out.push(`<!---->`);
                  Dialog_close$1($$payload4, {
                    class: "ring-offset-background focus:ring-ring rounded-xs focus:outline-hidden absolute end-4 top-4 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
                    children: ($$payload5) => {
                      X($$payload5, {});
                      $$payload5.out.push(`<!----> <span class="sr-only">Close</span>`);
                    },
                    $$slots: { default: true }
                  });
                  $$payload4.out.push(`<!---->`);
                } else {
                  $$payload4.out.push("<!--[!-->");
                }
                $$payload4.out.push(`<!--]-->`);
              },
              $$slots: { default: true }
            }
          ]));
          $$payload3.out.push(`<!---->`);
        },
        $$slots: { default: true }
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
function Dialog_trigger($$payload, $$props) {
  push();
  let { ref = null, $$slots, $$events, ...restProps } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out.push(`<!---->`);
    Dialog_trigger$1($$payload2, spread_props([
      { "data-slot": "dialog-trigger" },
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
function Dialog_close($$payload, $$props) {
  push();
  let { ref = null, $$slots, $$events, ...restProps } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out.push(`<!---->`);
    Dialog_close$1($$payload2, spread_props([
      { "data-slot": "dialog-close" },
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
const Root = Dialog;
const Portal = Portal$1;
function _page($$payload, $$props) {
  push();
  const { data } = $$props;
  let name = "";
  let value = "";
  let page = "general";
  let types = [
    "Text",
    "Dropdown",
    "Member",
    "Text Channel",
    "Voice Channel",
    "Category",
    "Channel",
    "Role",
    "Mentionable"
  ].sort();
  let type = types[0];
  let multiple = false;
  let values = "";
  let inputs = data.inputs;
  let open = false;
  async function addInput() {
    inputs.push({
      name,
      value,
      page: page.toLowerCase().trim(),
      type: type.toLowerCase(),
      values
    });
    const res = await fetch(`/admin/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        value: type.toLowerCase() !== "text" && multiple ? value.split(",") : value,
        page: page.toLowerCase().trim(),
        type: type.toLowerCase(),
        values,
        multiple
      })
    });
    if (!res.ok) {
      const text = await res.text();
      alert("Error: " + text);
    }
    open = false;
  }
  async function deleteInput(name2) {
    inputs = inputs.filter((i) => i.name !== name2);
    const res = await fetch(`/admin/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name2 })
    });
    if (!res.ok) {
      const text = await res.text();
      alert("Error: " + text);
    }
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out.push(`<div class="h-full w-full p-3"><div class="flex"><h1 class="text-xl font-bold">Editing ${escape_html(data.botName)}</h1> <!---->`);
    Root($$payload2, {
      get open() {
        return open;
      },
      set open($$value) {
        open = $$value;
        $$settled = false;
      },
      children: ($$payload3) => {
        $$payload3.out.push(`<!---->`);
        Dialog_trigger($$payload3, {
          class: buttonVariants({ size: "icon", class: "ml-auto" }),
          children: ($$payload4) => {
            Plus($$payload4, {});
          },
          $$slots: { default: true }
        });
        $$payload3.out.push(`<!----> <!---->`);
        Dialog_content($$payload3, {
          class: "sm:max-w-[425px]",
          children: ($$payload4) => {
            $$payload4.out.push(`<!---->`);
            Dialog_header($$payload4, {
              children: ($$payload5) => {
                $$payload5.out.push(`<!---->`);
                Dialog_title($$payload5, {
                  children: ($$payload6) => {
                    $$payload6.out.push(`<!---->Add Input`);
                  },
                  $$slots: { default: true }
                });
                $$payload5.out.push(`<!---->`);
              },
              $$slots: { default: true }
            });
            $$payload4.out.push(`<!----> <div class="grid gap-4 py-4"><div class="grid grid-cols-4 items-center gap-4">`);
            Select_label($$payload4, {
              for: "page",
              class: "text-right",
              children: ($$payload5) => {
                $$payload5.out.push(`<!---->Page`);
              },
              $$slots: { default: true }
            });
            $$payload4.out.push(`<!----> `);
            Input($$payload4, {
              id: "page",
              class: "col-span-3 uppercase",
              get value() {
                return page;
              },
              set value($$value) {
                page = $$value;
                $$settled = false;
              }
            });
            $$payload4.out.push(`<!----></div> <div class="grid grid-cols-4 items-center gap-4">`);
            Select_label($$payload4, {
              for: "name",
              class: "text-right",
              children: ($$payload5) => {
                $$payload5.out.push(`<!---->Name`);
              },
              $$slots: { default: true }
            });
            $$payload4.out.push(`<!----> `);
            Input($$payload4, {
              id: "name",
              class: "col-span-3",
              get value() {
                return name;
              },
              set value($$value) {
                name = $$value;
                $$settled = false;
              }
            });
            $$payload4.out.push(`<!----></div> <div class="grid grid-cols-4 items-center gap-4">`);
            Select_label($$payload4, {
              for: "type",
              class: "text-right",
              children: ($$payload5) => {
                $$payload5.out.push(`<!---->Type`);
              },
              $$slots: { default: true }
            });
            $$payload4.out.push(`<!----> <!---->`);
            Root$1($$payload4, {
              id: "type",
              type: "single",
              get value() {
                return type;
              },
              set value($$value) {
                type = $$value;
                $$settled = false;
              },
              children: ($$payload5) => {
                $$payload5.out.push(`<!---->`);
                Select_trigger($$payload5, {
                  class: "col-span-3 w-full",
                  children: ($$payload6) => {
                    $$payload6.out.push(`<!---->${escape_html(types.includes(type) ? type : "Select an option")}`);
                  },
                  $$slots: { default: true }
                });
                $$payload5.out.push(`<!----> <!---->`);
                Select_content($$payload5, {
                  children: ($$payload6) => {
                    $$payload6.out.push(`<!---->`);
                    Select_group($$payload6, {
                      children: ($$payload7) => {
                        const each_array = ensure_array_like(types);
                        $$payload7.out.push(`<!---->`);
                        Select_label($$payload7, {
                          children: ($$payload8) => {
                            $$payload8.out.push(`<!---->Options`);
                          },
                          $$slots: { default: true }
                        });
                        $$payload7.out.push(`<!----> <!--[-->`);
                        for (let i = 0, $$length = each_array.length; i < $$length; i++) {
                          let value2 = each_array[i];
                          $$payload7.out.push(`<!---->`);
                          Select_item($$payload7, {
                            value: value2,
                            label: value2,
                            children: ($$payload8) => {
                              $$payload8.out.push(`<!---->${escape_html(value2)}`);
                            },
                            $$slots: { default: true }
                          });
                          $$payload7.out.push(`<!---->`);
                        }
                        $$payload7.out.push(`<!--]-->`);
                      },
                      $$slots: { default: true }
                    });
                    $$payload6.out.push(`<!---->`);
                  },
                  $$slots: { default: true }
                });
                $$payload5.out.push(`<!---->`);
              },
              $$slots: { default: true }
            });
            $$payload4.out.push(`<!----></div> `);
            if (type === "Dropdown" || type === "Text") {
              $$payload4.out.push("<!--[-->");
              $$payload4.out.push(`<div class="grid grid-cols-4 items-center gap-4">`);
              Select_label($$payload4, {
                for: "value",
                class: "text-right",
                children: ($$payload5) => {
                  $$payload5.out.push(`<!---->Value`);
                },
                $$slots: { default: true }
              });
              $$payload4.out.push(`<!----> `);
              Input($$payload4, {
                id: "value",
                class: "col-span-3",
                get value() {
                  return value;
                },
                set value($$value) {
                  value = $$value;
                  $$settled = false;
                }
              });
              $$payload4.out.push(`<!----></div>`);
            } else {
              $$payload4.out.push("<!--[!-->");
            }
            $$payload4.out.push(`<!--]--> `);
            if (type === "Dropdown") {
              $$payload4.out.push("<!--[-->");
              $$payload4.out.push(`<div class="grid grid-cols-4 items-center gap-4">`);
              Select_label($$payload4, {
                for: "value",
                class: "text-right",
                children: ($$payload5) => {
                  $$payload5.out.push(`<!---->Values`);
                },
                $$slots: { default: true }
              });
              $$payload4.out.push(`<!----> `);
              Input($$payload4, {
                id: "value",
                placeholder: "Separated by ,",
                class: "col-span-3",
                get value() {
                  return values;
                },
                set value($$value) {
                  values = $$value;
                  $$settled = false;
                }
              });
              $$payload4.out.push(`<!----></div>`);
            } else {
              $$payload4.out.push("<!--[!-->");
            }
            $$payload4.out.push(`<!--]--> `);
            if (type !== "Text") {
              $$payload4.out.push("<!--[-->");
              $$payload4.out.push(`<div class="grid grid-cols-4 items-center gap-4">`);
              Select_label($$payload4, {
                for: "multiple",
                class: "text-right",
                children: ($$payload5) => {
                  $$payload5.out.push(`<!---->Select Multiple?`);
                },
                $$slots: { default: true }
              });
              $$payload4.out.push(`<!----> <!---->`);
              Root$1($$payload4, {
                id: "multiple",
                type: "single",
                get value() {
                  return multiple;
                },
                set value($$value) {
                  multiple = $$value;
                  $$settled = false;
                },
                children: ($$payload5) => {
                  $$payload5.out.push(`<!---->`);
                  Select_trigger($$payload5, {
                    class: "col-span-3 w-full",
                    children: ($$payload6) => {
                      $$payload6.out.push(`<!---->${escape_html(multiple ? "True" : "False")}`);
                    },
                    $$slots: { default: true }
                  });
                  $$payload5.out.push(`<!----> <!---->`);
                  Select_content($$payload5, {
                    children: ($$payload6) => {
                      $$payload6.out.push(`<!---->`);
                      Select_group($$payload6, {
                        children: ($$payload7) => {
                          $$payload7.out.push(`<!---->`);
                          Select_label($$payload7, {
                            children: ($$payload8) => {
                              $$payload8.out.push(`<!---->Options`);
                            },
                            $$slots: { default: true }
                          });
                          $$payload7.out.push(`<!----> <!---->`);
                          Select_item($$payload7, {
                            value: true,
                            label: "True",
                            children: ($$payload8) => {
                              $$payload8.out.push(`<!---->True`);
                            },
                            $$slots: { default: true }
                          });
                          $$payload7.out.push(`<!----> <!---->`);
                          Select_item($$payload7, {
                            value: false,
                            label: "False",
                            children: ($$payload8) => {
                              $$payload8.out.push(`<!---->False`);
                            },
                            $$slots: { default: true }
                          });
                          $$payload7.out.push(`<!---->`);
                        },
                        $$slots: { default: true }
                      });
                      $$payload6.out.push(`<!---->`);
                    },
                    $$slots: { default: true }
                  });
                  $$payload5.out.push(`<!---->`);
                },
                $$slots: { default: true }
              });
              $$payload4.out.push(`<!----></div>`);
            } else {
              $$payload4.out.push("<!--[!-->");
            }
            $$payload4.out.push(`<!--]--></div> <!---->`);
            Dialog_footer($$payload4, {
              children: ($$payload5) => {
                $$payload5.out.push(`<!---->`);
                Dialog_close($$payload5, {
                  class: buttonVariants({ variant: "secondary" }),
                  children: ($$payload6) => {
                    $$payload6.out.push(`<!---->Cancel`);
                  },
                  $$slots: { default: true }
                });
                $$payload5.out.push(`<!----> `);
                Button($$payload5, {
                  onclick: addInput,
                  children: ($$payload6) => {
                    $$payload6.out.push(`<!---->Done`);
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
    $$payload2.out.push(`<!----></div> `);
    Scroll_area($$payload2, {
      children: ($$payload3) => {
        const each_array_1 = ensure_array_like(inputs);
        $$payload3.out.push(`<div class="mt-3 grid h-full w-full gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4"><!--[-->`);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let input = each_array_1[$$index_1];
          Input_1($$payload3, { input, isAdmin: true, onDelete: deleteInput });
        }
        $$payload3.out.push(`<!--]--></div>`);
      },
      $$slots: { default: true }
    });
    $$payload2.out.push(`<!----></div>`);
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BBUlMrDp.js.map
