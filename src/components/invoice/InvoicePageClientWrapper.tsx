"use client";

import dynamic from "next/dynamic";

const InvoiceProvider = dynamic(
  () => import("./InvoicePageClient").then((m) => m.InvoiceProvider),
  { ssr: false }
);

const InvoiceEditorWrapper = dynamic(
  () => import("./InvoicePageClient").then((m) => m.InvoiceEditorWrapper),
  { ssr: false }
);

const InvoicePreviewWrapper = dynamic(
  () => import("./InvoicePageClient").then((m) => m.InvoicePreviewWrapper),
  { ssr: false }
);

export { InvoiceProvider, InvoiceEditorWrapper, InvoicePreviewWrapper };