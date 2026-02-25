import { e as error } from './index-CccDCyu_.js';

async function load({ locals, params }) {
  const inputs = locals.dashboard.inputs.map((i) => ({
    ...i,
    value: locals.dashboard.getInputValue(params.id, i.name)
  }));
  const guilds = (await locals.bot.client.cluster.broadcastEval(
    (c, { id }) => c.guilds.cache.filter((g) => {
      const member = g.members.cache.get(id);
      if (member && member.permissions.has(32)) return g;
    }).map((g) => ({ id: g.id, name: g.name, icon: g.icon })),
    {
      context: {
        id: locals.user.id
      }
    }
  )).flat();
  const guild = guilds.find((g) => g.id === params.id);
  if (!guild) {
    throw error(404, "Not found");
  }
  let roles = await locals.bot.client.cluster.broadcastEval(
    (c, { guildId }) => c.guilds.cache.get(guildId).roles.cache.map((v) => ({ name: v.name, id: v.id })),
    { context: { guildId: guild.id } }
  );
  roles = roles.flat();
  let members = await locals.bot.client.cluster.broadcastEval(
    (c, { guildId }) => c.guilds.cache.get(guildId).members.cache.map((v) => ({ name: v.displayName, id: v.id })),
    { context: { guildId: guild.id } }
  );
  members = members.flat();
  let channels = await locals.bot.client.cluster.broadcastEval(
    (c, { guildId }) => c.guilds.cache.get(guildId).channels.cache.map((v) => ({
      name: v.name,
      id: v.id,
      type: v.type,
      isTextBased: v.isTextBased(),
      isVoiceBased: v.isVoiceBased()
    })),
    { context: { guildId: guild.id } }
  );
  channels = channels.flat();
  return {
    roles,
    members,
    channels,
    guild,
    inputs,
    page: params.page.toLowerCase()
  };
}

var _page_server = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 4;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-B23Ux6N8.js')).default;
const server_id = "src/routes/guild/[id]/[page]/+page.server.js";
const imports = ["_app/immutable/nodes/4.wfJeIJ9w.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/DxmLRnxC.js","_app/immutable/chunks/pcOpUFT1.js","_app/immutable/chunks/DHYJ9T3W.js","_app/immutable/chunks/CgjbjgXE.js","_app/immutable/chunks/C9SzvCzW.js","_app/immutable/chunks/CUUPqnCz.js","_app/immutable/chunks/_NbspONZ.js","_app/immutable/chunks/D3gtm1Km.js"];
const stylesheets = ["_app/immutable/assets/card-title.bHHIbcsu.css","_app/immutable/assets/Input.CV-KWLNP.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server as server, server_id, stylesheets };
//# sourceMappingURL=4-CPwyixT5.js.map
