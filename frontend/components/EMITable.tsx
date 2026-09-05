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
    <div className="bg-black border border-zinc-800 rounded-none overflow-hidden text-[10px] font-mono uppercase tracking-widest">
      <table className="w-full text-left">
        <tbody>
          <tr className="border-b border-zinc-800">
            <th className="py-2 px-4 bg-zinc-900 font-normal text-zinc-500 w-1/2">Loan Amount</th>
            <td className="py-2 px-4 font-bold text-white">{formatCurrency(principal)}</td>
          </tr>
          <tr className="border-b border-zinc-800">
            <th className="py-2 px-4 bg-zinc-900 font-normal text-zinc-500">Interest Rate</th>
            <td className="py-2 px-4 font-bold text-white">{rate.toFixed(1)}% p.a.</td>
          </tr>
          <tr className="border-b border-zinc-800">
            <th className="py-2 px-4 bg-zinc-900 font-normal text-zinc-500">Tenure</th>
            <td className="py-2 px-4 font-bold text-white">{tenureMonths} months</td>
          </tr>
          <tr className="border-b border-zinc-800">
            <th className="py-2 px-4 bg-zinc-900 font-bold text-terminal-cyan">Monthly EMI</th>
            <td className="py-2 px-4 font-bold text-terminal-cyan">{formatCurrency(emi)}</td>
          </tr>
          <tr className="border-b border-zinc-800">
            <th className="py-2 px-4 bg-zinc-900 font-normal text-zinc-500">Total Interest</th>
            <td className="py-2 px-4 font-bold text-zinc-300">{formatCurrency(totalInterest)}</td>
          </tr>
          <tr>
            <th className="py-2 px-4 bg-zinc-900 font-normal text-zinc-500">Total Payment</th>
            <td className="py-2 px-4 font-bold text-zinc-300">{formatCurrency(totalPayment)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
