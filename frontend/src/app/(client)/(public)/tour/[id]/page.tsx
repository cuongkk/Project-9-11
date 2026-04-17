"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TourDetail } from "../../../../../components/features/tour/TourDetail";
import type { ApiResponse, DashboardTourDetailData, PublicTour } from "@/types/client-api";
import { setReloadToast, showReloadToastIfAny } from "@/utils/toast";

export default function TourDetailPage() {
  const params = useParams<{ id: string }>();
  const slug = params?.id || "";

  const [loading, setLoading] = useState(true);
  const [tour, setTour] = useState<PublicTour | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setReloadToast("error", "Khong tim thay tour.");
      showReloadToastIfAny();
      return;
    }

    const loadDetail = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/tours/${encodeURIComponent(slug)}`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Khong tai duoc chi tiet tour. Vui long thu lai.");
        }

        const payload = (await response.json()) as ApiResponse<DashboardTourDetailData>;
        const result = payload.data?.tour || null;

        setTour(result);
        if (!result) {
          setReloadToast("error", "Tour khong ton tai hoac da an.");
          showReloadToastIfAny();
        }
      } catch (fetchError) {
        console.error(fetchError);
        setReloadToast("error", "Khong tai duoc chi tiet tour. Vui long thu lai.");
        showReloadToastIfAny();
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [slug]);

  if (loading) {
    return <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 text-on-surface-variant">Dang tai chi tiet tour...</div>;
  }

  if (!tour) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-6">
        <p className="text-red-600 font-medium mb-4">Khong tim thay tour.</p>
        <Link href="/tour" className="text-primary font-semibold hover:underline">
          Quay ve danh sach tour
        </Link>
      </div>
    );
  }

  return <TourDetail tour={tour} />;
}
