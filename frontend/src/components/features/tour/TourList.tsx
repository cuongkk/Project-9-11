import { TourCard } from "@/components/features/tour/TourCard";
import type { PublicTour } from "@/types/client-api";

type TourListProps = {
  tours: PublicTour[];
  loading: boolean;
  emptyMessage?: string;
};

export function TourList({ tours, loading, emptyMessage = "Chua co tour nao dang mo ban." }: TourListProps) {
  if (loading) {
    return <p className="text-on-surface-variant font-medium">Dang tai tour...</p>;
  }

  if (tours.length === 0) {
    return <p className="text-on-surface-variant font-medium">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}
