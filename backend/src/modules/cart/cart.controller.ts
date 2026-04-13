import type { Request, Response } from "express";
import { buildCartDetails, type CartItemInput } from "./cart.service";
import { asyncHandler } from "../../utils/async-handler";
import { sendSuccess } from "../../utils/response";

export const CartController = {
  // Không render view nữa, chỉ trả JSON (ví dụ dùng cho frontend React/Next)
  cart: (req: Request, res: Response): void => {
    sendSuccess(res, "API giỏ hàng");
  },

  render: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { cart } = req.body as { cart?: CartItemInput[] };

    const cartDetails = await buildCartDetails(cart || []);

    sendSuccess(res, "Thành công!", { cart: cartDetails });
  }),
} as const;
