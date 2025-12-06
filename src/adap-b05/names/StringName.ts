import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;
    protected components: string[] = [];

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        const initialSource = source ?? "";
        this.components = this.parseComponents(initialSource);
        this.updateDerivedState();
    }

    public clone(): Name {
        const copy = new StringName("", this.delimiter);
        copy.components = this.components.slice();
        copy.updateDerivedState();
        return copy;
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
        return this.noComponents;
    }

    public getComponent(i: number): string {
        this.assertComponentIndex(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        this.assertComponentIndex(i);
        this.assertComponentValue(c);
        this.components[i] = c;
        this.updateDerivedState();
    }

    public insert(i: number, c: string) {
        this.assertInsertIndex(i);
        this.assertComponentValue(c);
        this.components.splice(i, 0, c);
        this.updateDerivedState();
    }

    public append(c: string) {
        this.assertComponentValue(c);
        this.components.push(c);
        this.updateDerivedState();
    }

    public remove(i: number) {
        this.assertComponentIndex(i);
        this.components.splice(i, 1);
        this.updateDerivedState();
    }

    public concat(other: Name): void {
        super.concat(other);
        this.updateDerivedState();
    }

    private updateDerivedState(): void {
        this.noComponents = this.components.length;
        this.name = this.noComponents === 0 ? "" : this.components.join(this.delimiter);
    }

    private assertComponentIndex(index: number): void {
        if (!Number.isInteger(index) || index < 0 || index >= this.components.length) {
            throw new RangeError("Component index is out of bounds");
        }
    }

    private assertInsertIndex(index: number): void {
        if (!Number.isInteger(index) || index < 0 || index > this.components.length) {
            throw new RangeError("Insert index is out of bounds");
        }
    }

    private assertComponentValue(value: string): void {
        if (typeof value !== "string") {
            throw new TypeError("Component must be a string");
        }
    }

}
