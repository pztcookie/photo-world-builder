# Photo World Builder · 照片小世界 · 写真から小さな世界へ

Turn 1–6 photos into a personal, playable little 3D world with Codex. Decorate a cottage, share a treat with little friends, and keep a photo of the moment.

**v0.2 preview:** Chinese, English and Japanese guide + playable interface. Photo interpretation and personalized building happen in Codex. The website provides a guide and three playable demos; it is not a self-service photo-generation backend.

- [中文指南与试玩](https://pztcookie.github.io/photo-world-builder/?lang=zh)
- [English guide & demos](https://pztcookie.github.io/photo-world-builder/?lang=en)
- [日本語ガイド・体験版](https://pztcookie.github.io/photo-world-builder/?lang=ja)
- [Download the portable skill](https://pztcookie.github.io/photo-world-builder/photo-world-builder.zip)

## Start creating

1. Download and unzip `photo-world-builder.zip`.
2. Ask Codex to read `photo-world-builder/SKILL.md`, or install the folder in `~/.codex/skills/` and invoke `$photo-world-builder`.
3. Attach 1–6 photos in Codex and send the prompt below. One photo is enough; a name and style are optional.

> Use the Photo World Builder template to build my little world from these photos. The detail I most want to keep is: ____.

### 中文

下载并解压 skill，让 Codex 读取其中的 `SKILL.md`。

**现在就可以在这里上传 1–6 张照片**，然后发：

> 用照片小世界模板，根据这些照片搭建我的小世界。我最想保留的细节是：____。

名字和风格暂时没想好也可以，一张照片就能开始。“这里”指 Codex 对话，网页本身提供试玩与指南。

### 日本語

skill をダウンロードして解凍し、Codex に `SKILL.md` を読み込んでもらいます。Codex の会話に写真を1〜6枚添付して、こう送ってください：

> 写真の小さな世界テンプレートを使って、この写真から自分の世界を作ってください。いちばん残したい特徴は：____。

名前やスタイルが決まっていなくても大丈夫。写真1枚から始められます。

## Run locally

Python 3 and a browser with WebGL are needed for local previews. No npm, API key or external CDN is required to play.

```sh
python3 photo-world-builder/scripts/serve.py . --port 5196
```

Open `http://127.0.0.1:5196/`. For a new independent starter:

```sh
python3 photo-world-builder/scripts/create_world.py --name 'My Little World' --preset coast --output ../my-little-world --photos /path/to/photo.jpg
python3 photo-world-builder/scripts/validate_world.py ../my-little-world
python3 ../my-little-world/launch.py
```

The initializer copies photos and assigns an independent world ID. Codex must then inspect and interpret the photos, customize models, and verify the result. Choose `coast`, `tea`, or `garden` as a starting point.

## Languages and saves

Choose 中文 / English / 日本語 in the top right. Share a specific language using `?lang=zh`, `?lang=en` or `?lang=ja`. URL selection takes priority over saved preference and browser language; unsupported languages fall back to English.

Language changes preserve the world ID and saved layout. Custom names are translated only when explicit translations exist. Existing memories, captions and text inside photos retain their original language. Save a caption before changing language because the interface reloads.

Progress stays in each visitor's browser at that website address. Use **My memories → Export world backup** before changing browsers, devices or preview addresses, then restore in the same world. The album holds 12 photos; they can also be downloaded individually. There is no cloud sync or multiplayer.

## Project layout

- `photo-world-builder/`: portable Codex skill, scripts, presets and a self-contained starter.
- `examples/`: three independent playable demos.
- `index.html`, `guide.js`, `guide-content.js`: multilingual guide.
- `tests/`: persistence, localization and project creation checks.
- `TEST_REPORT.md`: checks performed and their limits.

The public package contains no original private reference photos, personal saves, chat history or credentials. Public demo reference records are intentionally empty. Local creator copies may retain their own reference evidence.

```sh
node --test tests/*.test.mjs
python3 tests/create_world_test.py
```

## License and credits

Template code and documentation: MIT. Three.js: MIT; Chewy font: Apache 2.0. Their license notices are included in each `vendor/` folder. Photos supplied by users remain their own materials and are not included in this repository.

The reusable workflow grew out of Cookie Cottage. This is an original small-world starter, independent of Nintendo and Animal Crossing.
