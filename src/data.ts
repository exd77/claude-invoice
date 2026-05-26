import type { Address, InvoiceData, Country, PaymentAddress } from "./types";

const rand = () => Math.random().toString(36).substring(2, 6).toUpperCase();
const num = () => Math.floor(1000 + Math.random() * 9000);

export function generateId(): string {
  return `${num()}-${rand()}-${num()}`;
}

export const COUNTRY_PRESETS: Record<Country, { label: string; currency: string; symbol: string; locale: string }> = {
  US: { label: "United States", currency: "USD", symbol: "$", locale: "en-US" },
  CN: { label: "China", currency: "CNY", symbol: "¥", locale: "zh-CN" },
  UK: { label: "United Kingdom", currency: "GBP", symbol: "£", locale: "en-GB" },
};

const COMPANY_ADDRESSES: Record<Country, Address> = {
  US: {
    name: "Anthropic, PBC",
    line1: "548 Market Street",
    line2: "PMB 90375",
    city: "San Francisco",
    state: "California",
    zip: "94104",
    country: "United States",
    email: "support@anthropic.com",
  },
  CN: {
    name: "Beijing Zhipu Technology Co., Ltd.",
    line1: "Building 1, Zhongguancun Software Park",
    line2: "Haidian District",
    city: "Beijing",
    state: "Beijing",
    zip: "100094",
    country: "China",
    email: "support@zhipu.ai",
  },
  UK: {
    name: "DeepMind Technologies Limited",
    line1: "6 Pancras Square",
    line2: "",
    city: "London",
    state: "England",
    zip: "N1C 4AG",
    country: "United Kingdom",
    email: "support@deepmind.com",
  },
};

const EMPTY_ADDRESS: Address = {
  name: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  email: "",
};

const PAYMENT_ADDRESSES: Record<Country, PaymentAddress> = {
  US: {
    name: "Anthropic, PBC",
    line1: "P.O. Box 104477",
    line2: "Pasadena, CA 91189-4477",
  },
  CN: {
    name: "Beijing Zhipu Technology Co., Ltd.",
    line1: "P.O. Box 8866",
    line2: "Beijing 100094, China",
  },
  UK: {
    name: "DeepMind Technologies Limited",
    line1: "P.O. Box 31874",
    line2: "London N1C 4AG, United Kingdom",
  },
};

const PAYMENT_NOTE =
  "While we prefer electronic payment methods, any checks must be sent to the address below, NOT to our San Francisco office.";

export function getDefaultInvoice(): InvoiceData {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    invoiceNumber: `INV-${rand()}`,
    receiptNumber: `${num()}-${rand()}-${num()}`,
    datePaid: dateStr,
    vatRegistration: "",
    fromCompany: { ...COMPANY_ADDRESSES.US },
    billTo: {
      ...EMPTY_ADDRESS,
      name: "Your Company Name",
      email: "billing@yourcompany.com",
      country: "United States",
    },
    items: [
      {
        description: "Claude Pro",
        detail: `${dateStr} – ${new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
        qty: 1,
        unitPrice: 200.0,
      },
    ],
    discounts: [],
    paymentMethod: { label: "Visa", last4: "1286" },
    paymentNote: PAYMENT_NOTE,
    paymentAddress: { ...PAYMENT_ADDRESSES.US },
    currency: "USD",
    currencySymbol: "$",
  };
}

export function setCountry(invoice: InvoiceData, country: Country): InvoiceData {
  const preset = COUNTRY_PRESETS[country];
  return {
    ...invoice,
    fromCompany: { ...COMPANY_ADDRESSES[country] },
    paymentAddress: { ...PAYMENT_ADDRESSES[country] },
    currency: preset.currency,
    currencySymbol: preset.symbol,
  };
}

export function formatCurrency(amount: number, symbol: string): string {
  return `${symbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
