"use client";
import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, ShieldCheck, Truck, Star, Phone, ArrowRight, Package } from 'lucide-react';
import { YuktiFiInsight } from '@/components/YuktiFiInsight';
import { motion } from 'framer-motion';

const DUMMY_VENDORS = [
  { id: 1, name: "Mahindra Automotives (Authorized)", category: "Heavy Machinery", location: "Nagpur MIDC (12 km away)", rating: 4.8, reviews: 124, verified: true, products: ["Commercial Tractors", "Delivery Vans", "Loading Tempos"], deliveryTime: "3-5 Days", estCost: "₹5.5L - ₹12L" },
  { id: 2, name: "Shree Ganesh Textiles & Looms", category: "Manufacturing", location: "Solapur East (4 km away)", rating: 4.5, reviews: 89, verified: true, products: ["Industrial Sewing Machines", "Cotton Processing Units", "Fabric Cutters"], deliveryTime: "7-10 Days", estCost: "₹45k - ₹2.5L" },
  { id: 3, name: "TechVision Retail Solutions", category: "Electronics", location: "Pune Central (Dispatch Only)", rating: 4.2, reviews: 56, verified: false, products: ["POS Systems", "Barcode Scanners", "Billing Printers"], deliveryTime: "1-2 Days", estCost: "₹15k - ₹50k" },
  { id: 4, name: "Solapur Dairy Equipment Co.", category: "Dairy Farming", location: "Bale, Solapur (6 km away)", rating: 4.9, reviews: 210, verified: true, products: ["Milking Machines", "Chilling Vats", "Cream Separators"], deliveryTime: "2-4 Days", estCost: "₹25k - ₹4L" },
  { id: 5, name: "AgriTech Implements", category: "Agriculture", location: "Barshi Road (8 km away)", rating: 4.4, reviews: 75, verified: true, products: ["Drip Irrigation Kits", "Power Tillers", "Sprayers"], deliveryTime: "3-6 Days", estCost: "₹10k - ₹1.5L" },
  { id: 6, name: "Modern Mill Machinery", category: "Flour Mill", location: "Akkalkot Road (5 km away)", rating: 4.6, reviews: 132, verified: true, products: ["Commercial Atta Chakki", "Grain Grinders", "Spice Pulverizers"], deliveryTime: "5-8 Days", estCost: "₹30k - ₹1.8L" },
  { id: 7, name: "Sewing Machine Hub", category: "Tailoring", location: "Navi Peth (2 km away)", rating: 4.1, reviews: 44, verified: false, products: ["Usha Sewing Machines", "Overlock Machines", "Embroidery Units"], deliveryTime: "1-3 Days", estCost: "₹8k - ₹35k" },
  { id: 8, name: "Poultry Tech Solutions", category: "Poultry Farming", location: "Hotgi Road (7 km away)", rating: 4.7, reviews: 92, verified: true, products: ["Incubators", "Feeding Troughs", "Ventilation Systems"], deliveryTime: "4-7 Days", estCost: "₹20k - ₹2L" },
  { id: 9, name: "Shree Krishna Packaging", category: "Packaging", location: "MIDC Solapur (10 km away)", rating: 4.3, reviews: 68, verified: true, products: ["Sealing Machines", "Corrugated Boxes", "Vacuum Packers"], deliveryTime: "2-5 Days", estCost: "₹5k - ₹80k" },
  { id: 10, name: "Ramesh Trading Co.", category: "General Retail", location: "Phaltan Galli (1 km away)", rating: 4.0, reviews: 31, verified: false, products: ["Display Racks", "Glass Counters", "Weighing Scales"], deliveryTime: "1-2 Days", estCost: "₹12k - ₹60k" },
  { id: 11, name: "Livestock Feed Depot", category: "Dairy Farming", location: "Solapur APMC (3 km away)", rating: 4.8, reviews: 185, verified: true, products: ["Cattle Feed", "Mineral Mixtures", "Fodder Cutters"], deliveryTime: "1-2 Days", estCost: "₹2k - ₹25k" },
  { id: 12, name: "SuperFast Ovens", category: "Food Processing", location: "Bhavani Peth (2.5 km away)", rating: 4.5, reviews: 112, verified: true, products: ["Bakery Ovens", "Dough Mixers", "Display Fridges"], deliveryTime: "5-10 Days", estCost: "₹40k - ₹3L" },
  { id: 13, name: "GreenHouse Structures Ltd", category: "Agriculture", location: "Pune-Solapur Hwy (15 km away)", rating: 4.7, reviews: 88, verified: true, products: ["Polyhouse Kits", "Shade Nets", "Cooling Pads"], deliveryTime: "10-15 Days", estCost: "₹1L - ₹5L" },
  { id: 14, name: "ElectroPower Generators", category: "Electronics", location: "Kumbhari (11 km away)", rating: 4.4, reviews: 54, verified: false, products: ["Diesel Generators", "Inverters", "Solar Panels"], deliveryTime: "3-7 Days", estCost: "₹50k - ₹4L" },
  { id: 15, name: "Jadhav Handlooms", category: "Manufacturing", location: "Main Road (3.5 km away)", rating: 4.9, reviews: 245, verified: true, products: ["Handloom Frames", "Yarn Spinning Wheels", "Dyeing Vats"], deliveryTime: "7-12 Days", estCost: "₹25k - ₹1.5L" }
];

