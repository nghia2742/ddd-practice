export class OrderResponseDto {
  id!: string;
  customerId!: string;
  items!: Array<{
    id: string;
    productId: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  status!: string;
  shippingAddress!: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  shippingFee!: number;
  taxAmount!: number;
  totalAmount!: number;
  discount?: {
    type: string;
    value: number;
  };
  createdAt!: Date;
  paidAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
}
