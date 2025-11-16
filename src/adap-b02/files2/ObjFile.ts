import { File } from "./File";

export class ObjFile implements File {

    protected data: Object[] = [];
    protected length: number = 0;
    protected opened: boolean = false;
    protected deleted: boolean = false;

    public isEmpty(): boolean {
        return this.length === 0;
    }

    public isOpen(): boolean {
        return this.opened;
    }

    public isClosed(): boolean {
        return !this.opened;
    }

    public open(): void {
        this.assertNotDeleted();
        this.assertIsClosedFile();
        this.opened = true;
    }

    public read(): Object[] {
        this.assertIsOpenFile();
        return this.data.slice();
    }

    public write(data: Object[]): void {
        this.assertIsOpenFile();
        if (!Array.isArray(data)) {
            throw new Error("ObjFile.write expects an array");
        }
        this.data = data.slice();
        this.length = this.data.length;
    }

    public close(): void {
        this.assertIsOpenFile();
        this.opened = false;
    }

    public delete(): void {
        this.assertNotDeleted();
        this.assertIsClosedFile();
        this.deleted = true;
        this.opened = false;
        this.data = [];
        this.length = 0;
    }

    protected assertIsOpenFile(): void {
        this.assertNotDeleted();
        if (!this.opened) {
            throw new Error("File must be open");
        }
    }

    protected assertIsClosedFile(): void {
        this.assertNotDeleted();
        if (this.opened) {
            throw new Error("File must be closed");
        }
    }

    protected assertNotDeleted(): void {
        if (this.deleted) {
            throw new Error("File has been deleted");
        }
    }

}