export default function Marketplace() {
  const { categoryName, locationName } = useStore();
  const [search, setSearch] = useState("");

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 text-warm-text animate-in fade-in duration-500">
      
      <div className="mb-8 mt-6 flex flex-col md:flex-row justify-between md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendor & Equipment Hub</h1>
          <p className="text-warm-muted mt-2">Procure machinery from registered local suppliers for your {categoryName || 'Business'}.</p>
        </div>
      </div>

      <YuktiFiInsight 
        type="info"
        title="NSFDC SUBSIDY APPLICABLE"
        message="Vendors with the green 'Registered' badge are recognized by the government. Purchasing from them automatically qualifies you for a 5% GST rebate on heavy machinery."
        className="mb-8 rounded-xl !font-sans"
      />

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-warm-muted" />
          <input 
            type="text" 
            placeholder="Search equipment (e.g. Sewing Machine, POS...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-warm-border focus:outline-none focus:ring-2 focus:ring-warm-primary/50 transition-shadow bg-warm-surface"
          />
        </div>
        <select className="px-6 py-4 rounded-xl border border-warm-border focus:outline-none bg-warm-surface text-warm-text font-medium cursor-pointer">
          <option>Sort by: Recommended</option>
          <option>Distance: Nearest</option>
          <option>Price: Low to High</option>
          <option>Rating: Highest</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {DUMMY_VENDORS.map((vendor, idx) => (
          <motion.div 
            key={vendor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="bg-warm-surface border-warm-border shadow-sm hover:shadow-md transition-shadow h-full flex flex-col overflow-hidden group">
              <div className="h-2 w-full bg-warm-bg group-hover:bg-warm-primary transition-colors"></div>
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg leading-tight mb-1">{vendor.name}</h3>
                    <div className="flex items-center text-xs text-warm-muted">
                      <MapPin size={12} className="mr-1" /> {vendor.location}
                    </div>
                  </div>
                  {vendor.verified && (
                    <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded-full" title="NSFDC Registered Vendor">
                      <ShieldCheck size={18} />
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-1 mb-6">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span className="text-sm font-bold">{vendor.rating}</span>
                  <span className="text-xs text-warm-muted">({vendor.reviews} reviews)</span>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  <h4 className="text-xs font-bold text-warm-muted uppercase tracking-wider">Top Equipment</h4>
                  <ul className="space-y-2">
                    {vendor.products.map((p, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <Package size={14} className="mr-2 mt-0.5 text-warm-primary/70" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-warm-border mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-warm-muted">Estimated Cost:</span>
                    <span className="font-bold text-warm-primary">{vendor.estCost}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-warm-muted">Delivery:</span>
                    <span className="text-sm flex items-center"><Truck size={14} className="mr-1 text-warm-muted" /> {vendor.deliveryTime}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <button className="flex items-center justify-center py-2 px-4 border border-warm-border rounded-lg hover:bg-warm-bg transition-colors text-sm font-medium">
                    <Phone size={16} className="mr-2 text-warm-muted" /> Call
                  </button>
                  <button className="flex items-center justify-center py-2 px-4 bg-warm-primary hover:bg-warm-primary/90 text-warm-text rounded-lg transition-colors text-sm font-medium">
                    Request Quote
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
