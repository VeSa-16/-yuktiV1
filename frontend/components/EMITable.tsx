import React from "react";
import { formatCurrency } from "@/lib/formatters";

interface Props {
  principal: number;
  rate: number;
  tenureMonths: number;
  emi: number;
}

export function EMITable({ principal, rate, tenureMonths, emi }: Props) {
  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principal;

  return (
    <div className="bg-warm-bg border border-warm-border rounded-none overflow-hidden text-[10px] font-sans uppercase tracking-widest">
      <table className="w-full text-left">
        <tbody>
          <tr className="border-b border-warm-border">
            <th className="py-2 px-4 bg-warm-surface font-normal text-warm-muted w-1/2">Loan Amount</th>
            <td className="py-2 px-4 font-bold text-warm-text">{formatCurrency(principal)}</td>
          </tr>
          <tr className="border-b border-warm-border">
            <th className="py-2 px-4 bg-warm-surface font-normal text-warm-muted">Interest Rate</th>
            <td className="py-2 px-4 font-bold text-warm-text">{rate.toFixed(1)}% p.a.</td>
          </tr>
          <tr className="border-b border-warm-border">
            <th className="py-2 px-4 bg-warm-surface font-normal text-warm-muted">Tenure</th>
            <td className="py-2 px-4 font-bold text-warm-text">{tenureMonths} months</td>
          </tr>
          <tr className="border-b border-warm-border">
            <th className="py-2 px-4 bg-warm-surface font-bold text-warm-primary">Monthly EMI</th>
            <td className="py-2 px-4 font-bold text-warm-primary">{formatCurrency(emi)}</td>
          </tr>
          <tr className="border-b border-warm-border">
            <th className="py-2 px-4 bg-warm-surface font-normal text-warm-muted">Total Interest</th>
            <td className="py-2 px-4 font-bold text-warm-text">{formatCurrency(totalInterest)}</td>
          </tr>
          <tr>
            <th className="py-2 px-4 bg-warm-surface font-normal text-warm-muted">Total Payment</th>
            <td className="py-2 px-4 font-bold text-warm-text">{formatCurrency(totalPayment)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
