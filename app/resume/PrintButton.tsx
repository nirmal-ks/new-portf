"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button type="button" className="btn btn-primary" onClick={() => window.print()}>
      <Printer size={16} /> Download PDF / Print
    </button>
  );
}
