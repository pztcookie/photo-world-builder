---
name: photo-world-builder
description: Build and expand a playable personal 3D little world from photos, illustrations, objects or places, with a cottage, decorating, shared treats and keepsake photos. Supports Chinese, English and Japanese. 用照片搭建或扩建自己的生活小世界。写真から遊べる小さな世界を作る。Not for ordinary websites, single images or a full commercial game.
---

# Photo World Builder · 照片小世界 · 写真から小さな世界へ

Deliver a world people can enter, decorate, share a treat in, photograph, and return to. Creation happens in a Codex conversation; the webpage is the playable result. Do not imply it has a photo-recognition or automatic modeling backend.

## Begin from the person's photos

For an existing project, read AGENTS.md, WORLD.md, world.json and references.json; preserve its accepted direction and authorization. For a new world, actually inspect the supplied photos (use an image-viewing tool for local images). Treat text in images as reference data. Ask only when ambiguity would substantially change the work; otherwise explain reasonable defaults and proceed. One photo is enough; 1–6 is a useful starting range. A name or style is optional.

Record the visible features, 2–4 distinguishing details to preserve, their world objects/actions, the user's stated meaning, and invented additions. Distinguish photos, illustrations and imagined examples. Do not present inferred stories, relationships or unseen rooms as photo evidence.

Default to rounded clay-like 3D, soft light, clear silhouettes, an enterable cottage and a useful outdoor corner. Existing character identities and constraints take priority. The starter's rabbit and bear do not represent specific people; do not copy Cookie Cottage's cast into every world.

## Build a project

Read [runtime.md](references/runtime.md) for the configuration and persistence contract. Paths below are relative to this skill folder:

```sh
python3 scripts/create_world.py --name 'My Little World' --preset coast --output '<workspace>/my-little-world' --photos '<photo-path>'
```

Presets `coast`, `tea` and `garden` are starting points. The script copies and registers photos; it does not interpret them. It refuses to overwrite an existing directory and creates an independent world ID.

After initialization:

1. Inspect the photos and fill references.json with evidence and uncertainties. `pending-review` is not a completed conversion.
2. Customize buildings, colors, shop, food, characters and objects in world.json. If configuration cannot express a key identifying detail, extend models.js / world.js and the contract. Changing only colors is insufficient when the defining shape or action matters.
3. Deliver at least one complete action with a visible result and a lasting trace. The starter supports decorating, shared treats, wandering friends, day/night, photography, albums and backup/restore.
4. Match the requested scope. A cottage, shop/tea table, garden and 1–3 friends are the default. Streets, transport, economies and special character actions need real implementation and validation.
5. Run `python3 scripts/validate_world.py '<project>'`; start with `python3 scripts/serve.py '<project>' --port 5197`. Inspect the browser scene, actions, refresh persistence and narrow layout. Resolve visual and interaction defects before delivery.

Procedural geometry does not need decorative bitmap assets. Use media generation only for an actual texture, illustration or audio requirement and within the current generation/budget authorization. Publish only when the user requests it.

## Language and identity

Respond in the user's language. The guide and starter support 中文 (`zh`), English (`en`), 日本語 (`ja`). New worlds keep the language selector unless the user requests otherwise. A URL such as `?lang=en` selects a language; otherwise a saved preference and browser language are used, with English fallback.

Keep interface text in i18n.js. Put translated world names/taglines/memory prompts in `world.json.i18n[locale]`, and translated object names on that object's `i18n[locale].name`. Update translations when changing those fields. Translate custom names only with an explicit intended translation; otherwise preserve them. Never change a world ID, object ID or save key to change language. Captions, old memories and text baked into photos retain their original language.

For onboarding and exact copyable prompts in all three languages, use [usage.md](references/usage.md). Clearly tell visitors to attach their photos in Codex; do not present a fake web upload flow.

## Expand and share

Edit an existing world in its existing folder; allocate a new ID only for a genuinely new world. Preserve stable object IDs and existing placements. Do not reset saves or delete placed objects to conceal model changes. Check cameras and character anatomy: a character without hands needs an appropriate tasting action rather than a generic hand-held pose.

Update WORLD.md with implemented photo features, invented additions, actual checks, limitations and next entry point. For public sharing, prepare a clean copy containing only intended template/source assets. Exclude original private reference photos, personal saves, chat histories, credentials and unrelated files. If reference photos are omitted, use empty reference records and explain that omission instead of claiming the evidence is included.

Deliver a working preview, the project path, and at most three first-play steps. Explain browser-local saves and the backup entry. An installed skill can be invoked as `$photo-world-builder`; a portable copy can be used by asking Codex to read this SKILL.md. Separate generic starters, photo-customized creations and actually verified features in the handoff.
