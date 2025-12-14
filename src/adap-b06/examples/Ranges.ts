import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class RangeBound<T> {

    protected value: T;
    protected inclusive: boolean;

    constructor(value: T, inclusive: boolean) {
        this.value = value;
        this.inclusive = inclusive;
    }

    public getValue(): T {
        return this.value;
    }

    public isInclusive(): boolean {
        return this.inclusive;
    }

}

export class Range<T> {

    protected lowerBound: RangeBound<T>;
    protected upperBound: RangeBound<T>;

    constructor(lowerBound: RangeBound<T>, upperBound: RangeBound<T>) {
        this.lowerBound = lowerBound;
        this.upperBound = upperBound;
    }

    public includes(value: T): boolean {
        IllegalArgumentException.assert(value != null);
        let lowerValue = this.lowerBound.getValue();
        let upperValue = this.upperBound.getValue();
        IllegalArgumentException.assert(this.compare(lowerValue, upperValue) <= 0);
        let lowerCompare = this.compare(value, lowerValue);
        let upperCompare = this.compare(value, upperValue);
        let lowerOk = this.lowerBound.isInclusive() ? lowerCompare >= 0 : lowerCompare > 0;
        let upperOk = this.upperBound.isInclusive() ? upperCompare <= 0 : upperCompare < 0;
        return lowerOk && upperOk;
    }

    private compare(a: T, b: T): number {
        let left = a as unknown as any;
        let right = b as unknown as any;
        if (left < right) {
            return -1;
        }
        if (left > right) {
            return 1;
        }
        return 0;
    }

    public getLowerBound(): RangeBound<T> {
        return this.lowerBound;
    }

    public getUpperBound(): RangeBound<T> {
        return this.upperBound;
    }

}
