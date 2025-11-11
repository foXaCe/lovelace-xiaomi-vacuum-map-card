import { LitElement } from "lit";

export abstract class RootlessLitElement extends LitElement {
    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this;
    }
}
