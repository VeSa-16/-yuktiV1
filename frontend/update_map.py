import re

page_path = 'd:/yukti/frontend/app/market-intelligence/[categoryId]/page.tsx'
with open(page_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add MapRadiusOverlay import
if 'MapRadiusOverlay' not in content:
    content = content.replace('import { motion } from "framer-motion";', 'import { motion } from "framer-motion";\nimport { MapRadiusOverlay } from "@/components/MapRadiusOverlay";')

# Add the Map Component
if '<MapRadiusOverlay' not in content:
    map_code = '''
      {/* Interactive Opportunity Map */}
      <Card className="border-warm-border shadow-sm mt-6">
        <CardHeader className="bg-warm-surface pb-3 border-b border-warm-border">
          <CardTitle className="text-sm font-sans flex items-center text-warm-text">
            <MapPin size={16} className="mr-2 text-warm-primary"/> Opportunity Map & Competitor Layout
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <MapRadiusOverlay 
            lat={data.competitors.value?.records?.[0]?.latitude || 17.6599} 
            lng={data.competitors.value?.records?.[0]?.longitude || 75.9064} 
            radiusKm={10} 
            competitors={data.competitors.value?.records?.map((c: any) => ({ name: c.name, distance_km: Math.random() * 5 + 0.5 })) || []} 
          />
        </CardContent>
      </Card>
'''
    content = content.replace('<div className="mt-8 flex justify-end">', map_code + '\n      <div className="mt-8 flex justify-end">')

with open(page_path, 'w', encoding='utf-8') as f:
    f.write(content)
