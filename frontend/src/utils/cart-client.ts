import type { ApiResponse, CartData } from "@/types/client-api";

const CART_UPDATED_EVENT = "travelka-cart-updated";

const getApiBase = (): string => (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

const parseCartResponse = (payload: ApiResponse<CartData> | null | undefined): CartData => {
  return {
    cart: payload?.data?.cart || [],
    summary: payload?.data?.summary || { itemCount: 0, totalQuantity: 0 },
  };
};

export class ApiClientError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

export const emitCartUpdated = (): void => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
};

export const onCartUpdated = (handler: () => void): (() => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener(CART_UPDATED_EVENT, handler);
  return () => window.removeEventListener(CART_UPDATED_EVENT, handler);
};

export const getMyCart = async (): Promise<CartData> => {
  const response = await fetch(`${getApiBase()}/cart`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const payload = (await response.json()) as ApiResponse<CartData>;

  if (!response.ok || payload?.success !== true) {
    throw new ApiClientError(payload?.message || "Không tải được giỏ hàng.", response.status);
  }

  return parseCartResponse(payload);
};

export const addTourToCart = async (tourId: string, quantity = 1): Promise<CartData> => {
  const response = await fetch(`${getApiBase()}/cart/items`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tourId, quantity }),
  });

  const payload = (await response.json()) as ApiResponse<CartData>;

  if (!response.ok || payload?.success !== true) {
    throw new Error(payload?.message || "Không thể thêm vào giỏ hàng.");
  }

  emitCartUpdated();
  return parseCartResponse(payload);
};

export const updateCartItemQuantity = async (tourId: string, quantity: number): Promise<CartData> => {
  const response = await fetch(`${getApiBase()}/cart/items/${encodeURIComponent(tourId)}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });

  const payload = (await response.json()) as ApiResponse<CartData>;

  if (!response.ok || payload?.success !== true) {
    throw new Error(payload?.message || "Không thể cập nhật số lượng.");
  }

  emitCartUpdated();
  return parseCartResponse(payload);
};

export const removeCartItem = async (tourId: string): Promise<CartData> => {
  const response = await fetch(`${getApiBase()}/cart/items/${encodeURIComponent(tourId)}`, {
    method: "DELETE",
    credentials: "include",
  });

  const payload = (await response.json()) as ApiResponse<CartData>;

  if (!response.ok || payload?.success !== true) {
    throw new Error(payload?.message || "Không thể xóa chuyến đi.");
  }

  emitCartUpdated();
  return parseCartResponse(payload);
};
