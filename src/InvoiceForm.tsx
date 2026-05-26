import type { InvoiceData, InvoiceItem, Country } from "./types";
import { COUNTRY_PRESETS } from "./data";
import { generateAddress, generateVatId } from "./billing-generator";

interface Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  onCountryChange: (country: Country) => void;
}

function Field({ label, value, onChange, type = "text", placeholder = "" }: {
  label: string; value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
      />
    </label>
  );
}

export default function InvoiceForm({ data, onChange, onCountryChange }: Props) {
  const update = (patch: Partial<InvoiceData>) => onChange({ ...data, ...patch });
  const updateFrom = (patch: Partial<InvoiceData["fromCompany"]>) =>
    update({ fromCompany: { ...data.fromCompany, ...patch } });
  const updateBillTo = (patch: Partial<InvoiceData["billTo"]>) =>
    update({ billTo: { ...data.billTo, ...patch } });
  const updatePayment = (patch: Partial<InvoiceData["paymentMethod"]>) =>
    update({ paymentMethod: { ...data.paymentMethod, ...patch } });
  const updatePaymentAddr = (patch: Partial<InvoiceData["paymentAddress"]>) =>
    update({ paymentAddress: { ...data.paymentAddress, ...patch } });

  const handleGenerateBillTo = () => {
    // Derive country code from the selected billing region
    const countryCode = (Object.keys(COUNTRY_PRESETS) as Country[]).find(
      (c) => COUNTRY_PRESETS[c].label === data.fromCompany.country
    ) || "US";
    const gen = generateAddress(countryCode);
    const vatId = generateVatId(countryCode);
    // Single update call to ensure all changes are applied atomically
    update({
      billTo: {
        name: gen.name,
        line1: gen.addressLine1,
        line2: gen.addressLine2,
        city: gen.city,
        state: gen.region,
        zip: gen.postalCode,
        country: gen.countryName,
        email: data.billTo.email,
      },
      vatRegistration: vatId,
    });
  };

  const updateItem = (index: number, patch: Partial<InvoiceItem>) => {
    const items = [...data.items];
    items[index] = { ...items[index], ...patch };
    update({ items });
  };

  const addItem = () =>
    update({ items: [...data.items, { description: "", qty: 1, unitPrice: 0 }] });

  const removeItem = (index: number) =>
    update({ items: data.items.filter((_, i) => i !== index) });

  return (
    <div className="space-y-6">
      {/* Country selector */}
      <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Billing Region</label>
        <div className="mt-2 flex gap-2">
          {(Object.keys(COUNTRY_PRESETS) as Country[]).map((c) => (
            <button
              key={c}
              onClick={() => onCountryChange(c)}
              className={`px-4 py-2 rounded-md text-sm font-medium border transition ${
                data.fromCompany.country === COUNTRY_PRESETS[c].label
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {c === "US" ? "🇺🇸" : c === "CN" ? "🇨🇳" : "🇬🇧"} {COUNTRY_PRESETS[c].label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice meta */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Invoice Number" value={data.invoiceNumber} onChange={(v) => update({ invoiceNumber: v })} />
        <Field label="Receipt Number" value={data.receiptNumber} onChange={(v) => update({ receiptNumber: v })} />
        <Field label="Date Paid" value={data.datePaid} onChange={(v) => update({ datePaid: v })} />
        <Field label="VAT Registration" value={data.vatRegistration} onChange={(v) => update({ vatRegistration: v })} placeholder="e.g. Kazakhstan VAT: 86-..." />
      </div>

      {/* From / Bill To */}
      <div className="grid grid-cols-2 gap-6">
        <fieldset className="border border-gray-200 rounded-lg p-4 space-y-3">
          <legend className="text-sm font-semibold text-gray-700 px-2">From (Company)</legend>
          <Field label="Company Name" value={data.fromCompany.name} onChange={(v) => updateFrom({ name: v })} />
          <Field label="Address Line 1" value={data.fromCompany.line1} onChange={(v) => updateFrom({ line1: v })} />
          <Field label="Address Line 2" value={data.fromCompany.line2} onChange={(v) => updateFrom({ line2: v })} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="City" value={data.fromCompany.city} onChange={(v) => updateFrom({ city: v })} />
            <Field label="State" value={data.fromCompany.state} onChange={(v) => updateFrom({ state: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="ZIP" value={data.fromCompany.zip} onChange={(v) => updateFrom({ zip: v })} />
            <Field label="Country" value={data.fromCompany.country} onChange={(v) => updateFrom({ country: v })} />
          </div>
          <Field label="Email" value={data.fromCompany.email} onChange={(v) => updateFrom({ email: v })} />
        </fieldset>

        <fieldset className="border border-gray-200 rounded-lg p-4 space-y-3">
          <legend className="flex items-center justify-between w-full pr-2">
            <span className="text-sm font-semibold text-gray-700">Bill To (Customer)</span>
            <button
              type="button"
              onClick={handleGenerateBillTo}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 border border-blue-300 rounded px-2 py-0.5 hover:bg-blue-50 transition"
            >
              ✨ Auto-generate
            </button>
          </legend>
          <Field label="Name / Org" value={data.billTo.name} onChange={(v) => updateBillTo({ name: v })} />
          <Field label="Address Line 1" value={data.billTo.line1} onChange={(v) => updateBillTo({ line1: v })} />
          <Field label="Address Line 2" value={data.billTo.line2} onChange={(v) => updateBillTo({ line2: v })} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="City" value={data.billTo.city} onChange={(v) => updateBillTo({ city: v })} />
            <Field label="State" value={data.billTo.state} onChange={(v) => updateBillTo({ state: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="ZIP" value={data.billTo.zip} onChange={(v) => updateBillTo({ zip: v })} />
            <Field label="Country" value={data.billTo.country} onChange={(v) => updateBillTo({ country: v })} />
          </div>
          <Field label="Email" value={data.billTo.email} onChange={(v) => updateBillTo({ email: v })} />
        </fieldset>
      </div>

      {/* Line items */}
      <fieldset className="border border-gray-200 rounded-lg p-4">
        <legend className="text-sm font-semibold text-gray-700 px-2">Line Items</legend>
        <div className="space-y-3">
          {data.items.map((item, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-4">
                <Field label="Description" value={item.description} onChange={(v) => updateItem(i, { description: v })} />
              </div>
              <div className="col-span-3">
                <Field label="Detail" value={item.detail || ""} onChange={(v) => updateItem(i, { detail: v })} placeholder="e.g. date range" />
              </div>
              <div className="col-span-1">
                <Field label="Qty" value={item.qty} type="number" onChange={(v) => updateItem(i, { qty: Number(v) })} />
              </div>
              <div className="col-span-2">
                <Field label="Unit Price" value={item.unitPrice} type="number" onChange={(v) => updateItem(i, { unitPrice: Number(v) })} />
              </div>
              <div className="col-span-2 flex gap-1">
                {data.items.length > 1 && (
                  <button onClick={() => removeItem(i)} className="px-2 py-2 text-red-500 hover:bg-red-50 rounded text-sm">✕</button>
                )}
              </div>
            </div>
          ))}
          <button onClick={addItem} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            + Add item
          </button>
        </div>
      </fieldset>

      {/* Discounts */}
      <fieldset className="border border-gray-200 rounded-lg p-4">
        <legend className="text-sm font-semibold text-gray-700 px-2">Discounts / Credits</legend>
        <div className="space-y-3">
          {data.discounts.map((d, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-7">
                <Field label="Label" value={d.label} onChange={(v) => {
                  const discounts = [...data.discounts];
                  discounts[i] = { ...discounts[i], label: v };
                  update({ discounts });
                }} placeholder='e.g. "Claude Max 5x Gift - 1 Month (100% off)"' />
              </div>
              <div className="col-span-3">
                <Field label="Amount (negative)" value={d.amount} type="number" onChange={(v) => {
                  const discounts = [...data.discounts];
                  discounts[i] = { ...discounts[i], amount: Number(v) };
                  update({ discounts });
                }} />
              </div>
              <div className="col-span-2">
                <button onClick={() => update({ discounts: data.discounts.filter((_, j) => j !== i) })} className="px-2 py-2 text-red-500 hover:bg-red-50 rounded text-sm">✕</button>
              </div>
            </div>
          ))}
          <button onClick={() => update({ discounts: [...data.discounts, { label: "", amount: 0 }] })} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            + Add discount
          </button>
        </div>
      </fieldset>

      {/* Payment method */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Payment Method" value={data.paymentMethod.label} onChange={(v) => updatePayment({ label: v })} />
        <Field label="Card Last 4" value={data.paymentMethod.last4} onChange={(v) => updatePayment({ last4: v })} />
      </div>

      {/* Payment note + address */}
      <fieldset className="border border-gray-200 rounded-lg p-4 space-y-3">
        <legend className="text-sm font-semibold text-gray-700 px-2">Payment Note & Address</legend>
        <label className="block">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Note</span>
          <textarea
            value={data.paymentNote}
            onChange={(e) => update({ paymentNote: e.target.value })}
            rows={2}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </label>
        <Field label="Payment Address Name" value={data.paymentAddress.name} onChange={(v) => updatePaymentAddr({ name: v })} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="P.O. Box / Line 1" value={data.paymentAddress.line1} onChange={(v) => updatePaymentAddr({ line1: v })} />
          <Field label="City / State / ZIP" value={data.paymentAddress.line2} onChange={(v) => updatePaymentAddr({ line2: v })} />
        </div>
      </fieldset>
    </div>
  );
}
