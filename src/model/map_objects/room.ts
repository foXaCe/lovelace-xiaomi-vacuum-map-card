// noinspection CssUnresolvedCustomProperty
import { css, CSSResultGroup, svg, SVGTemplateResult } from "lit";
import { forwardHaptic } from "custom-card-helpers";

import { Context } from "./context";
import { deleteFromArray } from "../../utils";
import { OutlineType, RoomConfig } from "../../types/types";
import { PredefinedMapObject } from "./predefined-map-object";
import { SelectionType } from "../map_mode/selection-type";

export class Room extends PredefinedMapObject {
    private readonly _config: RoomConfig;

    constructor(config: RoomConfig, context: Context) {
        super(config, context);
        this._config = config;
    }

    private _renderRoomLabel(): SVGTemplateResult | null {
        const label = this._config.label;
        if (!label) return null;
        const mapped = this.vacuumToScaledMap(label.x, label.y);
        const text = label.text ?? "";
        const fontSize = 12 / this._context.scale();
        return svg`
            <text class="room-label-text"
                  x="${mapped[0]}"
                  y="${mapped[1]}"
                  font-size="${fontSize}"
                  text-anchor="middle"
                  dominant-baseline="central"
                  pointer-events="none">
                ${text}
            </text>
        `;
    }

    public render(): SVGTemplateResult {
        const outline = this._config?.outline ?? [];

        if (!outline.length) {
            return svg`
                <g class="room-wrapper ${this._selected ? "selected" : ""} room-${`${this._config.id}`.replace(/[^a-zA-Z0-9_\-]/gm, "_")}-wrapper">
                    ${this._renderRoomLabel()}
                </g>
            `;
        }

        const poly = outline.map((p) => this.vacuumToScaledMap(p[0], p[1]));
        const pointsStr = poly.map((p) => p.join(", ")).join(" ");

        const hasAnySelection = this._context.selectedRooms().length > 0;
        const isDimmed = hasAnySelection && !this._selected;
        const classes = [
            "room-wrapper",
            this._selected ? "selected" : "",
            isDimmed ? "dimmed" : "",
            `room-${`${this._config.id}`.replace(/[^a-zA-Z0-9_\-]/gm, "_")}-wrapper`,
        ]
            .filter(Boolean)
            .join(" ");

        return svg`
            <g class="${classes}">
                <polygon class="room-outline room-polygon"
                         data-room-id="${this._config.id}"
                         points="${pointsStr}">
                </polygon>
                ${this.renderIcon(this._config.icon, () => void 0, "room-icon-wrapper")}
                ${this._renderRoomLabel()}
            </g>
        `;
    }

    public renderLabelOnly(): SVGTemplateResult {
        return svg`
            <g class="room-wrapper room-${`${this._config.id}`.replace(/[^a-zA-Z0-9_\-]/gm, "_")}-wrapper">
                ${this._renderRoomLabel()}
            </g>
        `;
    }

    public toVacuum(): number | string {
        return this._config.id;
    }

    public getOutline(): OutlineType | undefined {
        return this._config.outline;
    }

    public async toggleFromHitTest(): Promise<void> {
        const currentMode = this._context.getCurrentMode();
        const currentModeIsRoom = currentMode?.selectionType === SelectionType.ROOM;

        if (!currentModeIsRoom) {
            this._context.activateRoomMode();
            await new Promise((resolve) => setTimeout(resolve, 150));

            const newMode = this._context.getCurrentMode();
            if (newMode?.selectionType !== SelectionType.ROOM) {
                return;
            }
        }

        const isAlreadyInSelected = this._context.selectedRooms().includes(this);

        if (
            !this._selected &&
            !isAlreadyInSelected &&
            this._context.selectedRooms().length >= this._context.maxSelections()
        ) {
            forwardHaptic("failure");
            return;
        }

        this._toggleSelected();

        if (this._selected) {
            if (!isAlreadyInSelected) {
                this._context.selectedRooms().push(this);
            }
        } else {
            if (isAlreadyInSelected) {
                deleteFromArray(this._context.selectedRooms(), this);
            }
        }

        this._context.selectionChanged();

        if (await this._context.runImmediately()) {
            this._selected = false;
            deleteFromArray(this._context.selectedRooms(), this);
            this._context.selectionChanged();
            return;
        }

        forwardHaptic("selection");
        this.update();
    }

    public static get styles(): CSSResultGroup {
        return css`
            .room-wrapper {
            }

            .room-outline {
                stroke: none;
                fill: transparent;
                stroke-linejoin: round;
                pointer-events: none;
            }

            .room-icon-wrapper {
                x: var(--x-icon);
                y: var(--y-icon);
                height: var(--map-card-internal-room-icon-wrapper-size);
                width: var(--map-card-internal-room-icon-wrapper-size);
                border-radius: var(--map-card-internal-small-radius);
                transform-box: fill-box;
                overflow: hidden;
                transform: translate(
                        calc(var(--map-card-internal-room-icon-wrapper-size) / -2),
                        calc(var(--map-card-internal-room-icon-wrapper-size) / -2)
                    )
                    scale(calc(1 / var(--map-scale)));
                background: var(--map-card-internal-room-icon-background-color);
                color: var(--map-card-internal-room-icon-color);
                --mdc-icon-size: var(--map-card-internal-room-icon-size);
                transition:
                    color var(--map-card-internal-transitions-duration) ease,
                    background var(--map-card-internal-transitions-duration) ease;
            }

            .room-label-text {
                fill: rgba(255, 255, 255, 0.9);
                font-weight: 600;
                font-family: inherit;
                pointer-events: none;
                paint-order: stroke;
                stroke: rgba(0, 0, 0, 0.6);
                stroke-width: 3px;
                stroke-linecap: round;
                stroke-linejoin: round;
                transition: opacity 0.3s ease, fill 0.3s ease;
            }

            /* Mode pièce : tous les labels dimmés par défaut */
            .room-mode .room-label-text {
                opacity: 0.5;
            }

            /* Mode pièce, pièce sélectionnée : label bien visible */
            .room-mode .room-wrapper.selected .room-label-text {
                opacity: 1;
                fill: #fff;
                font-weight: 700;
            }

            /* Mode pièce, pièces non sélectionnées quand il y a une sélection */
            .room-mode .room-wrapper.dimmed .room-label-text {
                opacity: 0.3;
            }

            .room-wrapper.selected > * > .room-icon-wrapper {
                background: var(--map-card-internal-room-icon-background-color-selected);
                color: var(--map-card-internal-room-icon-color-selected);
            }

            .room-wrapper.selected .room-label-text {
                fill: #fff;
                font-weight: 700;
            }

            .room-wrapper.dimmed .room-label-text {
                opacity: 0.4;
            }
        `;
    }
}
