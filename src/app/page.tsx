import { MapPin } from 'lucide-react';
import GeocanvasMap from '@/components/geocanvas-map';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <MapPin className="text-primary w-8 h-8" />
          <h1 className="text-2xl font-bold font-headline text-primary">GeoCanvas</h1>
        </div>
        <p className="hidden sm:block text-muted-foreground">Interactive OpenLayers Map</p>
      </header>
      <main className="flex-1 relative">
        <GeocanvasMap />
      </main>
    </div>
  );
}
