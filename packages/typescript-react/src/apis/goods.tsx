interface IGood {
    readonly id: number,
    readonly name: string,
    readonly price: number,
    readonly unit: string,
    readonly [propNames: string]: any,
}

const data: IGood[] = [
    {
        id: 1,
        name: 'goods1',
        price: 1000,
        unit: 'tai',
    },
    {
        id: 2,
        name: 'goods2',
        price: 2000,
        unit: 'tai',
    },
];


export const fetchGoodList = (): IGood[] => {
    return data;
}