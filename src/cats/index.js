/**
 * Cat registry. To add a new cat:
 *   1. Create src/cats/<name>.js exporting a CatDefinition (see ../cats/momo.js).
 *   2. Add the import + entry below.
 *   3. Restart the app — the new cat shows up in Settings automatically.
 */

const momo = require('./momo');
const java = require('./java');

const REGISTRY = new Map();

function register(cat) {
  if (!cat || !cat.id) throw new Error('Cat definition needs an id');
  if (REGISTRY.has(cat.id)) throw new Error(`Duplicate cat id: ${cat.id}`);
  REGISTRY.set(cat.id, cat);
}

register(momo);
register(java);

function listCats() {
  return [...REGISTRY.values()].map((c) => ({
    id: c.id,
    name: c.name,
    species: c.species,
    accentColor: c.accentColor,
    description: c.description,
    weightKg: c.weightKg,
    defaultSize: c.defaultSize,
  }));
}

function getCat(id) {
  return REGISTRY.get(id) || null;
}

module.exports = { listCats, getCat };
