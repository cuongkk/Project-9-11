"use client";

import { useEffect, useMemo, useState } from "react";
import { FaSliders } from "react-icons/fa6";
import { TourHero } from "@/components/features/tour/TourHero";
import { TourFilters, type TourSort } from "@/components/features/tour/TourFilters";
import { TourList } from "@/components/features/tour/TourList";
import type { ApiResponse, DashboardToursData, PublicTour } from "@/types/client-api";
import { setReloadToast, showReloadToastIfAny } from "@/utils/toast";

export default function TourPage() {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [departureFrom, setDepartureFrom] = useState("");
  const [sort, setSort] = useState<TourSort>("latest");
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState<PublicTour[]>([]);

  useEffect(() => {
    const loadTours = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/tours`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Khong tai duoc danh sach tour");
        }

        const payload = (await response.json()) as ApiResponse<DashboardToursData>;
        setTours(payload.data?.tourList || []);
      } catch (fetchError) {
        console.error(fetchError);
        setReloadToast("error", "Khong tai duoc danh sach tour. Vui long thu lai.");
        showReloadToastIfAny();
      } finally {
        setLoading(false);
      }
    };

    loadTours();
  }, []);

  const filteredTours = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    const min = Number(minPrice);
    const max = Number(maxPrice);
    const hasMin = minPrice.trim() !== "" && Number.isFinite(min);
    const hasMax = maxPrice.trim() !== "" && Number.isFinite(max);
    const departureFromTime = departureFrom ? new Date(departureFrom).getTime() : null;

    let nextTours = tours.filter((tour) => {
      const categoryName = tour.category?.name?.toLowerCase() || "";
      const finalPrice = tour.priceNew > 0 ? tour.priceNew : tour.price;
      const departureTime = tour.departureDate ? new Date(tour.departureDate).getTime() : null;
      const matchKeyword = !keyword || tour.name.toLowerCase().includes(keyword) || categoryName.includes(keyword) || (tour.information || "").toLowerCase().includes(keyword);
      const matchCategory = selectedCategories.length === 0 || selectedCategories.some((item) => categoryName === item.toLowerCase());
      const matchMinPrice = !hasMin || finalPrice >= min;
      const matchMaxPrice = !hasMax || finalPrice <= max;
      const matchDeparture = departureFromTime === null || (departureTime !== null && departureTime >= departureFromTime);

      return matchKeyword && matchCategory && matchMinPrice && matchMaxPrice && matchDeparture;
    });

    if (sort === "price-asc") {
      nextTours = [...nextTours].sort((a, b) => (a.priceNew > 0 ? a.priceNew : a.price) - (b.priceNew > 0 ? b.priceNew : b.price));
    }

    if (sort === "price-desc") {
      nextTours = [...nextTours].sort((a, b) => (b.priceNew > 0 ? b.priceNew : b.price) - (a.priceNew > 0 ? a.priceNew : a.price));
    }

    return nextTours;
  }, [query, selectedCategories, minPrice, maxPrice, departureFrom, sort, tours]);

  const categories = useMemo(() => {
    return Array.from(new Set(tours.map((tour) => tour.category?.name).filter((item): item is string => Boolean(item))));
  }, [tours]);

  return (
    <main className="pt-16 pb-32">
      <TourHero query={query} onQueryChange={setQuery} title="Tận hưởng chuyến đi" subtitle="Khám phá những hành trình tuyệt vời nhất" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          <TourFilters
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryToggle={(value) => {
              setSelectedCategories((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
            }}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            departureFrom={departureFrom}
            onDepartureFromChange={setDepartureFrom}
            sort={sort}
            onSortChange={setSort}
            onReset={() => {
              setQuery("");
              setSelectedCategories([]);
              setMinPrice("");
              setMaxPrice("");
              setDepartureFrom("");
              setSort("latest");
            }}
          />

          <section className="grow">
            <TourList tours={filteredTours} loading={loading} emptyMessage="Không tìm thấy tour phù hợp." />
          </section>
        </div>
      </div>
    </main>
  );
}
