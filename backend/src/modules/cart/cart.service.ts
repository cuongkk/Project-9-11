import moment from "moment";
import Tour from "../tour/tour.model";
import City from "../city/city.model";

export interface CartItemInput {
  tourId: string;
  locationFrom?: string;
  departureDate?: string | Date;
  quantity?: number;
  // Allow additional dynamic properties from client
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface CartItemOutput extends CartItemInput {
  tourId: string;
  quantity: number;
  avatar?: string;
  name?: string;
  slug?: string;
  departureDate: string;
  locationFromName?: string;
  priceNew?: number;
  stock?: number;
  priceNewAdult?: number;
  priceNewChildren?: number;
  priceNewBaby?: number;
  stockAdult?: number;
  stockChildren?: number;
  stockBaby?: number;
}

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

const toObjectIdString = (value: unknown): string => {
  const text = String(value || "").trim();
  return objectIdRegex.test(text) ? text : "";
};

const resolveTourLocationId = (tour: any): string => {
  const locations = Array.isArray(tour?.locations) ? tour.locations : [];

  for (const location of locations) {
    if (typeof location === "string") {
      const id = toObjectIdString(location);
      if (id) return id;
      continue;
    }

    if (location && typeof location === "object") {
      const locationObj = location as Record<string, unknown>;
      const candidates = [locationObj._id, locationObj.id, locationObj.cityId, locationObj.locationFrom];
      for (const candidate of candidates) {
        const id = toObjectIdString(candidate);
        if (id) return id;
      }
    }
  }

  return "";
};

const normalizeQuantity = (value: unknown): number => {
  const quantity = Number(value || 1);
  if (!Number.isFinite(quantity)) return 1;
  return Math.max(1, Math.floor(quantity));
};

export async function buildCartDetails(cart: CartItemInput[]): Promise<CartItemOutput[]> {
  const normalizedCart = cart
    .map((item) => ({
      ...item,
      tourId: toObjectIdString(item.tourId),
      locationFrom: toObjectIdString(item.locationFrom),
      quantity: normalizeQuantity(item.quantity),
    }))
    .filter((item) => Boolean(item.tourId));

  const tourIds = [...new Set(normalizedCart.map((c) => c.tourId).filter(Boolean))];

  if (tourIds.length === 0) return [];

  const tours = await Tour.find({ _id: { $in: tourIds }, status: "active", deleted: false }).select(
    "avatar name slug priceNew price stock departureDate locations priceNewAdult priceNewChildren priceNewBaby stockAdult stockChildren stockBaby",
  );

  const tourMap = new Map<string, any>(tours.map((t: any) => [t._id.toString(), t]));

  const cityIds = new Set<string>();
  for (const item of normalizedCart) {
    if (item.locationFrom) {
      cityIds.add(item.locationFrom);
      continue;
    }

    const tourDetail = tourMap.get(item.tourId);
    const fallbackLocationId = resolveTourLocationId(tourDetail);
    if (fallbackLocationId) cityIds.add(fallbackLocationId);
  }

  const cities = cityIds.size > 0 ? await City.find({ _id: { $in: [...cityIds] } }).select("name") : [];
  const cityMap = new Map<string, any>(cities.map((c: any) => [c._id.toString(), c]));

  return normalizedCart
    .map((item) => {
      const tourDetail = tourMap.get(String(item.tourId));
      if (!tourDetail) return null;

      const resolvedLocationFrom = item.locationFrom || resolveTourLocationId(tourDetail);
      const cityDetail = resolvedLocationFrom ? cityMap.get(String(resolvedLocationFrom)) : null;

      const departureDateSource = item.departureDate || tourDetail.departureDate || null;

      const cartItem: CartItemOutput = {
        ...item,
        tourId: String(item.tourId),
        quantity: normalizeQuantity(item.quantity),
        locationFrom: resolvedLocationFrom,
        avatar: tourDetail.avatar,
        name: tourDetail.name,
        slug: tourDetail.slug,
        departureDate: departureDateSource ? moment(departureDateSource).format("DD/MM/YYYY") : "",
        locationFromName: cityDetail?.name || "",
        priceNew: tourDetail.priceNew ?? tourDetail.priceNewAdult,
        stock: tourDetail.stock ?? tourDetail.stockAdult,
        priceNewAdult: tourDetail.priceNewAdult ?? tourDetail.priceNew,
        priceNewChildren: tourDetail.priceNewChildren ?? tourDetail.priceNew,
        priceNewBaby: tourDetail.priceNewBaby ?? tourDetail.priceNew,
        stockAdult: tourDetail.stockAdult ?? tourDetail.stock,
        stockChildren: tourDetail.stockChildren ?? tourDetail.stock,
        stockBaby: tourDetail.stockBaby ?? tourDetail.stock,
      };
      return cartItem;
    })
    .filter(Boolean) as CartItemOutput[];
}
