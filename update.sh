#!/bin/bash
sed -i '' 's/text-3xl font-extrabold tracking-tight/text-3xl font-bold tracking-tight/g' app/components/TestimonialsShowcase.tsx
sed -i '' 's/h-10 w-10 rounded-full/h-12 w-12 rounded-full/g' app/components/TestimonialsShowcase.tsx
sed -i '' 's/h-10 w-10 items-center/h-12 w-12 items-center/g' app/components/TestimonialsShowcase.tsx
sed -i '' 's/rounded-xl border border-black\/\[0.06\] bg-white p-5 shadow-\[0_10px_30px_-14px_rgba(80,80,120,0.25)\]/rounded-[10px] border border-black\/[0.04] bg-white p-6 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)]/g' app/components/TestimonialsShowcase.tsx
sed -i '' 's/text-\[13px\] font-semibold text-black/text-[15px] font-bold text-[#18181b]/g' app/components/TestimonialsShowcase.tsx
sed -i '' 's/text-\[11px\] text-\[#52525b\]/text-[13px] text-[#52525b]/g' app/components/TestimonialsShowcase.tsx
sed -i '' 's/text-\[13px\] leading-\[1.3\] text-\[#27272a\] sm:text-\[15px\]/mt-4 text-[15px] leading-[1.6] text-[#3f3f46]/g' app/components/TestimonialsShowcase.tsx
sed -i '' 's/mt-1.5 flex flex-wrap gap-x-2 text-xs/mt-3 flex flex-wrap gap-x-2 text-[13px]/g' app/components/TestimonialsShowcase.tsx
