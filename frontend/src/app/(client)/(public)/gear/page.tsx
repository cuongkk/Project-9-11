"use client";

import { useEffect, useState } from "react";
import { GearCategoryGrid } from "@/components/features/gear/GearCategoryGrid";
import { GearHero } from "@/components/features/gear/GearHero";
import { GearNewsletter } from "@/components/features/gear/GearNewsletter";
import { GearProductGrid } from "@/components/features/gear/GearProductGrid";
import type { ApiResponse, DashboardGearsData, PublicGear } from "@/types/client-api";
import { setReloadToast, showReloadToastIfAny } from "@/utils/toast";

export default function GearPage() {
  const [products, setProducts] = useState<PublicGear[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGears = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/gears`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Khong tai duoc du lieu gear.");
        }

        const payload = (await response.json()) as ApiResponse<DashboardGearsData>;
        setProducts(payload.data?.gearList || []);
        setCategories(payload.data?.categories || []);
      } catch (fetchError) {
        console.error(fetchError);
        setReloadToast("error", "Khong tai duoc du lieu gear.");
        showReloadToastIfAny();
      } finally {
        setLoading(false);
      }
    };

    loadGears();
  }, []);

  return (
    <main className="pt-20">
      <GearHero />
      <GearCategoryGrid labels={categories} />
      <GearProductGrid products={products} loading={loading} error={null} />
      <GearNewsletter />
    </main>
  );
}
