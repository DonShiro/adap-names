import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        if (!Array.isArray(source)) {
            throw new Error("source must be an array of strings");
        }
        this.components = source.map((c) => this.validateComponent(c));
    }

    public clone(): Name {
        return new StringArrayName(this.components.slice(), this.delimiter);
    }

    public asString(delimiter: string = this.delimiter): string {
        return super.asString(delimiter);
    }

    public asDataString(): string {
        return super.asDataString();
    }

    public isEqual(other: Name): boolean {
        return super.isEqual(other);
    }

    public getHashCode(): number {
        return super.getHashCode();
    }

    public isEmpty(): boolean {
        return super.isEmpty();
    }

    public getDelimiterCharacter(): string {
        return super.getDelimiterCharacter();
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertComponentIndex(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        this.assertComponentIndex(i);
        this.components[i] = this.validateComponent(c);
    }

    public insert(i: number, c: string) {
        this.assertInsertIndex(i);
        this.components.splice(i, 0, this.validateComponent(c));
    }

    public append(c: string) {
        this.components.push(this.validateComponent(c));
    }

    public remove(i: number) {
        this.assertComponentIndex(i);
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        super.concat(other);
    }

    private assertComponentIndex(i: number): void {
        if (!Number.isInteger(i) || i < 0 || i >= this.components.length) {
            throw new RangeError("Component index is out of bounds");
        }
    }

    private assertInsertIndex(i: number): void {
        if (!Number.isInteger(i) || i < 0 || i > this.components.length) {
            throw new RangeError("Insert index is out of bounds");
        }
    }

    private validateComponent(c: string): string {
        if (typeof c !== "string") {
            throw new TypeError("Component must be a string");
        }
        return c;
    }
}
