"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ArrowRight, MapPin, Search, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface LocationData {
  state: string;
  district: string;
  taluka: string;
  village: string;
}

interface StepLocationProps {
  data: LocationData;
  updateData: (updates: Partial<LocationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const STATES = [
  { id: "MH", name: "Maharashtra" },
  { id: "GJ", name: "Gujarat" },
  { id: "KA", name: "Karnataka" }
];

const DISTRICTS: Record<string, { id: string; name: string }[]> = {
  "MH": [{ id: "MH_SOL", name: "Solapur" }, { id: "MH_PUN", name: "Pune" }, { id: "MH_NSK", name: "Nashik" }],
  "GJ": [{ id: "GJ_AMD", name: "Ahmedabad" }, { id: "GJ_SUR", name: "Surat" }],
  "KA": [{ id: "KA_BLR", name: "Bangalore" }, { id: "KA_MYS", name: "Mysore" }]
};

// Fallback talukas in case API is unavailable
const SOLAPUR_TALUKAS_FALLBACK = [
  "Akkalkot", "Barshi", "Karmala", "Madha", "Malshiras",
  "Mangalvedhe", "Mohol", "Pandharpur", "Sangole", "Solapur North", "Solapur South"
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function StepLocation({ data, updateData, onNext, onBack }: StepLocationProps) {
  const t = useTranslations('onboarding.step2');
  const tCommon = useTranslations('common');

  const [selectedStateId, setSelectedStateId] = useState<string>('');
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>([]);
  const [talukas, setTalukas] = useState<string[]>([]);
  const [villages, setVillages] = useState<{ village: string; village_local?: string }[]>([]);
  const [villageSearch, setVillageSearch] = useState(data.village || '');
  const [showVillageDropdown, setShowVillageDropdown] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);
  const [isSolapur, setIsSolapur] = useState(false);
  const villageRef = useRef<HTMLDivElement>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Update districts when state changes
  useEffect(() => {
    if (selectedStateId) setDistricts(DISTRICTS[selectedStateId] || []);
    else setDistricts([]);
  }, [selectedStateId]);

  // Load talukas when Solapur is selected
  useEffect(() => {
    const isSol = data.district?.toLowerCase().includes("solapur");
    setIsSolapur(isSol);
    if (isSol) {
      fetch(`${API_BASE}/api/locations/solapur/talukas`)
        .then(r => r.json())
        .then(d => setTalukas(d.talukas || SOLAPUR_TALUKAS_FALLBACK))
        .catch(() => setTalukas(SOLAPUR_TALUKAS_FALLBACK));
    } else {
      setTalukas([]);
    }
    updateData({ taluka: '', village: '' });
    setVillageSearch('');
  }, [data.district]);

  // Load villages when taluka changes or search changes
  useEffect(() => {
    if (!isSolapur || !data.taluka) return;
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setLoadingVillages(true);
      const params = new URLSearchParams({ taluka: data.taluka });
      if (villageSearch.length >= 2) params.set('search', villageSearch);
      fetch(`${API_BASE}/api/locations/solapur/villages?${params}`)
        .then(r => r.json())
        .then(d => setVillages(d.villages || []))
        .catch(() => setVillages([]))
        .finally(() => setLoadingVillages(false));
    }, 300);
  }, [data.taluka, villageSearch, isSolapur]);

