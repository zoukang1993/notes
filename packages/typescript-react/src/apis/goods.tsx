import {
    IGood,
} from '../constants/goods';

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

export const fetchGoodItem = (id: number): IGood => {
    const result = data.filter(item => item && item.id === id);
    return result[0];
}