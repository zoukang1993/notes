export const FETCH_GOODS_LIST = 'FETCH_GOODS_LIST';
export const FETCH_GOOD_ITEM = 'FETCH_GOOD_ITEM';

export interface IGood {
    readonly id: number,
    readonly name: string,
    readonly price: number,
    readonly unit: string,
    readonly [propNames: string]: any,
}
