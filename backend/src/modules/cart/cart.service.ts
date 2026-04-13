import moment from "moment";
import Tour from "../tour/tour.model";
import City from "../city/city.model";

export interface CartItemInput {
  tourId: string;
  locationFrom: string;
  departureDate: string | Date;
  // Allow additional dynamic properties from client
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface CartItemOutput extends CartItemInput {
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

export async function buildCartDetails(cart: CartItemInput[]): Promise<CartItemOutput[]> {
  const tourIds = [...new Set(cart.map((c) => c.tourId).filter(Boolean))];
  const cityIds = [...new Set(cart.map((c) => c.locationFrom).filter(Boolean))];

  const [tours, cities] = await Promise.all([
    Tour.find({ _id: { $in: tourIds }, status: "active", deleted: false }).select("avatar name slug priceNew stock priceNewAdult priceNewChildren priceNewBaby stockAdult stockChildren stockBaby"),
    City.find({ _id: { $in: cityIds } }).select("name"),
  ]);

  const tourMap = new Map<string, any>(tours.map((t: any) => [t._id.toString(), t]));
  const cityMap = new Map<string, any>(cities.map((c: any) => [c._id.toString(), c]));

  return cart
    .map((item) => {
      const tourDetail = tourMap.get(String(item.tourId));
      const cityDetail = cityMap.get(String(item.locationFrom));
      if (!tourDetail || !cityDetail) return null;

      const cartItem: CartItemOutput = {
        ...item,
        avatar: tourDetail.avatar,
        name: tourDetail.name,
        slug: tourDetail.slug,
        departureDate: moment(item.departureDate).format("DD/MM/YYYY"),
        locationFromName: cityDetail.name || "",
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
