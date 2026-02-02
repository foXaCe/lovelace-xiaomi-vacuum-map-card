import { LitElement, html, css, TemplateResult, CSSResultGroup, nothing } from "lit";
import { customElement, property } from "lit/decorators";
import { HomeAssistantFixed } from "../types/fixes";
import { localize } from "../localize/localize";

type VacuumState =
    | "idle"
    | "docked"
    | "returning"
    | "charged"
    | "cleaning"
    | "segment_cleaning"
    | "zoned_cleaning"
    | "paused";

interface ButtonConfig {
    label: string;
    icon: string;
    cssClass: string;
    action: () => void;
}

@customElement("dreame-action-buttons")
export class ActionButtons extends LitElement {
    @property({ attribute: false })
    public hass!: HomeAssistantFixed;

    @property({ type: String })
    public entityId!: string;

    @property({ type: String })
    public activeTab: "room" | "all" | "zone" = "all";

    @property({ type: Boolean })
    public hasSelection = false;

    @property({ type: Number })
    public selectionCount = 0;

    private _callService(action: string): void {
        if (!this.hass || !this.entityId) return;
        this.hass.callService("vacuum", action, { entity_id: this.entityId });
    }

    private _fireEvent(eventName: string): void {
        this.dispatchEvent(
            new CustomEvent(eventName, {
                bubbles: true,
                composed: true,
            })
        );
    }

    private get _lang(): string {
        return this.hass?.locale?.language ?? "";
    }

    private _getSelectionButtons(): [ButtonConfig, ButtonConfig] {
        const cleanLabel = localize("dreame_ui.action.clean", this._lang);
        const countSuffix = this.selectionCount > 0 ? ` (${this.selectionCount})` : "";
        const primary: ButtonConfig = {
            label: `${cleanLabel}${countSuffix}`,
            icon: "mdi:play",
            cssClass: "primary",
            action: () => this._fireEvent("action-run"),
        };
        const secondary: ButtonConfig = {
            label: localize("dreame_ui.action.cancel", this._lang),
            icon: "mdi:close",
            cssClass: "secondary",
            action: () => this._fireEvent("action-cancel"),
        };
        return [primary, secondary];
    }

    private _getStateButtons(state: string): [ButtonConfig, ButtonConfig] {
        const lang = this._lang;
        switch (state) {
            case "cleaning":
            case "segment_cleaning":
            case "zoned_cleaning":
                return [
                    {
                        label: localize("dreame_ui.action.pause", lang),
                        icon: "mdi:pause",
                        cssClass: "primary warning",
                        action: () => this._callService("pause"),
                    },
                    {
                        label: localize("dreame_ui.action.stop", lang),
                        icon: "mdi:stop",
                        cssClass: "secondary",
                        action: () => this._callService("stop"),
                    },
                ];
            case "paused":
                return [
                    {
                        label: localize("dreame_ui.action.resume", lang),
                        icon: "mdi:play",
                        cssClass: "primary",
                        action: () => this._callService("start"),
                    },
                    {
                        label: localize("dreame_ui.action.stop", lang),
                        icon: "mdi:stop",
                        cssClass: "secondary",
                        action: () => this._callService("stop"),
                    },
                ];
            case "idle":
            case "docked":
            case "returning":
            case "charged":
            default:
                return [
                    {
                        label: localize("dreame_ui.action.clean", lang),
                        icon: "mdi:play",
                        cssClass: "primary",
                        action: () => this._callService("start"),
                    },
                    {
                        label: localize("dreame_ui.action.dock", lang),
                        icon: "mdi:eject",
                        cssClass: "secondary",
                        action: () => this._callService("return_to_base"),
                    },
                ];
        }
    }

    protected render(): TemplateResult | typeof nothing {
        if (!this.hass || !this.entityId) {
            return nothing;
        }

        const stateObj = this.hass.states[this.entityId];
        if (!stateObj) {
            return nothing;
        }

        const vacuumState = stateObj.state as VacuumState;

        const useSelectionButtons = (this.activeTab === "room" || this.activeTab === "zone") && this.hasSelection;

        const [primary, secondary] = useSelectionButtons
            ? this._getSelectionButtons()
            : this._getStateButtons(vacuumState);

        return html`
            <div class="actions">
                <button class="action-btn ${primary.cssClass}" @click=${primary.action}>
                    <ha-icon .icon=${primary.icon}></ha-icon>
                    ${primary.label}
                </button>
                <button class="action-btn ${secondary.cssClass}" @click=${secondary.action}>
                    <ha-icon .icon=${secondary.icon}></ha-icon>
                    ${secondary.label}
                </button>
            </div>
        `;
    }

    public static get styles(): CSSResultGroup {
        return css`
            :host {
                display: block;
                padding: 8px 16px 16px;
            }

            .actions {
                display: flex;
                gap: 12px;
            }

            .action-btn {
                flex: 1;
                padding: 14px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                border: none;
                cursor: pointer;
                font-size: 15px;
                font-weight: 600;
                font-family: inherit;
                transition: opacity 0.2s;
            }

            .action-btn:active {
                opacity: 0.7;
            }

            .action-btn.primary {
                background: #4ade80;
                color: #000;
            }

            .action-btn.primary.warning {
                background: #f59e0b;
                color: #000;
            }

            .action-btn.primary.danger {
                background: #ef4444;
                color: #fff;
            }

            .action-btn.secondary {
                background: var(--secondary-background-color, #374151);
                color: var(--primary-text-color);
            }

            .action-btn ha-icon {
                --mdc-icon-size: 20px;
            }
        `;
    }
}
