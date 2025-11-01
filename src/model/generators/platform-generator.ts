import * as tasshackDreameVacuumTemplate from "./platform_templates/Tasshack_dreame-vacuum.json";
import {
    CalibrationPoint,
    IconTemplate,
    MapModeConfig,
    PlatformTemplate,
    TileFromAttributeTemplate,
    TileFromSensorTemplate,
    VariablesStorage,
} from "../../types/types";
import { SelectionType } from "../map_mode/selection-type";

export class PlatformGenerator {
    public static DEFAULT_PLATFORM = "Dreame";
    public static TASSHACK_DREAME_VACUUM_PLATFORM = "Dreame";

    private static DOCUMENTATION_URL_FORMAT =
        "https://github.com/PiotrMachowski/lovelace-xiaomi-vacuum-map-card/tree/master/docs/templates/{0}.md";

    private static TEMPLATES = new Map<string, PlatformTemplate>([
        [PlatformGenerator.TASSHACK_DREAME_VACUUM_PLATFORM, tasshackDreameVacuumTemplate as PlatformTemplate],
    ]);

    private static TEMPLATE_DOCUMENTATIONS_URLS = new Map<string, string>([
        [PlatformGenerator.TASSHACK_DREAME_VACUUM_PLATFORM, "tasshackDreameVacuum"],
    ]);

    public static getPlatformsWithDefaultCalibration(): string[] {
        return [];
    }

    public static getPlatforms(): string[] {
        return Array.from(PlatformGenerator.TEMPLATES.keys());
    }

    public static getPlatformName(platform: string | undefined): string {
        return platform ?? PlatformGenerator.TASSHACK_DREAME_VACUUM_PLATFORM;
    }

    public static getPlatformsDocumentationUrl(platform: string): string {
        const file = PlatformGenerator.TEMPLATE_DOCUMENTATIONS_URLS.get(platform) ?? "tasshackDreameVacuum";
        return PlatformGenerator.DOCUMENTATION_URL_FORMAT.replace("{0}", file);
    }

    public static isValidModeTemplate(platform: string, template?: string): boolean {
        return (
            template !== undefined &&
            Object.keys(this.getPlatformTemplate(platform).map_modes.templates).includes(template)
        );
    }

    public static getModeTemplate(platform: string, template: string): MapModeConfig {
        return this.getPlatformTemplate(platform).map_modes.templates[template];
    }

    public static generateDefaultModes(platform: string): MapModeConfig[] {
        return this.getPlatformTemplate(platform).map_modes.default_templates.map(dt => ({ template: dt }));
    }

    public static getTilesFromAttributesTemplates(platform: string): TileFromAttributeTemplate[] {
        return this.getPlatformTemplate(platform).tiles?.from_attributes ?? [];
    }

    public static getTilesFromSensorsTemplates(platform: string): TileFromSensorTemplate[] {
        return this.getPlatformTemplate(platform).tiles?.from_sensors ?? [];
    }

    public static getIconsTemplates(platform: string): IconTemplate[] {
        return this.getPlatformTemplate(platform).icons ?? [];
    }

    public static getRoomsTemplate(platform: string): string | undefined {
        const platformTemplate = this.getPlatformTemplate(platform);
        for (const templateName in platformTemplate.map_modes.templates) {
            const template = platformTemplate.map_modes.templates[templateName];
            if (template.selection_type === SelectionType[SelectionType.ROOM]) {
                return templateName;
            }
        }
        return undefined;
    }

    public static getCalibration(platform: string | undefined): CalibrationPoint[] | undefined {
        return this.getPlatformTemplate(PlatformGenerator.getPlatformName(platform)).calibration_points;
    }

    public static getVariables(platform: string | undefined): VariablesStorage | undefined {
        return this.getPlatformTemplate(PlatformGenerator.getPlatformName(platform)).internal_variables;
    }

    private static getPlatformTemplate(platform: string): PlatformTemplate {
        return (
            this.TEMPLATES.get(platform) ??
            this.TEMPLATES.get(this.TASSHACK_DREAME_VACUUM_PLATFORM) ??
            tasshackDreameVacuumTemplate as PlatformTemplate
        );
    }
}
