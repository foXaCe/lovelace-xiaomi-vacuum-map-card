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
        return svg`
            <g class="room-wrapper ${this._selected ? "selected" : ""} 
            room-${`${this._config.id}`.replace(/[^a-zA-Z0-9_\-]/gm, "_")}-wrapper">
                <polygon class="room-outline clickable"
                         points="${poly.map(p => p.join(", ")).join(" ")}"
                         @click="${async (): Promise<void> => this._click()}">
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
        console.log("=== Room badge clicked ===");
        console.log("Room ID:", this._config.id);
        console.log("Current mode:", this._context.getCurrentMode());

        // Toujours activer le mode nettoyage de pièce lors du clic
        const currentMode = this._context.getCurrentMode();
        const currentModeIsRoom = currentMode?.selectionType === 2; // SelectionType.ROOM = 2
        console.log("Is already in room mode?", currentModeIsRoom);
        console.log("Current selectionType:", currentMode?.selectionType);
        console.log("Current template:", currentMode?.config?.template);

        if (!currentModeIsRoom) {
            console.log(">>> Switching to room mode...");
            // Basculer vers le mode pièce
            this._context.activateRoomMode();
            // Attendre un peu que le mode soit activé
            await new Promise(resolve => setTimeout(resolve, 150));

            const newMode = this._context.getCurrentMode();
            console.log(">>> After switch - new mode:", newMode);
            console.log(">>> New selectionType:", newMode?.selectionType);
            console.log(">>> New template:", newMode?.config?.template);

            if (newMode?.selectionType !== 2) {
                console.error("❌ Failed to switch to room mode!");
                return;
            }
            console.log("✓ Room mode activated successfully");
        }

        if (!this._selected && this._context.selectedRooms().length >= this._context.maxSelections()) {
            console.log("Max selections reached");
            forwardHaptic("failure");
            return;
        }
        this._toggleSelected();
        console.log("Room selected:", this._selected);
        if (this._selected) {
            this._context.selectedRooms().push(this);
        } else {
            deleteFromArray(this._context.selectedRooms(), this);
        }
        this._context.selectionChanged();
        console.log("Running immediately?");
        if (await this._context.runImmediately()) {
            console.log("Running cleaning immediately");
            this._selected = false;
            deleteFromArray(this._context.selectedRooms(), this);
            this._context.selectionChanged();
            return;
        }
        console.log("Selection complete");
        forwardHaptic("selection");
        this.update();
    }

    public static get styles(): CSSResultGroup {
        return css`
            .room-wrapper {
            }

            .room-outline {
                stroke: var(--map-card-internal-room-outline-line-color);
                stroke-width: calc(var(--map-card-internal-room-outline-line-width) / var(--map-scale));
                fill: var(--map-card-internal-room-outline-fill-color);
                stroke-linejoin: round;
                stroke-dasharray: calc(var(--map-card-internal-room-outline-line-segment-line) / var(--map-scale)),
                    calc(var(--map-card-internal-room-outline-line-segment-gap) / var(--map-scale));
                transition: stroke var(--map-card-internal-transitions-duration) ease,
                    fill var(--map-card-internal-transitions-duration) ease;
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
