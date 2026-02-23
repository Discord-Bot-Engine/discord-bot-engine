async function load({ locals }) {
  return {
    name: locals.bot.client.user.username,
    icon: locals.bot.client.user.avatarURL(),
    guildCount: locals.bot.client.application.approximateGuildCount ?? (await locals.bot.client.application.fetch()).approximateGuildCount,
    isAdmin: locals.isAdmin
  };
}

var _layout_server = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 0;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-CFIgeOSU.js')).default;
const server_id = "src/routes/+layout.server.js";
const imports = ["_app/immutable/nodes/0.FmoKGlo5.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/DxmLRnxC.js","_app/immutable/chunks/pcOpUFT1.js","_app/immutable/chunks/DHYJ9T3W.js","_app/immutable/chunks/D3gtm1Km.js","_app/immutable/chunks/CUUPqnCz.js","_app/immutable/chunks/_NbspONZ.js"];
const stylesheets = ["_app/immutable/assets/0.jDmVAWcK.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server as server, server_id, stylesheets };
//# sourceMappingURL=0-0GDEtaCz.js.map
