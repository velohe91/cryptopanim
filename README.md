# CryptoPanim

A pixel-art virtual world and avatar experience.

## Vision

CryptoPanim is a Web3 social environment inspired by virtual worlds such as Gaia Online. Users will be able to create and customize their own pixel-art avatars, connect their wallets, and eventually explore virtual spaces where they can interact and chat with other users.

## Avatar builder MVP

The current app is a dressing room:

- A square avatar is drawn as stacked full-frame sprites (990×990).
- The inventory filters by category (base, skin, eyes, hair, top, bottom, shoes, accessories, background).
- Equip, unequip, reset, Get Naked, and session undo update the preview immediately.
- The outfit is stored in `localStorage` under `cryptopanim.avatar.v1`.

Get Naked clears hair, clothes, accessories, and background. Base, skin, and eyes stay, because those three slots are the body.

Wallet connection, NFTs, chat, and virtual worlds are not implemented. `lib/future/` only reserves a place for them.

## Run

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm run lint
npm start
```

## Project layout

```text
app/                         Next.js App Router (Dressing Room page)
components/avatar/           Renderer, inventory, actions, saved state
lib/avatar/                  Catalog, equip rules, layer resolve, localStorage
lib/future/                  Reserved for wallet, NFT, chat, and worlds
types/avatar.ts              AvatarItem, EquippedAvatar, layer bands
public/assets/<category>/    Sprite PNGs
scripts/generate-placeholder-sprites.mjs
```

Styles use CSS Modules. The UI font is Silkscreen; the wordmark is Press Start 2P.

## Sprites

Every layer is a **990×990 PNG** on one shared canvas. `types/avatar.ts` exports that frame as `AVATAR_FRAME`. The renderer fills a square stage with each layer at the same origin. On screen the stage is at most 495px (half of 990) so the pixels stay even. Images use `image-rendering: pixelated`, with `crisp-edges` declared first so older browsers keep a hard edge.

### Body bases

The body tone is a base item. Put each 990×990 export here (transparent outside the figure):

| Tone | File |
| --- | --- |
| Light | `public/assets/base/light.png` |
| Light-Medium | `public/assets/base/light-medium.png` |
| Medium | `public/assets/base/medium.png` |
| Medium-Deep | `public/assets/base/medium-deep.png` |
| Deep | `public/assets/base/deep.png` |

An opaque body covers the skin layer underneath. Skin stays equipped so Get Naked and the required slots keep working. Where the base PNG is transparent, the skin layer shows through.

Paint order uses bands in `LAYER_Z` (low draws behind). The number on Hair front is paint order, not a pixel size.

| Band | Z |
| --- | ---: |
| Background | 0 |
| Hair, back | 10 |
| Skin | 20 |
| Body base | 30 |
| Outfit, bottom | 40 |
| Outfit, top | 50 |
| Neck accessory | 60 |
| Eyes / expression | 70 |
| Hair, front | 80 |
| Hood | 85 |
| Head accessory | 90 |
| Hands | 100 |

The wardrobe currently on disk:

| Piece | File |
| --- | --- |
| Eyes | `public/assets/eyes/expressive.png`, `left.png`, `right.png` |
| Hair | `public/assets/hair/Brown High Bun.png`, `Blonde Side Sweep.png`, `Navy Long Wave.png`, `Purple Long Layered.png`, `Pink Long Layered.png`, `Purple Long Wave.png`, `Short Bob.png`, `cyan High Bun.png` |
| Tops | `public/assets/top/casual shirt.png`, `based-tshirt.png` |
| Bottoms | `public/assets/bottom/shorts.png`, `pants.png`, `skirt.png` |
| Shoes | Add 990×990 PNGs under `public/assets/shoes/` and register them in the catalog |
| Costumes / dresses | `public/assets/costumes/` and `public/assets/dress/` (currently shown in Tops) |
| Head | `public/assets/accessory/cap.png`, `headphones.png` |
| Background | `public/assets/background/based-blue.png` |
| Skin | `public/assets/skin/light.png`, `light-medium.png`, `medium.png`, `medium-deep.png`, `deep.png` |

`public/assets/_guide/body-guide.png` is the body silhouette on that same 990 canvas. New clothes line up with it when they use the full frame and stay transparent outside the garment.

`npm run sprites` only writes a placeholder when that PNG is missing. It leaves files that are already there.

`npm run build` runs `npm run verify-assets` first. That check fails if a catalog path is missing or the PNG is not 990×990.

## Add an outfit

1. Export a 990×990 PNG, transparent outside the garment, lined up with `public/assets/_guide/body-guide.png`.
2. Save it under `public/assets/<category>/<id>.png`.
   Categories: `base`, `skin`, `eyes`, `hair`, `top`, `bottom`, `shoes`, `accessory`, `background`.
3. Append an item in `lib/avatar/catalog.ts`.

```ts
{
  id: "jacket-new",
  name: "New jacket",
  category: "top",
  blurb: "Short description shown in the inventory.",
  layers: [{ src: "/assets/top/jacket-new.png", z: LAYER_Z.top }],
}
```

Hair, hoods, and anything that passes both behind and in front of the body should register two layers with different `z` values instead of a special case in the renderer. Accessories set `slot` to `"head"`, `"neck"`, or `"hands"`. One item can be equipped per slot.

`offsetX` and `offsetY` on a layer are nudges in source pixels. Leave them at 0 while art uses the full frame.

The dressing room treats every catalog item as owned. When inventory becomes real, change `listOwnedItems()` in `lib/avatar/catalog.ts` only.

## Save format

```json
{
  "version": 1,
  "equipped": {
    "baseId": "medium",
    "skinId": "skin-medium",
    "eyesId": "expressive",
    "hairId": "high-bun",
    "topId": "casual-shirt",
    "bottomId": "shorts",
    "accessories": { "head": "cap" },
    "backgroundId": "based-blue"
  }
}
```

Unknown item ids are dropped on load. Undo history is not stored.

## Technology

- Next.js (App Router)
- TypeScript
- React
- CSS Modules

## License

Powered by VΣLOHE SYSTEM
