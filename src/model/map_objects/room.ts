// noinspection CssUnresolvedCustomProperty
import { css, CSSResultGroup, svg, SVGTemplateResult } from "lit";
import { forwardHaptic } from "custom-card-helpers";

import { Context } from "./context";
import { deleteFromArray } from "../../utils";
import { RoomConfig } from "../../types/types";
import {PredefinedMapObject} from "./predefined-map-object";

export class Room extends PredefinedMapObject {
    private readonly _config: RoomConfig;

    constructor(config: RoomConfig, context: Context) {
        super(config, context);
        this._config = config;
    }

    public render(): SVGTemplateResult {
        const poly = (this._config?.outline ?? []).map(p => this.vacuumToScaledMap(p[0], p[1]));
        const pointsStr = poly.map(p => p.join(", ")).join(" ");
        console.log(`🔍 [ROOM RENDER] Room ${this._config.id}:`, {
            outlinePoints: this._config?.outline?.length || 0,
            scaledPoints: poly.length,
            pointsString: pointsStr,
            selected: this._selected,
            hasIcon: !!this._config.icon,
            hasLabel: !!this._config.label
        });
        return svg`
            <g class="room-wrapper ${this._selected ? "selected" : ""}
            room-${`${this._config.id}`.replace(/[^a-zA-Z0-9_\-]/gm, "_")}-wrapper">
                <polygon class="room-outline clickable room-polygon"
                         data-room-id="${this._config.id}"
                         points="${pointsStr}"
                         @click="${async (e: MouseEvent): Promise<void> => {
                             console.log(`🖱️ [ROOM POLYGON CLICK] Room ${this._config.id} polygon clicked`, e);
                             e.stopPropagation();
                             e.preventDefault();
                             await this._click();
                         }}"
                         @mousedown="${(e: MouseEvent): void => {
                             console.log(`🖱️ [ROOM POLYGON MOUSEDOWN] Room ${this._config.id}`);
                             e.stopPropagation();
                         }}"
                         @mouseenter="${(): void => console.log(`🖱️ [ROOM HOVER] Room ${this._config.id} mouse enter`)}"
                         @mouseleave="${(): void => console.log(`🖱️ [ROOM HOVER] Room ${this._config.id} mouse leave`)}">
                </polygon>
                ${this.renderIcon(this._config.icon, () => this._click(), "room-icon-wrapper")}
                ${this.renderLabel(this._config.label, "room-label")}
            </g>
        `;
    }

    public toVacuum(): number | string {
        return this._config.id;
    }

    private async _click(): Promise<void> {
        console.log(`🔍 [ROOM CLICK] Room ${this._config.id} clicked`);
        const currentMode = this._context.getCurrentMode();
        const currentModeIsRoom = currentMode?.selectionType === 2; // SelectionType.ROOM = 2
        console.log(`🔍 [ROOM CLICK] Room ${this._config.id} - currentModeIsRoom:`, currentModeIsRoom);

        if (!currentModeIsRoom) {
            console.log(`🔍 [ROOM CLICK] Room ${this._config.id} - Activating room mode`);
            this._context.activateRoomMode();
            await new Promise(resolve => setTimeout(resolve, 150));

            const newMode = this._context.getCurrentMode();
            console.log(`🔍 [ROOM CLICK] Room ${this._config.id} - newMode selectionType:`, newMode?.selectionType);
            if (newMode?.selectionType !== 2) {
                console.log(`❌ [ROOM CLICK] Room ${this._config.id} - Failed to activate room mode, aborting`);
                return;
            }
        }

        console.log(`🔍 [ROOM CLICK] Room ${this._config.id} - selected: ${this._selected}, selectedRooms: ${this._context.selectedRooms().length}, maxSelections: ${this._context.maxSelections()}`);
        if (!this._selected && this._context.selectedRooms().length >= this._context.maxSelections()) {
            console.log(`❌ [ROOM CLICK] Room ${this._config.id} - Max selections reached`);
            forwardHaptic("failure");
            return;
        }
        this._toggleSelected();
        console.log(`🔍 [ROOM CLICK] Room ${this._config.id} - toggled to: ${this._selected}`);
        if (this._selected) {
            this._context.selectedRooms().push(this);
            console.log(`✅ [ROOM CLICK] Room ${this._config.id} - Added to selection`);
        } else {
            deleteFromArray(this._context.selectedRooms(), this);
            console.log(`➖ [ROOM CLICK] Room ${this._config.id} - Removed from selection`);
        }
        this._context.selectionChanged();
        if (await this._context.runImmediately()) {
            console.log(`🔍 [ROOM CLICK] Room ${this._config.id} - Running immediately, clearing selection`);
            this._selected = false;
            deleteFromArray(this._context.selectedRooms(), this);
            this._context.selectionChanged();
            return;
        }
        forwardHaptic("selection");
        this.update();
        console.log(`✅ [ROOM CLICK] Room ${this._config.id} - Click completed successfully`);
    }

    public static get styles(): CSSResultGroup {
        return css`
            .room-wrapper {
            }

            .room-outline {
                stroke: var(--map-card-internal-room-outline-line-color);
                stroke-width: calc(var(--map-card-internal-room-outline-line-width) / var(--map-scale));
                fill: transparent;
                fill-opacity: 0;
                stroke-opacity: 0;
                stroke-linejoin: round;
                stroke-dasharray: calc(var(--map-card-internal-room-outline-line-segment-line) / var(--map-scale)),
                    calc(var(--map-card-internal-room-outline-line-segment-gap) / var(--map-scale));
                transition: stroke var(--map-card-internal-transitions-duration) ease,
                    fill var(--map-card-internal-transitions-duration) ease,
                    stroke-opacity var(--map-card-internal-transitions-duration) ease,
                    fill-opacity var(--map-card-internal-transitions-duration) ease;
                pointer-events: auto;
                cursor: pointer;
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
                transition: color var(--map-card-internal-transitions-duration) ease,
                    background var(--map-card-internal-transitions-duration) ease;
            }

            .room-label {
                text-anchor: middle;
                dominant-baseline: middle;
                pointer-events: none;
                font-size: calc(var(--map-card-internal-room-label-font-size) / var(--map-scale));
                fill: var(--map-card-internal-room-label-color);
                transition: color var(--map-card-internal-transitions-duration) ease,
                    background var(--map-card-internal-transitions-duration) ease;
            }

            .room-wrapper.selected > .room-outline {
                stroke: var(--map-card-internal-room-outline-line-color-selected);
                fill: var(--map-card-internal-room-outline-fill-color-selected);
                stroke-opacity: 1;
                fill-opacity: 1;
            }

            .room-wrapper.selected > * > .room-icon-wrapper {
                background: var(--map-card-internal-room-icon-background-color-selected);
                color: var(--map-card-internal-room-icon-color-selected);
            }

            .room-wrapper.selected > .room-label {
                fill: var(--map-card-internal-room-label-color-selected);
            }
        `;
    }
}
