import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = this.normalizeDelimiter(delimiter);
    }

    public abstract clone(): Name;

    public asString(delimiter: string = this.delimiter): string {
        const effectiveDelimiter = this.normalizeDelimiter(delimiter);
        const parts = this.collectComponents();
        if (parts.length === 0) {
            return "";
        }
        return parts.join(effectiveDelimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        const parts = this.collectComponents();
        if (parts.length === 0) {
            return "";
        }
        const escaped = parts.map((component) => this.escapeComponent(component, DEFAULT_DELIMITER));
        return escaped.join(DEFAULT_DELIMITER);
    }

    public isEqual(other: Name): boolean {
        if (!other) {
            return false;
        }
        if (this === other) {
            return true;
        }
        const count = this.getNoComponents();
        if (count !== other.getNoComponents()) {
            return false;
        }
        for (let i = 0; i < count; i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        return true;
    }

    public getHashCode(): number {
        const s: string = this.asDataString();
        let hashCode: number = 0;
        for (let i: number = 0; i < s.length; i++) {
            let c: number = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        if (!other) {
            throw new RangeError("other must not be null or undefined");
        }
        const count = other.getNoComponents();
        for (let i = 0; i < count; i++) {
            this.append(other.getComponent(i));
        }
    }

    protected normalizeDelimiter(delimiter?: string): string {
        const value = delimiter ?? DEFAULT_DELIMITER;
        if (value.length !== 1) {
            throw new Error("Delimiter must be a single character");
        }
        return value;
    }

    protected parseComponents(source: string): string[] {
        return this.parseComponentsWithDelimiter(source, this.delimiter);
    }

    protected parseComponentsWithDelimiter(source: string, delimiter: string): string[] {
        const effectiveDelimiter = this.normalizeDelimiter(delimiter);
        if (source == null || source.length === 0) {
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
            if (ch === effectiveDelimiter) {
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

    protected escapeComponent(component: string, delimiter: string): string {
        const effectiveDelimiter = this.normalizeDelimiter(delimiter);
        let escaped = "";
        for (const ch of component) {
            if (ch === ESCAPE_CHARACTER || ch === effectiveDelimiter) {
                escaped += ESCAPE_CHARACTER;
            }
            escaped += ch;
        }
        return escaped;
    }

    private collectComponents(): string[] {
        const count = this.getNoComponents();
        const parts: string[] = [];
        for (let i = 0; i < count; i++) {
            parts.push(this.getComponent(i));
        }
        return parts;
    }
}
