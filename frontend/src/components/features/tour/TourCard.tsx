import Link from "next/link";
import { FaArrowRight, FaLocationDot, FaStar } from "react-icons/fa6";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { setReloadToast, showReloadToastIfAny } from "@/utils/toast";
import type { PublicTour } from "@/types/client-api";

const formatPrice = (value: number): string => {
  return `${Math.max(0, value).toLocaleString("vi-VN")}đ`;
};

type TourCardProps = {
  tour: PublicTour;
};

export function TourCard({ tour }: TourCardProps) {
  const previewLocation = Array.isArray(tour.locations) && tour.locations.length > 0 ? String(tour.locations[0]?.name || tour.locations[0]?.title || "Viet Nam") : "Viet Nam";
  const finalPrice = tour.priceNew > 0 ? tour.priceNew : tour.price;
  const rating = tour.rating > 0 ? tour.rating : 4.9;
  const reviewCount = Math.max(0, tour.reviewCount || 0);

  const { userInfo, isLogin, mutate } = useAuth();
  return (
    <article className="group bg-surface-container-lowest rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_24px_48px_-12px_rgba(17,24,39,0.12)] border border-surface-container-high/50 relative">


      <div className="aspect-4/3 overflow-hidden relative bg-surface-container-low">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={tour.avatar || "/client/images/avatar-2.jpg"} alt={tour.name} />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
          <span className="text-sm font-bold text-primary">{formatPrice(finalPrice)}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
          {tour.category?.name || "Tour"} {tour.time ? `• ${tour.time}` : ""}
        </div>

        <h3 className="text-xl font-extrabold tracking-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">{tour.name}</h3>

        <p className="text-sm text-on-surface-variant line-clamp-2 mb-4">{tour.information || "Khong co mo ta ngan"}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-on-surface-variant text-sm">
            <span className="flex items-center gap-1">
              <FaLocationDot className="text-xs" /> {previewLocation}
            </span>
            <span className="flex items-center gap-1 text-amber-500">
              <FaStar className="text-xs" /> {rating.toFixed(1)}
              {reviewCount > 0 ? ` (${reviewCount})` : ""}
            </span>
          </div>

          <Link
            href={`/tour/${tour.slug}`}
            className="bg-[#5EEB5B] text-[#004708] w-10 h-10 rounded-full text-sm font-extrabold flex-shrink-0 hover:opacity-80 transition-opacity inline-flex items-center justify-center"
          >
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </article>
  );
}
