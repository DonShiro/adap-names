import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        this.delimiter = normalizeDelimiter(delimiter);
        if (!Array.isArray(source)) {
            throw new Error("source must be an array of strings");
        }
        this.components = source.slice();
    }

    public asString(delimiter: string = this.delimiter): string {
        const effectiveDelimiter = normalizeDelimiter(delimiter);
        return this.components.length === 0 ? "" : this.components.join(effectiveDelimiter);
    }

    public asDataString(): string {
        return buildDataString(this.components);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertComponentIndex(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.assertComponentIndex(i);
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        this.assertInsertIndex(i);
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        this.assertComponentIndex(i);
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        const additions: string[] = [];
        const count = other.getNoComponents();
        for (let idx = 0; idx < count; idx++) {
            additions.push(other.getComponent(idx));
        }
        if (additions.length > 0) {
            this.components.push(...additions);
        }
    }

    private assertComponentIndex(i: number): void {
        if (!Number.isInteger(i) || i < 0 || i >= this.components.length) {
            throw new RangeError(`Component index ${i} is out of bounds`);
        }
    }

    private assertInsertIndex(i: number): void {
        if (!Number.isInteger(i) || i < 0 || i > this.components.length) {
            throw new RangeError(`Insert index ${i} is out of bounds`);
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
