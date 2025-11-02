# Dreame Vacuum Map Card

[![GitHub Latest Release][releases_shield]][latest_release]
[![GitHub All Releases][downloads_total_shield]][releases]

[releases_shield]: https://img.shields.io/github/release/foXaCe/lovelace-xiaomi-vacuum-map-card.svg?style=popout
[latest_release]: https://github.com/foXaCe/lovelace-xiaomi-vacuum-map-card/releases/latest
[releases]: https://github.com/foXaCe/lovelace-xiaomi-vacuum-map-card/releases
[downloads_total_shield]: https://img.shields.io/github/downloads/foXaCe/lovelace-xiaomi-vacuum-map-card/total

A specialized fork of the Xiaomi Vacuum Map Card, optimized for Dreame vacuum robots with enhanced features and improved user experience for Home Assistant.

## 🙏 Acknowledgments

This project is a fork of the excellent work by **[Piotr Machowski](https://github.com/PiotrMachowski)** and his [Xiaomi Vacuum Map Card](https://github.com/PiotrMachowski/lovelace-xiaomi-vacuum-map-card).

**Special thanks to Piotr Machowski** for creating the original card and providing such a solid foundation. His work made this project possible, and the community owes him a debt of gratitude for his contribution to Home Assistant vacuum integrations.

This fork builds upon his excellent work with specific enhancements for Dreame vacuum users.

## ✨ Key Enhancements in This Fork

This fork includes several improvements specifically designed for Dreame vacuum robots:

### New Features
- **Return to Base Button**: Quick-access button in the bottom left corner to send your vacuum back to its charging station
- **Improved Dreame Integration**: Better compatibility with the [Tasshack/dreame-vacuum](https://github.com/Tasshack/dreame-vacuum) integration
- **Enhanced User Experience**: Streamlined controls and interface optimizations for daily use

### Recent Updates

#### Version 3.5.9
- Added return to base button with haptic feedback
- Improved button positioning and styling

#### Version 3.5.8
- Cleaned up debug logging for production use
- Fixed Lit development mode warnings

## 📦 Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Go to "Frontend" section
3. Click the "+" button
4. Search for "Dreame Vacuum Map Card"
5. Install the repository
6. Add to [Lovelace resources](https://my.home-assistant.io/redirect/lovelace_resources/):
   ```yaml
   url: /hacsfiles/lovelace-xiaomi-vacuum-map-card/dreame-vacuum-card.js
   type: module
   ```
7. Refresh your browser

### Manual Installation

1. Download `dreame-vacuum-card.js` from the [latest release](https://github.com/foXaCe/lovelace-xiaomi-vacuum-map-card/releases/latest)
2. Save the file to `<ha config>/www/custom_lovelace/`
3. Add to [Lovelace resources](https://my.home-assistant.io/redirect/lovelace_resources/):
   ```yaml
   url: /local/custom_lovelace/dreame-vacuum-card.js
   type: module
   ```
4. Restart Home Assistant if you created the `www` directory
5. Refresh your browser

## 🚀 Quick Start

### Basic Configuration

```yaml
type: custom:xiaomi-vacuum-map-card
entity: vacuum.your_dreame_vacuum
map_source:
  camera: camera.your_dreame_vacuum_map
calibration_source:
  camera: true
vacuum_platform: tasshackDreameVacuum
```

### Recommended Setup

For the best experience with Dreame vacuums, use this card in combination with:
- **[Tasshack/dreame-vacuum](https://github.com/Tasshack/dreame-vacuum)** integration
- **[Xiaomi Cloud Map Extractor](https://github.com/PiotrMachowski/Home-Assistant-custom-components-Xiaomi-Cloud-Map-Extractor)** for map generation

## 📖 Full Documentation

For complete configuration options, advanced features, and detailed setup instructions, please refer to the [original documentation](https://github.com/PiotrMachowski/lovelace-xiaomi-vacuum-map-card#configuration) which remains largely applicable to this fork.

### Key Configuration Sections

- **[Main Options](https://github.com/PiotrMachowski/lovelace-xiaomi-vacuum-map-card#main-options)** - Card title, language, presets
- **[Map Source](https://github.com/PiotrMachowski/lovelace-xiaomi-vacuum-map-card#map-source-options)** - Camera or image configuration
- **[Calibration](https://github.com/PiotrMachowski/lovelace-xiaomi-vacuum-map-card#calibration-source-options)** - Coordinate calibration setup
- **[Icons & Tiles](https://github.com/PiotrMachowski/lovelace-xiaomi-vacuum-map-card#icon-list-entry-options)** - Customize controls and information displays
- **[Map Modes](https://github.com/PiotrMachowski/lovelace-xiaomi-vacuum-map-card#map-modes-options)** - Zone cleaning, room selection, etc.

## 🎯 Supported Features

- Map-based vacuum control
- Zone cleaning (manual and saved zones)
- Room-based cleaning
- Go to target (specific coordinates)
- Path following
- Multiple map support
- Custom service calls
- Conditional icon visibility
- Fully customizable styling
- **Quick return to base** (new in this fork)

## 🔧 Requirements

- Home Assistant 2023.1.0 or newer
- A compatible Dreame vacuum robot
- Camera entity with vacuum map (via Xiaomi Cloud Map Extractor or similar)

## 🐛 Troubleshooting & Support

- Check the [FAQ section](https://github.com/PiotrMachowski/lovelace-xiaomi-vacuum-map-card/discussions/categories/faq) in the original repository
- Review [GitHub Issues](https://github.com/foXaCe/lovelace-xiaomi-vacuum-map-card/issues)
- For Dreame-specific issues, also check [Tasshack/dreame-vacuum issues](https://github.com/Tasshack/dreame-vacuum/issues)

## 📜 License

This project inherits the MIT license from the original Xiaomi Vacuum Map Card.

## 🌟 Credits

### Original Author
- **[Piotr Machowski](https://github.com/PiotrMachowski)** - Original Xiaomi Vacuum Map Card

### Original Contributors
Special thanks to the original contributors who helped shape this project:
- [Bartosz Orczyk](https://www.bratver.com)
- [Filip Schramm](https://github.com/fi-sch)
- [Kamil Dryzek](https://github.com/dryzek)
- [Marek Trochimiak](https://github.com/tromarek)

### This Fork
- **foXaCe** - Dreame-specific enhancements and optimizations

## 🔗 Related Projects

- [Tasshack/dreame-vacuum](https://github.com/Tasshack/dreame-vacuum) - Dreame Vacuum integration for Home Assistant
- [Xiaomi Cloud Map Extractor](https://github.com/PiotrMachowski/Home-Assistant-custom-components-Xiaomi-Cloud-Map-Extractor) - Extract maps from Xiaomi/Dreame cloud
- [Original Xiaomi Vacuum Map Card](https://github.com/PiotrMachowski/lovelace-xiaomi-vacuum-map-card) - The upstream project

---

**Note**: This is a community-maintained fork focused on Dreame vacuum enhancements. For the original multi-brand card with broader compatibility, visit the [original repository](https://github.com/PiotrMachowski/lovelace-xiaomi-vacuum-map-card).
