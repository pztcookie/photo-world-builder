# Runtime and creation contract

The starter bundles Three.js 0.170.0 (MIT) and the Chewy font (Apache 2.0) in vendor/. No npm, API key, CDN or network asset is needed to play. Serve through HTTP; ES modules cannot be opened directly through file://.

- world.json: content configuration, schemaVersion=1. Renaming or translating never changes id.
- references.json: photo evidence, retained details, mappings, inventions and review status. Source images live in references/.
- models.js: rounded procedural modeling helpers and scene composition, inspired by the Cookie Cottage workflow; not a copy of the whole original project.
- world.js: scene, cameras, picking, decorating, meals, photography and album.
- state.js: world-isolated saves, stable item IDs and validated backup/restore.
- i18n.js: Chinese/English/Japanese interface dictionaries, locale selection and explicit configuration translations.
- index.html, style.css: responsive interface.

## Configuration

Fields: schemaVersion, id, name, tagline, environment(coast/tea/garden), palette(sky/ground/wall/roof/accent), house(name), shop(name/kind:icecream|tea|bakery/color), characters(id/name/kind:bunny|bear|cat/color), menu(id/name/color), decor(id/name/kind:plant|flower|cushion|book/color/x/z), memoryPrompt.

Maximum: 3 characters, 6 foods, 16 decorations. The home is back-left, shop back-right, table front-right. Coordinates x,z are horizontal. Decoratable areas: garden -5.4≤x≤1.7, 0.5≤z≤5; interior -5.5≤x≤-0.9, -4.2≤z≤-1. Configuration contains no executable code or arbitrary network routes.

Explicit optional translations:

```json
{
  "name": "海盐小屋",
  "i18n": {
    "en": {"name": "Seaside Cottage", "tagline": "A little place by the sea"},
    "ja": {"name": "潮風の小屋"}
  }
}
```

Objects in characters/menu/decor and the house/shop objects can likewise carry `i18n.en.name` and `i18n.ja.name`. Missing translations preserve the base value. Use zh/en/ja keys. When a field changes, update or remove its stale translations. The initializer clears the preset's translated world name when given a custom name.

Locale resolution: valid URL `?lang=` > saved `littleWorld.language` preference > browser language > English. Language selection reloads the page, so save any in-progress caption first. Scene configuration is cloned before applying translations; IDs and source values remain unchanged. Proper shop signs keep their configured name. The generic home decoration uses the fixed English phrase “Home, sweet little home”.

## Persistence

The localStorage key is `littleWorld.<world.id>.v1`. It stores placements, day/night, up to 100 memories and 12 compressed photos. Storage exhaustion shows a failure and leaves the saved state intact. Invalid original data is preserved and can be exported for recovery. Backup restore accepts only valid data from the same world and requires an explicit restore action in the UI.

Language changes do not change save identity. Previously written captions and memories stay in their original language. Storage belongs to the browser origin: changing address, port, browser or device requires export/restore. The source folder is separate from browser saves.

## Validation and limits

validate_world.py checks data and local dependencies, not photographic fidelity. Inspect distinctive features, home/shop cameras, eating/drinking, moving objects, refresh persistence, photo save/download, narrow layouts and browser errors. For localization changes, test all three language views, a language switch across a saved placement, and a custom world name that must remain unchanged.

The default anatomy supports hands and short walking motions. It is not automatic reconstruction of a person or pet. Compare silhouette, proportions, eyes, markings and accessories, and extend models when needed. The starter has no multiplayer, voice, arbitrary photo-to-3D backend, transaction economy or city transport. Those require implementation before being described as available.
