import { e as error } from './index-CccDCyu_.js';

async function load({ locals, params }) {
  const inputs = locals.dashboard.inputs.map((i) => ({
    ...i,
    value: locals.dashboard.getInputValue(params.id, i.name)
  }));
  const guild = locals.guilds.find((g) => g.id === params.id);
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
const component = async () => component_cache ??= (await import('./_page.svelte-BXzwy7zr.js')).default;
const server_id = "src/routes/guild/[id]/[page]/+page.server.js";
const imports = ["_app/immutable/nodes/4.Bm2ezc1f.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/NgqrPNVi.js","_app/immutable/chunks/pwS3GfhJ.js","_app/immutable/chunks/jJXQuL90.js","_app/immutable/chunks/DaUXdgD5.js","_app/immutable/chunks/BXgOJufX.js","_app/immutable/chunks/DHuJWlOw.js","_app/immutable/chunks/CzY68dQD.js","_app/immutable/chunks/CtjbdIiF.js"];
const stylesheets = ["_app/immutable/assets/card-title.bHHIbcsu.css","_app/immutable/assets/Input.CV-KWLNP.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server as server, server_id, stylesheets };
//# sourceMappingURL=4-9MHuVe9m.js.map
