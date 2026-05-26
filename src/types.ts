export interface Address {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  email: string;
}

export interface InvoiceItem {
  description: string;
  detail?: string;
  qty: number;
  unitPrice: number;
}

export interface DiscountLine {
  label: string;
  amount: number;
}

export interface PaymentMethod {
  label: string;
  last4: string;
}

export interface PaymentAddress {
  name: string;
  line1: string;
  line2: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  receiptNumber: string;
  datePaid: string;
  vatRegistration: string;
  fromCompany: Address;
  billTo: Address;
  items: InvoiceItem[];
  discounts: DiscountLine[];
  paymentMethod: PaymentMethod;
  paymentNote: string;
  paymentAddress: PaymentAddress;
  currency: string;
  currencySymbol: string;
}

export type Country = "US" | "CN" | "UK";
