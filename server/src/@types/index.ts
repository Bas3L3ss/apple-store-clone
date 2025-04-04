export interface ShippingAddress {
  fullAddress: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
import { Types } from "mongoose";

export interface Account {
  username: string;
  password: string;
  role: "user" | "admin";
  email: string;
  avatar?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  productImages: string[];
  slug: string;
  basePrice: number;
  category: string;
  stock: number;
  productSelectionStep: string[];
  productOptions: ProductOption[];
  isFeatured: boolean;
}
export interface ProductOption extends Document {
  _id: Types.ObjectId;

  productId: Types.ObjectId;
  color?: string;
  material?: string;
  storage?: string;
  size?: string;
  processor?: string;
  accessories?: string;
  carrier?: string;
  price: number;
  stock: number;
}
export interface CartItem extends Document {
  productId: Types.ObjectId;
  selectedOptions: Types.ObjectId[];
  userId: Types.ObjectId;
  quantity: number;
  totalPrice: number;
}

export interface OrderItem extends Document {
  orderId: Types.ObjectId;
  productId: Types.ObjectId;
  selectedOptions: Types.ObjectId[];
  quantity: number;
  finalPrice: number;
}

export enum OrderStatus {
  PREPARING = "preparing",
  DELIVERING = "delivering",
  FINISHED = "finished",
}

export enum PaymentMethod {
  COD = "cod:cash-on-delivery",
  PP = "pp:paypal",
  CC = "CC:credit-card",
  AC = "ac:apple-card",
}
export interface Order extends Document {
  userId: Types.ObjectId;
  calculatedTotal: number;
  items: Types.ObjectId[];
  shippingAddress?: string;
  orderNotes: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  estimatedDelivery: Date;
}

export interface ShippingAddress {
  fullAddress: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Define valid subjects as a TypeScript union type
export type EmailSubject =
  | "Payment Succeeded"
  | "User Logged In"
  | "Order Status Changed";
