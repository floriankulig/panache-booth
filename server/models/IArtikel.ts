export interface IArtikel{
  articleId: number;
  articleName: string;
  articleDescription: string;
  articleCategory: string;
  coupon: string;
  articlePrice: number;
  vendorId: number;
  purchases: number;
  inventory: number;
  isVisible: number;
}