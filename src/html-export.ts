import type { InvoiceData } from "./types";
import { formatCurrency } from "./data";
import { ANTHROPIC_ICON_BASE64 } from "./icon-base64";

/**
 * Generate a standalone HTML document from invoice data.
 * Matches the Anthropic receipt style with embedded CSS — no external dependencies.
 */
export function generateInvoiceHTML(data: InvoiceData): string {
  const subtotal = data.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  const discountTotal = data.discounts.reduce((sum, d) => sum + d.amount, 0);
  const total = subtotal + discountTotal;
  const sym = data.currencySymbol;

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const itemsHTML = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#111;">
          ${esc(item.description)}
          ${item.detail ? `<br><small style="font-size:11px;color:#888;">${esc(item.detail)}</small>` : ""}
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#111;text-align:right;">${item.qty}</td>
        <td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#111;text-align:right;">${formatCurrency(item.unitPrice, sym)}</td>
        <td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#111;text-align:right;">${formatCurrency(item.qty * item.unitPrice, sym)}</td>
      </tr>`
    )
    .join("\n");

  const discountsHTML = data.discounts
    .map(
      (d) => `
      <tr>
        <td style="padding:8px 0;font-size:13px;color:#333;text-align:left;">${esc(d.label)}</td>
        <td style="padding:8px 0;font-size:13px;color:#c00;text-align:right;">${formatCurrency(d.amount, sym)}</td>
      </tr>`
    )
    .join("\n");

  const vatHTML = data.vatRegistration
    ? `
      <tr>
        <td style="color:#666;font-size:12px;padding:0;">VAT Registration</td>
        <td style="color:#111;font-size:13px;font-weight:500;padding:2px 0 0 16px;">${esc(data.vatRegistration)}</td>
      </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receipt - ${esc(data.invoiceNumber)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #111;
      background: #fff;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>

  <!-- Header: Title + Icon -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;">
    <h1 style="font-size:32px;font-weight:700;color:#000;">Receipt</h1>
    <img src="${ANTHROPIC_ICON_BASE64}" alt="Anthropic" style="width:36px;height:36px;object-fit:contain;">
  </div>

  <!-- Invoice metadata -->
  <table style="border-collapse:collapse;margin-bottom:28px;">
    <tr>
      <td style="color:#666;font-size:12px;padding:0;">Invoice number</td>
      <td style="color:#111;font-size:13px;font-weight:500;padding:0 0 0 16px;">${esc(data.invoiceNumber)}</td>
    </tr>
    <tr>
      <td style="color:#666;font-size:12px;padding:2px 0 0;">Receipt number</td>
      <td style="color:#111;font-size:13px;font-weight:500;padding:2px 0 0 16px;">${esc(data.receiptNumber)}</td>
    </tr>
    <tr>
      <td style="color:#666;font-size:12px;padding:2px 0 0;">Date paid</td>
      <td style="color:#111;font-size:13px;font-weight:500;padding:2px 0 0 16px;">${esc(data.datePaid)}</td>
    </tr>
    ${vatHTML}
  </table>

  <!-- From / Bill To -->
  <div style="display:flex;justify-content:space-between;margin-bottom:28px;">
    <div style="width:48%;">
      <div style="font-weight:700;font-size:13px;color:#000;margin-bottom:6px;">${esc(data.fromCompany.name)}</div>
      <div style="font-size:13px;line-height:1.55;color:#333;">
        ${esc(data.fromCompany.line1)}<br>
        ${data.fromCompany.line2 ? esc(data.fromCompany.line2) + "<br>" : ""}
        ${esc(data.fromCompany.city)}, ${esc(data.fromCompany.state)} ${esc(data.fromCompany.zip)}<br>
        ${esc(data.fromCompany.country)}<br>
        ${esc(data.fromCompany.email)}
      </div>
    </div>
    <div style="width:48%;">
      <div style="font-weight:700;font-size:13px;color:#000;margin-bottom:6px;">Bill to</div>
      <div style="font-size:13px;line-height:1.55;color:#333;">
        ${esc(data.billTo.name)}<br>
        ${data.billTo.line1 ? esc(data.billTo.line1) + "<br>" : ""}
        ${data.billTo.line2 ? esc(data.billTo.line2) + "<br>" : ""}
        ${esc(data.billTo.city)} ${esc(data.billTo.state)} ${esc(data.billTo.zip)}<br>
        ${esc(data.billTo.country)}<br>
        ${esc(data.billTo.email)}
      </div>
    </div>
  </div>

  <!-- Amount paid -->
  <div style="font-size:22px;font-weight:700;margin:24px 0 16px;color:#000;">
    ${formatCurrency(total, sym)} paid on ${esc(data.datePaid)}
  </div>

  <!-- Payment note -->
  ${data.paymentNote ? `<p style="font-size:12px;color:#555;margin:0 0 8px;line-height:1.5;">${esc(data.paymentNote)}</p>` : ""}

  <hr style="border:none;border-top:1px dashed #bbb;margin:16px 0;">

  <!-- Payment address -->
  ${
    data.paymentAddress.name
      ? `<div style="margin-bottom:8px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.5px;color:#555;margin-bottom:4px;">PAYMENT ADDRESS:</div>
        <div style="font-size:12px;color:#333;line-height:1.5;">
          ${esc(data.paymentAddress.name)}<br>
          ${esc(data.paymentAddress.line1)}<br>
          ${esc(data.paymentAddress.line2)}
        </div>
      </div>`
      : ""
  }

  <hr style="border:none;border-top:1px dashed #bbb;margin:16px 0;">

  <!-- Items table -->
  <table style="width:100%;border-collapse:collapse;margin:24px 0;">
    <thead>
      <tr style="border-bottom:2px solid #111;">
        <th style="padding:8px 0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.3px;color:#333;text-align:left;width:50%;">Description</th>
        <th style="padding:8px 0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.3px;color:#333;text-align:right;">Qty</th>
        <th style="padding:8px 0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.3px;color:#333;text-align:right;">Unit price</th>
        <th style="padding:8px 0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.3px;color:#333;text-align:right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHTML}
    </tbody>
  </table>

  <!-- Totals -->
  <div style="display:flex;justify-content:flex-end;margin-top:4px;">
    <table style="width:280px;border-collapse:collapse;">
      <tr style="border-bottom:1px solid #e5e5e5;">
        <td style="padding:8px 0;font-size:13px;color:#333;text-align:left;">Subtotal</td>
        <td style="padding:8px 0;font-size:13px;color:#111;text-align:right;">${formatCurrency(subtotal, sym)}</td>
      </tr>
      ${discountsHTML}
      <tr style="border-top:2px solid #111;">
        <td style="padding:8px 0;font-size:13px;font-weight:700;color:#000;text-align:left;">Total</td>
        <td style="padding:8px 0;font-size:13px;font-weight:700;color:#000;text-align:right;">${formatCurrency(total, sym)}</td>
      </tr>
    </table>
  </div>

  <!-- Footer -->
  <div style="margin-top:48px;font-size:11px;color:#999;">Page 1 of 1</div>

</body>
</html>`;
}

/**
 * Trigger download of the invoice as an HTML file.
 */
export function downloadInvoiceHTML(data: InvoiceData): void {
  const html = generateInvoiceHTML(data);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `receipt-${data.invoiceNumber}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
