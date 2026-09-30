# Photo World Builder

Read world.json, references.json and WORLD.md before editing. Inspect actual reference images; initialization does not interpret photos. Preserve the accepted direction.

Keep world.id and object IDs stable for existing worlds. Create a new ID only for a new world. Preserve prior versions and do not overwrite photos or unrelated work. Keep private references, chat histories, secrets and personal saves out of public packages.

Maintain Chinese/English/Japanese interface text in i18n.js. Update explicit i18n fields when editing config copy. Do not translate custom names without an intended translation. Do not change IDs or reset saves to switch language.

Serve over HTTP; vendor/ contains the required runtime. Verify the changed actions, camera, language display and refresh persistence. Record actual results in WORLD.md.
