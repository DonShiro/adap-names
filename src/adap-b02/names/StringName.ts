import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;
    private components: string[] = [];

    constructor(source: string, delimiter?: string) {
        this.delimiter = normalizeDelimiter(delimiter);
        const initialSource = source ?? "";
        if (initialSource.length === 0) {
            this.components = [];
        } else {
            this.components = parseComponents(initialSource, this.delimiter);
        }
        this.updateDerivedState();
    }

    public asString(delimiter: string = this.delimiter): string {
        const effectiveDelimiter = normalizeDelimiter(delimiter);
        if (this.components.length === 0) {
            return "";
        }
        if (effectiveDelimiter === this.delimiter) {
            return this.name;
        }
        return this.components.join(effectiveDelimiter);
    }

    public asDataString(): string {
        return buildDataString(this.components);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        this.assertComponentIndex(x);
        return this.components[x];
    }

    public setComponent(n: number, c: string): void {
        this.assertComponentIndex(n);
        this.components[n] = c;
        this.updateDerivedState();
    }

    public insert(n: number, c: string): void {
        this.assertInsertIndex(n);
        this.components.splice(n, 0, c);
        this.updateDerivedState();
    }

    public append(c: string): void {
        this.components.push(c);
        this.updateDerivedState();
    }

    public remove(n: number): void {
        this.assertComponentIndex(n);
        this.components.splice(n, 1);
        this.updateDerivedState();
    }

    public concat(other: Name): void {
        const additions: string[] = [];
        const count = other.getNoComponents();
        for (let i = 0; i < count; i++) {
            additions.push(other.getComponent(i));
        }
        if (additions.length > 0) {
            this.components.push(...additions);
            this.updateDerivedState();
        }
    }

    private updateDerivedState(): void {
        this.noComponents = this.components.length;
        this.name = this.noComponents === 0 ? "" : this.components.join(this.delimiter);
    }

    private assertComponentIndex(index: number): void {
        if (!Number.isInteger(index) || index < 0 || index >= this.components.length) {
            throw new RangeError(`Component index ${index} is out of bounds`);
        }
    }

    private assertInsertIndex(index: number): void {
        if (!Number.isInteger(index) || index < 0 || index > this.components.length) {
            throw new RangeError(`Insert index ${index} is out of bounds`);
        }
    }

}

function normalizeDelimiter(delimiter?: string): string {
    const value = delimiter ?? DEFAULT_DELIMITER;
    if (value.length !== 1) {
        throw new Error("Delimiter must be a single character");
    }
    return value;
}

function buildDataString(components: string[]): string {
    if (components.length === 0) {
        return "";
    }
    return components
        .map((component) => escapeComponent(component, DEFAULT_DELIMITER))
        .join(DEFAULT_DELIMITER);
}

function escapeComponent(component: string, delimiter: string): string {
    let escaped = "";
    for (const ch of component) {
        if (ch === ESCAPE_CHARACTER || ch === delimiter) {
            escaped += ESCAPE_CHARACTER;
        }
        escaped += ch;
    }
    return escaped;
}

function parseComponents(source: string, delimiter: string): string[] {
    if (source.length === 0) {
        return [];
    }
    const components: string[] = [];
    let buffer = "";
    let escaping = false;
    for (const ch of source) {
        if (escaping) {
            buffer += ch;
            escaping = false;
            continue;
        }
        if (ch === ESCAPE_CHARACTER) {
            escaping = true;
            continue;
        }
        if (ch === delimiter) {
            components.push(buffer);
            buffer = "";
            continue;
        }
        buffer += ch;
    }
    if (escaping) {
        buffer += ESCAPE_CHARACTER;
    }
    components.push(buffer);
    return components;
}
