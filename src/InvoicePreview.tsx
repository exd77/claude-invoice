import type { InvoiceData } from "./types";
import { formatCurrency } from "./data";
import anthropicIcon from "./assets/anthropic-icon.png";

interface Props {
  data: InvoiceData;
}

const styles = {
  page: {
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    maxWidth: 740,
    margin: "0 auto",
    padding: "40px 48px",
    lineHeight: 1.55,
    color: "#111",
    background: "#fff",
    fontSize: 13,
  } as React.CSSProperties,

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
  } as React.CSSProperties,

  title: {
    fontSize: 32,
    fontWeight: 700,
    margin: 0,
    color: "#000",
  } as React.CSSProperties,

  icon: {
    width: 36,
    height: 36,
    objectFit: "contain" as const,
  } as React.CSSProperties,

  metaGrid: {
    display: "grid",
    gridTemplateColumns: "140px 1fr",
    gap: "4px 0",
    marginBottom: 28,
    fontSize: 13,
    alignItems: "center",
    lineHeight: 1.6,
  } as React.CSSProperties,

  metaLabel: {
    color: "#666",
    fontSize: 12,
    padding: "6px 0",
  } as React.CSSProperties,

  metaValue: {
    color: "#111",
    fontWeight: 500,
    padding: "6px 0",
  } as React.CSSProperties,

  columns: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 28,
  } as React.CSSProperties,

  col: {
    width: "48%",
  } as React.CSSProperties,

  colHeading: {
    fontWeight: 700,
    fontSize: 13,
    marginBottom: 6,
    color: "#000",
  } as React.CSSProperties,

  colText: {
    fontSize: 13,
    lineHeight: 1.55,
    color: "#333",
  } as React.CSSProperties,

  amountPaid: {
    fontSize: 22,
    fontWeight: 700,
    margin: "24px 0 16px",
    color: "#000",
  } as React.CSSProperties,

  note: {
    fontSize: 12,
    color: "#555",
    margin: "0 0 8px",
    lineHeight: 1.5,
  } as React.CSSProperties,

  dashed: {
    border: "none",
    borderTop: "1px dashed #bbb",
    margin: "16px 0",
  } as React.CSSProperties,

  paymentAddrLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.5,
    color: "#555",
    marginBottom: 4,
  } as React.CSSProperties,

  paymentAddrText: {
    fontSize: 12,
    color: "#333",
    lineHeight: 1.5,
  } as React.CSSProperties,

  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    margin: "24px 0",
  } as React.CSSProperties,

  thRow: {
    borderBottom: "2px solid #111",
  } as React.CSSProperties,

  th: {
    padding: "8px 0",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: 0.3,
    color: "#333",
    textAlign: "left" as const,
  } as React.CSSProperties,

  thRight: {
    padding: "8px 0",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: 0.3,
    color: "#333",
    textAlign: "right" as const,
  } as React.CSSProperties,

  td: {
    padding: "10px 0",
    fontSize: 13,
    borderBottom: "1px solid #e5e5e5",
    color: "#111",
  } as React.CSSProperties,

  tdRight: {
    padding: "10px 0",
    fontSize: 13,
    borderBottom: "1px solid #e5e5e5",
    color: "#111",
    textAlign: "right" as const,
  } as React.CSSProperties,

  tdDesc: {
    padding: "10px 0",
    fontSize: 13,
    borderBottom: "1px solid #e5e5e5",
    color: "#111",
  } as React.CSSProperties,

  tdDescSmall: {
    display: "block",
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  } as React.CSSProperties,

  totalsWrap: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 4,
  } as React.CSSProperties,

  totalsTable: {
    width: 280,
    borderCollapse: "collapse" as const,
  } as React.CSSProperties,

  totalsRow: {
    borderBottom: "1px solid #e5e5e5",
  } as React.CSSProperties,

  totalsLabel: {
    padding: "8px 0",
    fontSize: 13,
    color: "#333",
    textAlign: "left" as const,
  } as React.CSSProperties,

  totalsValue: {
    padding: "8px 0",
    fontSize: 13,
    color: "#111",
    textAlign: "right" as const,
  } as React.CSSProperties,

  totalsTotalRow: {
    borderTop: "2px solid #111",
    borderBottom: "none",
  } as React.CSSProperties,

  totalsTotalLabel: {
    padding: "8px 0",
    fontSize: 13,
    fontWeight: 700,
    color: "#000",
    textAlign: "left" as const,
  } as React.CSSProperties,

  totalsTotalValue: {
    padding: "8px 0",
    fontSize: 13,
    fontWeight: 700,
    color: "#000",
    textAlign: "right" as const,
  } as React.CSSProperties,

  footer: {
    marginTop: 48,
    fontSize: 11,
    color: "#999",
  } as React.CSSProperties,
};

