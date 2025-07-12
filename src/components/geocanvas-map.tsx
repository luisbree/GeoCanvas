'use client';

import 'ol/ol.css';
import { Map, View, Feature } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style';
import { useEffect, useRef, useState } from 'react';
import { Crosshair } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function GeocanvasMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (mapRef.current && !map) {
      const vectorSource = new VectorSource();
      const vectorLayer = new VectorLayer({
        source: vectorSource,
        // The style for the location marker is set directly on the feature
      });

      const initialMap = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
        ],
        view: new View({
          center: fromLonLat([0, 0]),
          zoom: 2,
        }),
        controls: [], // Use custom controls
      });

      setMap(initialMap);

      return () => {
        if (initialMap) {
          initialMap.dispose();
        }
      };
    }
  }, [map]);

  const handleLocateClick = () => {
    if (!map) return;

    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: 'Geolocation Not Supported',
        description: "Your browser doesn't support the Geolocation API.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        const coords = fromLonLat([longitude, latitude]);

        map.getView().animate({ center: coords, zoom: 15, duration: 1500 });

        const vectorLayer = map.getLayers().getArray().find(layer => layer instanceof VectorLayer) as VectorLayer<VectorSource<Point>> | undefined;
        const vectorSource = vectorLayer?.getSource();
        
        if (vectorSource) {
          vectorSource.clear();
          const locationFeature = new Feature({
            geometry: new Point(coords),
          });

          locationFeature.setStyle(
            new Style({
              image: new CircleStyle({
                radius: 8,
                fill: new Fill({ color: 'hsl(var(--primary))' }),
                stroke: new Stroke({ color: '#FFFFFF', width: 2 }),
              }),
            })
          );

          vectorSource.addFeature(locationFeature);
        }
      },
      (error) => {
        let description = 'An unknown error occurred.';
        if (error.code === error.PERMISSION_DENIED) {
            description = 'Please allow location access to use this feature.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
            description = 'Location information is currently unavailable.';
        }
        toast({
          variant: 'destructive',
          title: 'Error Getting Location',
          description,
        });
      },
      {
        enableHighAccuracy: true,
      }
    );
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full bg-muted" />
      <Button
        variant="default"
        size="icon"
        className="absolute bottom-6 right-6 z-10 rounded-full shadow-lg bg-accent hover:bg-accent/90"
        onClick={handleLocateClick}
        aria-label="Locate me"
      >
        <Crosshair className="h-5 w-5 text-accent-foreground" />
      </Button>
    </div>
  );
}
