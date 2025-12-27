export class CreateOrderDto {
  customerId!: string;
  items!: Array<{
    productId: string;
    price: number;
    quantity: number;
  }>;
  shippingAddress!: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  shippingFee!: number;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
}
