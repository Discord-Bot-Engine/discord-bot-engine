import { p as push, e as pop, o as ensure_array_like, j as attr, k as stringify, q as spread_attributes, t as clsx, u as bind_props, g as escape_html } from './index-Ct39Tk77.js';
import { S as Scroll_area, C as Card, a as Card_header, b as Card_title } from './card-title-CUAsGUmh.js';
import { c as cn, B as Button } from './use-id-r7Hqn7_D.js';
import './events-ClNAEvdo.js';

function Card_footer($$payload, $$props) {
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
      "data-slot": "card-footer",
      class: clsx(cn("[.border-t]:pt-6 flex items-center px-6", className)),
      ...restProps
    }
  )}>`);
  children?.($$payload);
  $$payload.out.push(`<!----></div>`);
  bind_props($$props, { ref });
  pop();
}
function Guild($$payload, $$props) {
  push();
  const { guild } = $$props;
  $$payload.out.push(`<!---->`);
  Card($$payload, {
    children: ($$payload2) => {
      $$payload2.out.push(`<div class="flex w-full">`);
      if (guild.icon) {
        $$payload2.out.push("<!--[-->");
        $$payload2.out.push(`<img class="ml-3 h-18 w-18 rounded-lg"${attr("src", `https://cdn.discordapp.com/icons/${stringify(guild.id)}/${stringify(guild.icon)}.png?size=100&quality=lossless`)}/>`);
      } else {
        $$payload2.out.push("<!--[!-->");
      }
      $$payload2.out.push(`<!--]--> <div class="w-full"><!---->`);
      Card_header($$payload2, {
        children: ($$payload3) => {
          $$payload3.out.push(`<!---->`);
          Card_title($$payload3, {
            class: "mt-3",
            children: ($$payload4) => {
              $$payload4.out.push(`<!---->${escape_html(guild.name)}`);
            },
            $$slots: { default: true }
          });
          $$payload3.out.push(`<!---->`);
        },
        $$slots: { default: true }
      });
      $$payload2.out.push(`<!----> <!---->`);
      Card_footer($$payload2, {
        children: ($$payload3) => {
          Button($$payload3, {
            class: "ml-auto",
            onclick: () => location.href = "./guild/" + guild.id + "/GENERAL",
            children: ($$payload4) => {
              $$payload4.out.push(`<!---->Edit`);
            },
            $$slots: { default: true }
          });
        },
        $$slots: { default: true }
      });
      $$payload2.out.push(`<!----></div></div>`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!---->`);
  pop();
}
function _page($$payload, $$props) {
  push();
  const { data } = $$props;
  Scroll_area($$payload, {
    class: "w-full h-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-3 gap-3",
    children: ($$payload2) => {
      const each_array = ensure_array_like(data.guilds);
      $$payload2.out.push(`<!--[-->`);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let guild = each_array[$$index];
        Guild($$payload2, { guild });
      }
      $$payload2.out.push(`<!--]-->`);
    },
    $$slots: { default: true }
  });
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BfArpj2M.js.map
