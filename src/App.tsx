import { useState, useRef, useCallback } from "react";
import { Download, FileText, Code2, RotateCcw } from "lucide-react";
import InvoiceForm from "./InvoiceForm";
import InvoicePreview from "./InvoicePreview";
import { downloadInvoiceHTML } from "./html-export";
import { getDefaultInvoice, setCountry } from "./data";
import type { InvoiceData, Country } from "./types";

export default function App() {
  const [invoice, setInvoice] = useState<InvoiceData>(getDefaultInvoice);
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleCountryChange = useCallback(
    (country: Country) => setInvoice((prev) => setCountry(prev, country)),
    []
  );

  const handleReset = () => setInvoice(getDefaultInvoice());

  const handleExportPDF = async () => {
    const el = document.getElementById("invoice-pdf");
    if (!el) return;
    setExporting(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const usableWidth = pageWidth - margin * 2;
      const usableHeight = pageHeight - margin * 2;

      const imgWidth = usableWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const scaleToFit = Math.min(1, usableHeight / imgHeight);
      const finalWidth = imgWidth * scaleToFit;
      const finalHeight = imgHeight * scaleToFit;
      const x = (pageWidth - finalWidth) / 2;
      const y = margin;

      pdf.addImage(canvas.toDataURL("image/jpeg", 0.98), "JPEG", x, y, finalWidth, finalHeight);
      pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("PDF export failed. Check console for details.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Invoice Generator</h1>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {invoice.currency}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition shadow-sm"
            >
              <Download className="w-4 h-4" />
              {exporting ? "Exporting…" : "Export PDF"}
            </button>
            <button
              onClick={() => downloadInvoiceHTML(invoice)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow-sm"
            >
              <Code2 className="w-4 h-4" />
              Export HTML
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Invoice Details
          </h2>
          <InvoiceForm
            data={invoice}
            onChange={setInvoice}
            onCountryChange={handleCountryChange}
          />
        </div>

        {/* Right: Preview */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Preview
          </h2>
          <div
            ref={previewRef}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <InvoicePreview data={invoice} />
          </div>
        </div>
      </main>
    </div>
  );
}