  // Close village dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (villageRef.current && !villageRef.current.contains(e.target as Node)) {
        setShowVillageDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    const obj = STATES.find(s => s.name === name);
    setSelectedStateId(obj?.id || '');
    updateData({ state: name, district: '' });
  };

  const handleVillageSelect = (v: { village: string }) => {
    setVillageSearch(v.village);
    updateData({ village: v.village });
    setShowVillageDropdown(false);
  };

  const canProceed = data.state && data.district;

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl p-4 sm:p-6 border border-premium-border shadow-card relative overflow-hidden">
      <div className="flex-1 overflow-y-auto min-h-0 pr-2">
        <h2 className="text-[28px] font-bold text-forest-deep mb-1 font-display">{t('title')}</h2>
        <p className="text-ink-soft text-sm font-medium mb-4">{t('subtitle')}</p>

        <div className="space-y-4">

          {/* State */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-ink flex items-center">
              {t('state')} <span className="text-[#ea580c] ml-1">*</span>
            </label>
            <select
              className="w-full rounded-xl border border-premium-border px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest transition-all bg-white"
              value={data.state}
              onChange={handleStateChange}
            >
              <option value="">{t('stateSelect')}</option>
              {STATES.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>

          {/* District */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-ink flex items-center">
              {t('district')} <span className="text-[#ea580c] ml-1">*</span>
            </label>
            <select
              className="w-full rounded-xl border border-premium-border px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest transition-all bg-white disabled:opacity-50"
              value={data.district}
              onChange={e => updateData({ district: e.target.value })}
              disabled={!data.state}
            >
              <option value="">{t('districtSelect')}</option>
              {districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>

          {/* Taluka — only for Solapur */}
          {isSolapur && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-ink flex items-center">
                Taluka <span className="text-[#ea580c] ml-1">*</span>
              </label>
              <select
                className="w-full rounded-xl border border-premium-border px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest transition-all bg-white disabled:opacity-50"
                value={data.taluka || ''}
                onChange={e => updateData({ taluka: e.target.value, village: '' })}
                disabled={!data.district}
              >
                <option value="">Select taluka</option>
                {talukas.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}

          {/* Village — searchable dropdown for Solapur, free-text otherwise */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-ink flex items-center">
              {t('village')}
              {isSolapur && data.taluka && (
                <span className="ml-2 text-xs font-medium text-forest bg-green-50 px-2 py-0.5 rounded-full">
                  LGD data — {villages.length} villages
                </span>
              )}
            </label>

            {isSolapur && data.taluka ? (
              /* Searchable village dropdown */
              <div className="relative" ref={villageRef}>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-ink-soft" size={16} />
                  <input
                    type="text"
                    placeholder="Search village..."
                    className="w-full rounded-xl border border-premium-border pl-9 pr-10 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest transition-all"
                    value={villageSearch}
                    onChange={e => { setVillageSearch(e.target.value); setShowVillageDropdown(true); }}
                    onFocus={() => setShowVillageDropdown(true)}
                  />
                  {loadingVillages
                    ? <Loader2 className="absolute right-3 top-2.5 text-ink-soft animate-spin" size={16} />
                    : <MapPin className="absolute right-3 top-2.5 text-ink-soft" size={16} />
                  }
                </div>

                {showVillageDropdown && villages.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-premium-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {villages.slice(0, 80).map((v, i) => (
                      <button
                        key={i}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-cream transition-colors flex items-center justify-between"
                        onClick={() => handleVillageSelect(v)}
                      >
                        <span className="font-medium text-ink">{v.village}</span>
                        {v.village_local && (
                          <span className="text-xs text-ink-soft ml-2">{v.village_local}</span>
                        )}
                      </button>
                    ))}
                    {villages.length > 80 && (
                      <p className="px-4 py-2 text-xs text-ink-soft text-center">
                        Type to narrow results ({villages.length} total)
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Free text for non-Solapur districts */
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('villagePlaceholder')}
                  className="w-full rounded-xl border border-premium-border px-4 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest transition-all"
                  value={data.village}
                  onChange={e => updateData({ village: e.target.value })}
                />
                <MapPin className="absolute right-3 top-2.5 text-ink-soft" size={18} />
              </div>
            )}
          </div>
        </div>

        {/* Coverage note */}
        <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
          <p className="text-xs font-bold text-amber-800 flex items-center">
            <span className="mr-2">ℹ️</span>
            {isSolapur
              ? "Full coverage: 1,154 villages across 11 talukas (LGD + Census 2011 data)"
              : "Demo coverage area: Solapur District, Maharashtra"}
          </p>
        </div>
      </div>

      {/* Footer Nav */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-premium-border">
        <button
          onClick={onBack}
          className="flex items-center text-ink-soft hover:text-ink font-bold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron rounded px-2 py-1"
        >
          <ChevronLeft size={18} className="mr-1" /> {tCommon('back')}
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-8 py-2 rounded-xl text-sm font-bold flex items-center justify-center shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-saffron disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {tCommon('next')} <ArrowRight size={18} className="ml-2" />
        </button>
      </div>
    </div>
  );
}
