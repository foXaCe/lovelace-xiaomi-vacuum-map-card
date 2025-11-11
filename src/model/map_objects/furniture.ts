// noinspection CssUnresolvedCustomProperty
import { css, CSSResultGroup, svg, SVGTemplateResult } from "lit";
import { MapObject } from "./map-object";
import { Context } from "./context";

export interface FurnitureConfig {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x3: number;
    y3: number;
    x: number;
    y: number;
    width: number;
    height: number;
    type: number;
    size_type: number;
    angle: number;
    scale: number;
}

// Types de meubles de l'app Dreame
const FURNITURE_ICONS: Record<number, string> = {
    1: "mdi:sofa", // Canapé
    2: "mdi:bed", // Lit
    3: "mdi:table-furniture", // Table
    4: "mdi:dresser", // Commode
    5: "mdi:toilet", // Toilettes
    6: "mdi:shower", // Douche
    7: "mdi:bathtub", // Baignoire
    8: "mdi:counter", // Comptoir
    9: "mdi:television", // TV
    10: "mdi:washing-machine", // Machine à laver
    11: "mdi:fridge", // Réfrigérateur
    12: "mdi:stove", // Cuisinière
    13: "mdi:dishwasher", // Lave-vaisselle
    14: "mdi:desk", // Bureau
    15: "mdi:bookshelf", // Bibliothèque
    16: "mdi:wardrobe", // Armoire
    17: "mdi:chair", // Chaise
    18: "mdi:door", // Porte
    19: "mdi:window-closed", // Fenêtre
    20: "mdi:radiator", // Radiateur
};

export class Furniture extends MapObject {
    private readonly _config: FurnitureConfig;

    constructor(config: FurnitureConfig, context: Context) {
        super(context);
        this._config = config;
    }

    public render(): SVGTemplateResult {
        // Convertir les 4 coins en coordonnées de la carte
        const p0 = this.vacuumToScaledMap(this._config.x0, this._config.y0);
        const p1 = this.vacuumToScaledMap(this._config.x1, this._config.y1);
        const p2 = this.vacuumToScaledMap(this._config.x2, this._config.y2);
        const p3 = this.vacuumToScaledMap(this._config.x3, this._config.y3);

        // Centre pour l'icône
        const center = this.vacuumToScaledMap(this._config.x, this._config.y);

        // Points du polygone
        const points = `${p0[0]},${p0[1]} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`;

        const icon = FURNITURE_ICONS[this._config.type] || "mdi:cube-outline";

        return svg`
            <g class="furniture-wrapper" data-furniture-type="${this._config.type}">
                <polygon class="furniture-outline"
                         points="${points}">
                </polygon>
                <foreignObject class="furniture-icon-foreign-object"
                               style="--x-furniture: ${center[0]}px; --y-furniture: ${center[1]}px;"
                               x="${center[0]}px" y="${center[1]}px"
                               width="40px" height="40px">
                    <body xmlns="http://www.w3.org/1999/xhtml">
                        <div class="furniture-icon-wrapper">
                            <div class="furniture-icon-background"></div>
                            <ha-icon icon="${icon}"></ha-icon>
                        </div>
                    </body>
                </foreignObject>
            </g>
        `;
    }

    public static get styles(): CSSResultGroup {
        return css`
            .furniture-wrapper {
                pointer-events: auto;
            }

            .furniture-outline {
                fill: var(--map-card-internal-furniture-fill-color, rgba(100, 181, 246, 0.1));
                stroke: var(--map-card-internal-furniture-stroke-color, #64b5f6);
                stroke-width: calc(var(--map-card-internal-furniture-stroke-width, 2px) / var(--map-scale));
                stroke-linejoin: round;
                stroke-dasharray:
                    calc(var(--map-card-internal-furniture-dash-length, 5px) / var(--map-scale)),
                    calc(var(--map-card-internal-furniture-dash-gap, 3px) / var(--map-scale));
                transition:
                    fill var(--map-card-internal-transitions-duration) ease,
                    stroke var(--map-card-internal-transitions-duration) ease;
                pointer-events: auto;
                cursor: pointer;
            }

            .furniture-outline:hover {
                fill: var(--map-card-internal-furniture-fill-color-hover, rgba(100, 181, 246, 0.2));
                stroke: var(--map-card-internal-furniture-stroke-color-hover, #42a5f5);
            }

            .furniture-icon-foreign-object {
                overflow: visible;
                pointer-events: none;
            }

            .furniture-icon-wrapper {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: calc(var(--map-card-internal-furniture-icon-wrapper-size, 32px) / var(--map-scale));
                height: calc(var(--map-card-internal-furniture-icon-wrapper-size, 32px) / var(--map-scale));
                transform: translate(-50%, -50%) scale(calc(1 / var(--map-scale)));
                pointer-events: auto;
                cursor: pointer;
                transition: transform var(--map-card-internal-transitions-duration) ease;
            }

            .furniture-icon-wrapper:hover {
                transform: translate(-50%, -50%) scale(calc(1.15 / var(--map-scale)));
            }

            .furniture-icon-background {
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: var(--map-card-internal-furniture-icon-background-color, rgba(100, 181, 246, 0.2));
                border: calc(1.5px / var(--map-scale)) solid
                    var(--map-card-internal-furniture-icon-border-color, #64b5f6);
                box-shadow: 0 calc(2px / var(--map-scale)) calc(6px / var(--map-scale)) rgba(0, 0, 0, 0.15);
                transition: all var(--map-card-internal-transitions-duration) ease;
            }

            .furniture-icon-wrapper ha-icon {
                position: relative;
                z-index: 1;
                color: var(--map-card-internal-furniture-icon-color, #1976d2);
                --mdc-icon-size: calc(var(--map-card-internal-furniture-icon-size, 20px) / var(--map-scale));
                transition: color var(--map-card-internal-transitions-duration) ease;
            }
        `;
    }
}
