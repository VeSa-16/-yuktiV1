import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';

export interface EvidenceRecord {
  metric: string;
  value: string | number;
  source: string;
  source_url?: string;
  geography: string;
  observed_at?: string;
  retrieved_at: string;
  resolution: string;
  method: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  coverage_pct: number;
  limitation?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  evidenceList: EvidenceRecord[];
}

export function EvidenceDrawer({ isOpen, onClose, evidenceList }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-ink">Evidence Trace</h2>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {evidenceList.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-lg text-slate-500 text-center">
                  No evidence records available.
                </div>
              ) : (
                <div className="space-y-6">
                  {evidenceList.map((record, i) => (
                    <div key={i} className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-ink">{record.metric}</h3>
                          <div className="text-2xl font-display text-forest mt-1">{record.value}</div>
                        </div>
                        {record.confidence === 'HIGH' && <ShieldCheck className="w-6 h-6 text-emerald-500" />}
                        {record.confidence === 'MEDIUM' && <ShieldAlert className="w-6 h-6 text-amber-500" />}
                        {record.confidence === 'LOW' && <ShieldQuestion className="w-6 h-6 text-red-500" />}
                      </div>
                      
                      <div className="space-y-2 text-sm text-slate-600 mt-4">
                        <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
                          <span className="text-slate-400">Source</span>
                          <span className="col-span-2 font-medium text-ink flex items-center gap-1">
                            {record.source}
                            {record.source_url && (
                              <a href={record.source_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-slate-400">Geography</span>
                          <span className="col-span-2 font-medium">{record.geography} ({record.resolution})</span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-slate-400">Method</span>
                          <span className="col-span-2 font-medium capitalize">{record.method}</span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-slate-400">Confidence</span>
                          <span className={`col-span-2 font-bold ${record.confidence === 'HIGH' ? 'text-emerald-600' : record.confidence === 'MEDIUM' ? 'text-amber-600' : 'text-red-600'}`}>
                            {record.confidence}
                          </span>
                        </div>

                        {record.limitation && (
                          <div className="mt-3 p-3 bg-amber-50 text-amber-800 rounded-lg text-xs leading-relaxed">
                            <span className="font-bold">Limitation:</span> {record.limitation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
