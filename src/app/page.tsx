
"use client";

import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import GeoMapperClient from '@/components/geo-mapper-client';

export default function ProtectedMapPage() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return <GeoMapperClient />;
}
