import { p as push, h as head, e as pop, f as attr_class, g as escape_html, j as attr, k as stringify } from './index-Ct39Tk77.js';
import { b as buttonVariants } from './use-id-r7Hqn7_D.js';
import './sheet-content-Pn2foTu1.js';
import './x-BKdX8_Hm.js';
import './events-ClNAEvdo.js';

function Navbar($$payload, $$props) {
  push();
  const { data } = $$props;
  $$payload.out.push(`<div class="flex w-full overflow-hidden bg-sidebar p-2 px-3"><div class="w-full max-w-1/3 overflow-hidden"><a${attr_class(`${stringify(buttonVariants({ variant: "ghost" }))} truncate`)}>${escape_html(data.guildCount)} Servers</a></div> <div class="flex w-full max-w-1/3 justify-center overflow-hidden"><img class="h-9 w-9 rounded-xl"${attr("src", data.icon)}/> <a${attr_class(`${stringify(buttonVariants({ variant: "ghost" }))} truncate`)} href="/">${escape_html(data.name)}</a></div> <div class="flex w-full max-w-1/3 justify-end overflow-hidden">`);
  if (data.isAdmin) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<a${attr_class(`${stringify(buttonVariants({ variant: "ghost" }))} truncate`)} href="/admin">Edit</a>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div></div>`);
  pop();
}
function _layout($$payload, $$props) {
  push();
  let { children, data } = $$props;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>${escape_html(data.name)}</title>`;
    $$payload2.out.push(`<link rel="icon"${attr("href", data.icon)}/>`);
  });
  $$payload.out.push(`<div class="h-screen w-screen overflow-hidden">`);
  Navbar($$payload, { data });
  $$payload.out.push(`<!----> `);
  children?.($$payload);
  $$payload.out.push(`<!----></div>`);
  pop();
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-CFIgeOSU.js.map
