import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { Coordinate } from "./Coordinate";
import { AbstractCoordinate } from "./AbstractCoordinate";

export class PolarCoordinate extends AbstractCoordinate {

    private r: number = 0;
    private phi: number = 0;

    constructor(r?: number, phi?: number) {
        super();

        this.initialize(r, phi);
    }

    protected initialize(r?: number, phi?: number): void {
        if (r != undefined) {
            IllegalArgumentException.assert(this.isValidR(r));
            this.r = r;
        }

        if (phi != undefined) {
            IllegalArgumentException.assert(this.isValidPhi(phi));
            this.phi = this.normalizePhiValue(phi);
        }
    }

    protected doCreate(x: number, y: number): Coordinate {
        let newR = Math.hypot(x, y);
        let newPhi = this.normalizePhiValue(Math.atan2(y, x));
        return new PolarCoordinate(newR, newPhi);
    }

    public asDataString(): string {
        return this.doGetR() + '#' + this.doGetPhi();
    }

    public getOrigin(): Coordinate {
        return new PolarCoordinate(0, 0);
    }
    
    protected doGetX(): number {
        return this.doGetR() * Math.cos(this.doGetPhi());
    }
    
    protected doSetX(x: number): Coordinate {
        let y: number = this.doGetY();
        let newR: number = Math.hypot(x, y);
        let newPhi: number = this.normalizePhiValue(Math.atan2(y, x));
        return new PolarCoordinate(newR, newPhi);
    }
    
    protected doGetY(): number {
        return this.doGetR() * Math.sin(this.doGetPhi());
    }

    protected doSetY(y: number): Coordinate {
        let x: number = this.doGetX();
        let newR: number = Math.hypot(x, y);
        let newPhi: number = this.normalizePhiValue(Math.atan2(y, x));
        return new PolarCoordinate(newR, newPhi);    
    }

    protected doGetR(): number {
        return this.r;
    }

    protected doSetR(r: number): Coordinate {
        IllegalArgumentException.assert(this.isValidR(r));
        return new PolarCoordinate(r, this.normalizePhiValue(this.phi));
    }

    protected doGetPhi(): number {
        return this.phi;
    }
   
    protected doSetPhi(phi: number): Coordinate {
        IllegalArgumentException.assert(this.isValidPhi(phi));
        return new PolarCoordinate(this.r, this.normalizePhiValue(phi));   
    }

}
