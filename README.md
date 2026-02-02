# Dreame Vacuum Card

[![GitHub Latest Release][releases_shield]][latest_release]
[![GitHub All Releases][downloads_total_shield]][releases]

[releases_shield]: https://img.shields.io/github/release/foXaCe/lovelace-xiaomi-vacuum-map-card.svg?style=popout
[latest_release]: https://github.com/foXaCe/lovelace-xiaomi-vacuum-map-card/releases/latest
[releases]: https://github.com/foXaCe/lovelace-xiaomi-vacuum-map-card/releases
[downloads_total_shield]: https://img.shields.io/github/downloads/foXaCe/lovelace-xiaomi-vacuum-map-card/total

A custom Lovelace card for Home Assistant that provides a Dreame-app-style interface for controlling Dreame vacuum robots. Built as a fork of [Xiaomi Vacuum Map Card](https://github.com/PiotrMachowski/lovelace-xiaomi-vacuum-map-card) by Piotr Machowski, completely redesigned with a native Dreame look and feel.

## Features

### Dreame-style UI

- **Status header** with real-time display of vacuum state, cleaned area, cleaning time and battery level
- **Interactive map** with pinch-to-zoom and pan, powered by camera entity from the Dreame integration
- **Tab navigation** (Room / All / Zone) matching the official Dreame app layout
- **Cleaning mode chip** showing the current mode (sweep, mop, sweep+mop) with tap-to-cycle
- **Cleaning progress bar** displayed during active cleaning sessions
- **Context-aware action buttons** that adapt to vacuum state (clean/pause/resume/stop/dock)

### Room selection mode

- **Pixel-perfect hit testing** using the `segment_map` from the Dreame integration (blue channel encodes room IDs)
- **Canvas overlay** with smooth edges: rooms dim when entering room mode, selected rooms become bright
- **Label state management**: selected room labels are bold and opaque, dimmed rooms have reduced opacity
- **Selection counter** shown on the clean button (e.g. "Clean (3)")
- **Fallback polygon detection** when segment_map is unavailable

### Zone cleaning mode

- **Manual rectangle drawing** on the map
- **Repeat counter** (x1, x2, x3) for zone and room cleaning

### Technical highlights

- Built with **Lit** (Web Components) and **TypeScript**, bundled with **Rollup**
- **Cached Context** pattern avoids recreating closures on every render cycle
- **Cached entity lookups** for sibling sensor discovery (device_id based)
- **Smooth overlay rendering**: built at segment_map resolution then upscaled with browser smoothing
- Simplified editor with minimal configuration needed

## Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Go to "Frontend" section
3. Click the "+" button and add this repository as a custom repository
4. Search for "Dreame Vacuum Map Card"
5. Install
6. Add to [Lovelace resources](https://my.home-assistant.io/redirect/lovelace_resources/):
   ```yaml
   url: /hacsfiles/lovelace-xiaomi-vacuum-map-card/dreame-vacuum-card.js
   type: module
   ```
7. Refresh your browser

### Manual Installation

1. Download `dreame-vacuum-card.js` from the [latest release](https://github.com/foXaCe/lovelace-xiaomi-vacuum-map-card/releases/latest)
2. Save the file to `<ha config>/www/community/lovelace-xiaomi-vacuum-map-card/`
3. Add to [Lovelace resources](https://my.home-assistant.io/redirect/lovelace_resources/):
   ```yaml
   url: /local/community/lovelace-xiaomi-vacuum-map-card/dreame-vacuum-card.js
   type: module
   ```
4. Refresh your browser

## Configuration

### Minimal configuration

```yaml
type: custom:xiaomi-vacuum-map-card
entity: vacuum.your_dreame_vacuum
map_source:
  camera: camera.your_dreame_vacuum_map
calibration_source:
  camera: true
vacuum_platform: tasshackDreameVacuum
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entity` | string | **required** | Vacuum entity ID |
| `map_source.camera` | string | **required** | Camera entity providing the map image |
| `calibration_source.camera` | boolean | `true` | Use camera calibration points |
| `vacuum_platform` | string | `tasshackDreameVacuum` | Platform identifier |
| `show_title` | boolean | `false` | Show device name in the header |
| `map_locked` | boolean | `false` | Disable map pan/zoom |
| `two_finger_pan` | boolean | `false` | Require two fingers to pan |
| `language` | string | HA language | Override language for labels |

### Required integration

This card is designed to work with the [Tasshack/dreame-vacuum](https://github.com/Tasshack/dreame-vacuum) integration, which provides:

- Camera entity with the map image and room data (outlines, segment_map, calibration points)
- Vacuum entity with state and attributes
- Sensor entities for battery, cleaning time, cleaned area, cleaning progress, state
- Select entity for cleaning mode

The card automatically discovers sibling entities on the same device using `device_id`.

## How it works

### Room detection

The Dreame integration provides a `segment_map` attribute on the camera entity: a base64-encoded PNG where the blue channel of each pixel encodes the room/segment ID. The card:

1. Decodes the segment_map into an off-screen canvas (pick canvas)
2. On click, maps the click coordinates to the pick canvas
3. Reads the blue channel value to identify the room
4. Toggles room selection and updates the overlay

### Overlay rendering

When in room mode, a semi-transparent dark overlay dims the entire map. Selected rooms are "cut out" from the overlay, appearing bright. The overlay is:

1. Built at the segment_map's native resolution (typically ~265x269)
2. Upscaled to the camera image resolution with `imageSmoothingQuality: "high"`
3. This produces smooth edges instead of blocky pixels

## Requirements

- Home Assistant 2024.1.0 or newer
- A Dreame vacuum robot
- [Tasshack/dreame-vacuum](https://github.com/Tasshack/dreame-vacuum) integration installed and configured

## Development

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Development build with watch
npm run dev
```

## Acknowledgments

This project is a fork of the [Xiaomi Vacuum Map Card](https://github.com/PiotrMachowski/lovelace-xiaomi-vacuum-map-card) by **[Piotr Machowski](https://github.com/PiotrMachowski)**. His work provided the foundation for map rendering, calibration, and coordinate conversion that this card builds upon.

## License

MIT License - inherited from the original Xiaomi Vacuum Map Card.
