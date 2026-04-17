import type { Request, Response } from "express";
import { buildCartDetails, type CartItemInput } from "./cart.service";
import { asyncHandler } from "../../utils/async-handler";
import { sendSuccess } from "../../utils/response";
import AccountAdmin from "../auth/account.model";
import type { AccountRequest } from "../../interfaces/request.interface";
import { HttpError } from "../../middlewares/error.middleware";

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

const toObjectIdString = (value: unknown): string => {
  const text = String(value || "").trim();
  return objectIdRegex.test(text) ? text : "";
};

const normalizeQuantity = (value: unknown): number => {
  const quantity = Number(value || 1);
  if (!Number.isFinite(quantity)) return 1;
  return Math.max(1, Math.floor(quantity));
};

const normalizeStoredCart = (cart: unknown): CartItemInput[] => {
  if (!Array.isArray(cart)) return [];

  return cart
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      const raw = item as Record<string, unknown>;
      const tourId = toObjectIdString(raw.tourId);
      if (!tourId) return null;

      const locationFrom = toObjectIdString(raw.locationFrom);

      return {
        tourId,
        quantity: normalizeQuantity(raw.quantity),
        locationFrom: locationFrom || undefined,
        departureDate: raw.departureDate ? String(raw.departureDate) : undefined,
      } as CartItemInput;
    })
    .filter((item): item is CartItemInput => Boolean(item));
};

const getAuthUserId = (req: Request): string => {
  const userId = (req as AccountRequest).user?.id;
  if (!userId) {
    throw new HttpError(401, "Bạn cần đăng nhập để thực hiện thao tác này.");
  }
  return userId;
};

const buildCartSummary = (cart: CartItemInput[]): { itemCount: number; totalQuantity: number } => {
  const itemCount = cart.length;
  const totalQuantity = cart.reduce((acc, item) => acc + normalizeQuantity(item.quantity), 0);
  return { itemCount, totalQuantity };
};

const getAccountByUserId = async (userId: string) => {
  const account = await AccountAdmin.findById(userId).select("cart status");
  if (!account || account.status !== "active") {
    throw new HttpError(401, "Tài khoản không hợp lệ hoặc đã bị khóa.");
  }
  return account;
};

export const CartController = {
  cart: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = getAuthUserId(req);
    const account = await getAccountByUserId(userId);

    const cartInput = normalizeStoredCart((account as any).cart);
    const cartDetails = await buildCartDetails(cartInput);

    sendSuccess(res, "Lấy giỏ hàng thành công!", {
      cart: cartDetails,
      summary: buildCartSummary(cartDetails),
    });
  }),

  addItem: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = getAuthUserId(req);
    const account = await getAccountByUserId(userId);
    const { tourId, quantity } = req.body as { tourId: string; quantity?: number };

    const normalizedTourId = toObjectIdString(tourId);
    if (!normalizedTourId) {
      throw new HttpError(400, "Tour không hợp lệ.");
    }

    const cart = normalizeStoredCart((account as any).cart);
    const existedIndex = cart.findIndex((item) => item.tourId === normalizedTourId);
    const nextQuantity = normalizeQuantity(quantity);

    if (existedIndex >= 0) {
      const currentQuantity = normalizeQuantity(cart[existedIndex].quantity);
      cart[existedIndex].quantity = currentQuantity + nextQuantity;
    } else {
      cart.push({
        tourId: normalizedTourId,
        quantity: nextQuantity,
      });
    }

    await AccountAdmin.updateOne({ _id: userId }, { $set: { cart } });

    const cartDetails = await buildCartDetails(cart);

    sendSuccess(res, "Đã thêm tour vào giỏ hàng!", {
      cart: cartDetails,
      summary: buildCartSummary(cartDetails),
    });
  }),

  updateItemQuantity: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = getAuthUserId(req);
    const account = await getAccountByUserId(userId);
    const { tourId } = req.params as { tourId: string };
    const { quantity } = req.body as { quantity: number };

    const normalizedTourId = toObjectIdString(tourId);
    if (!normalizedTourId) {
      throw new HttpError(400, "Tour không hợp lệ.");
    }

    const cart = normalizeStoredCart((account as any).cart);
    const existedIndex = cart.findIndex((item) => item.tourId === normalizedTourId);

    if (existedIndex < 0) {
      throw new HttpError(404, "Tour chưa có trong giỏ hàng.");
    }

    cart[existedIndex].quantity = normalizeQuantity(quantity);

    await AccountAdmin.updateOne({ _id: userId }, { $set: { cart } });

    const cartDetails = await buildCartDetails(cart);

    sendSuccess(res, "Cập nhật số lượng thành công!", {
      cart: cartDetails,
      summary: buildCartSummary(cartDetails),
    });
  }),

  removeItem: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = getAuthUserId(req);
    const account = await getAccountByUserId(userId);
    const { tourId } = req.params as { tourId: string };

    const normalizedTourId = toObjectIdString(tourId);
    if (!normalizedTourId) {
      throw new HttpError(400, "Tour không hợp lệ.");
    }

    const cart = normalizeStoredCart((account as any).cart).filter((item) => item.tourId !== normalizedTourId);

    await AccountAdmin.updateOne({ _id: userId }, { $set: { cart } });

    const cartDetails = await buildCartDetails(cart);

    sendSuccess(res, "Đã xóa tour khỏi giỏ hàng!", {
      cart: cartDetails,
      summary: buildCartSummary(cartDetails),
    });
  }),

  render: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { cart } = req.body as { cart?: CartItemInput[] };

    const cartDetails = await buildCartDetails(cart || []);

    sendSuccess(res, "Thành công!", { cart: cartDetails });
  }),
} as const;
