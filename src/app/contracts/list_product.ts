import { List_Product_Image } from "./list_product_image";

export class list_product {
    id: string;
    name: string;
    stock: number;
    price: number;
    createdDate: Date;
    updatedDate: Date;
    productImageFiles?: List_Product_Image[];
    imagePath: string;
}