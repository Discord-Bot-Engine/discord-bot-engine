import { e as error } from './index-CccDCyu_.js';

async function load({ locals }) {
  const botName = locals.bot.client.user.username;
  const inputs = locals.dashboard.inputs;
  const isAdmin = locals.isAdmin;
  if (!isAdmin) {
    throw error(403, "Forbidden");
  }
  return {
    botName,
    inputs
  };
}

var _page_server = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 3;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DACtIK56.js')).default;
const server_id = "src/routes/admin/+page.server.js";
const imports = ["_app/immutable/nodes/3.DzqfncUA.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/DxmLRnxC.js","_app/immutable/chunks/DHYJ9T3W.js","_app/immutable/chunks/pcOpUFT1.js","_app/immutable/chunks/CgjbjgXE.js","_app/immutable/chunks/DhyogZ0M.js","_app/immutable/chunks/CUUPqnCz.js","_app/immutable/chunks/_NbspONZ.js"];
const stylesheets = ["_app/immutable/assets/card-title.bHHIbcsu.css","_app/immutable/assets/Input.CV-KWLNP.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server as server, server_id, stylesheets };
//# sourceMappingURL=3-bdMRgFC5.js.map
