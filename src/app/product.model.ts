export enum Measure {
  Kilogram = 'Kg',
  Liter = 'L',
  Unit = "Unit",
  Gram = 'g',
}

export interface Product {
  id: number;
  name: string;
  measure: Measure | null;
  quantity?: number;
  price: number;
  perecible: boolean;
  validityDate?: Date;
  fabricationDate?: Date;
}