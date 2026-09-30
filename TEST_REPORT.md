# v0.2 preview checks · 2026-09-30

## Automated

- 8 Node tests: locale precedence/fallback, explicit translations without identity changes, saved placements across display languages, custom text interpolation, storage isolation, quota failure rollback, backup validation and corrupt-save preservation.
- 2 Python tests: independent portable projects, no overwrite, custom name preserved across locale metadata, byte-for-byte reference copying with pending review, invalid coordinates rejected. The reference fixture is a tiny synthetic PNG; no private photo is needed to run tests.
- Configuration/dependency validation for the starter and three examples.
- Codex skill frontmatter validation and JavaScript syntax checks.

## Browser verification

- Chinese guide contains the requested 1–6 photo prompt, optional name/style reassurance, skill download and clear Codex upload instructions.
- English guide prompt-copy action and translated navigation.
- English decorating: object choices, description, placement controls and position text.
- Moved a decoration in English; selected Japanese in the actual language selector; reopened decorating and confirmed the same saved coordinates.
- Japanese food/friend choices and a shared meal.
- Japanese photo capture and album save; switched to English and confirmed the same photo/caption remained.
- Previous Chinese photos/memories remained intact. These records intentionally retain their original language.
- Responsive checks at 402×874 and desktop size; no horizontal document overflow in the checked narrow world.
- No console errors observed in the checked world.

## Limits

This is a preview for user trial, not a final acceptance release. Phone checks use a narrow desktop browser viewport, not a physical device. Original reference photos are excluded from the public copy. Personalized photo reconstruction, new actions, multiplayer and cloud save are not provided by a backend. Codex performs the creative work.