export default function InvoicePreview({ data }: Props) {
  const subtotal = data.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  const discountTotal = data.discounts.reduce((sum, d) => sum + d.amount, 0);
  const total = subtotal + discountTotal;
  const sym = data.currencySymbol;

  return (
    <div id="invoice-pdf" style={styles.page}>
      {/* Header: Title + Icon */}
      <div style={styles.header}>
        <h1 style={styles.title}>Receipt</h1>
        <img src={anthropicIcon} alt="Anthropic" style={styles.icon} />
      </div>

      {/* Invoice metadata */}
      <div style={styles.metaGrid}>
        <span style={styles.metaLabel}>Invoice number</span>
        <span style={styles.metaValue}>{data.invoiceNumber}</span>
        <span style={styles.metaLabel}>Receipt number</span>
        <span style={styles.metaValue}>{data.receiptNumber}</span>
        <span style={styles.metaLabel}>Date paid</span>
        <span style={styles.metaValue}>{data.datePaid}</span>
        {data.vatRegistration && (
          <>
            <span style={styles.metaLabel}>VAT Registration</span>
            <span style={styles.metaValue}>{data.vatRegistration}</span>
          </>
        )}
      </div>

      {/* From / Bill To */}
      <div style={styles.columns}>
        <div style={styles.col}>
          <div style={styles.colHeading}>{data.fromCompany.name}</div>
          <div style={styles.colText}>
            {data.fromCompany.line1}<br />
            {data.fromCompany.line2 && <>{data.fromCompany.line2}<br /></>}
            {data.fromCompany.city}, {data.fromCompany.state} {data.fromCompany.zip}<br />
            {data.fromCompany.country}<br />
            {data.fromCompany.email}
          </div>
        </div>
        <div style={styles.col}>
          <div style={styles.colHeading}>Bill to</div>
          <div style={styles.colText}>
            {data.billTo.name}<br />
            {data.billTo.line1}<br />
            {data.billTo.line2 && <>{data.billTo.line2}<br /></>}
            {data.billTo.city} {data.billTo.state} {data.billTo.zip}<br />
            {data.billTo.country}<br />
            {data.billTo.email}
          </div>
        </div>
      </div>

      {/* Amount paid */}
      <div style={styles.amountPaid}>
        {formatCurrency(total, sym)} paid on {data.datePaid}
      </div>

      {/* Payment note */}
      {data.paymentNote && <p style={styles.note}>{data.paymentNote}</p>}

      <hr style={styles.dashed} />

      {/* Payment address */}
      {data.paymentAddress.name && (
        <div style={{ marginBottom: 8 }}>
          <div style={styles.paymentAddrLabel}>PAYMENT ADDRESS:</div>
          <div style={styles.paymentAddrText}>
            {data.paymentAddress.name}<br />
            {data.paymentAddress.line1}<br />
            {data.paymentAddress.line2}
          </div>
        </div>
      )}

      <hr style={styles.dashed} />

      {/* Items table — minimalist horizontal rules */}
      <table style={styles.table}>
        <thead>
          <tr style={styles.thRow}>
            <th style={{ ...styles.th, width: "50%" }}>Description</th>
            <th style={styles.thRight}>Qty</th>
            <th style={styles.thRight}>Unit price</th>
            <th style={styles.thRight}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, i) => (
            <tr key={i}>
              <td style={styles.tdDesc}>
                {item.description}
                {item.detail && <span style={styles.tdDescSmall}>{item.detail}</span>}
              </td>
              <td style={styles.tdRight}>{item.qty}</td>
              <td style={styles.tdRight}>{formatCurrency(item.unitPrice, sym)}</td>
              <td style={styles.tdRight}>{formatCurrency(item.qty * item.unitPrice, sym)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals — right-aligned, minimalist */}
      <div style={styles.totalsWrap}>
        <table style={styles.totalsTable}>
          <tbody>
            <tr style={styles.totalsRow}>
              <td style={styles.totalsLabel}>Subtotal</td>
              <td style={styles.totalsValue}>{formatCurrency(subtotal, sym)}</td>
            </tr>
            {data.discounts.map((d, i) => (
              <tr key={i} style={styles.totalsRow}>
                <td style={styles.totalsLabel}>{d.label}</td>
                <td style={{ ...styles.totalsValue, color: "#c00" }}>
                  {formatCurrency(d.amount, sym)}
                </td>
              </tr>
            ))}
            <tr style={styles.totalsTotalRow}>
              <td style={styles.totalsTotalLabel}>Total</td>
              <td style={styles.totalsTotalValue}>{formatCurrency(total, sym)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={styles.footer}>Page 1 of 1</div>
    </div>
  );
}
