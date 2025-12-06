import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

    public findNodes(bn: string): Set<Node> {
        try {
            const result = super.findNodes(bn);
            for (const child of this.childNodes) {
                const matches = child.findNodes(bn);
                for (const node of matches) {
                    result.add(node);
                }
            }
            return result;
        } catch (ex) {
            if (ex instanceof ServiceFailureException) {
                throw ex;
            }
            if (ex instanceof InvalidStateException) {
                throw new ServiceFailureException("findNodes failed", ex);
            }
            throw ex;
        }
    }

}
