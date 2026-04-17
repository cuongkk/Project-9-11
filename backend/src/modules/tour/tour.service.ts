import type { Request } from "express";
import moment from "moment";
import slugify from "slugify";
import Category from "../category/category.model";
import City from "../city/city.model";
import { buildCategoryTree } from "../category/category.helper";
import Tour from "./tour.model";
import { pagination } from "../../utils/pagination.helper";
import { AccountRequest } from "../../interfaces/request.interface";

const toInt = (value: unknown, fallback = 0): number => {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = parseInt(String(value), 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const normalizeTourPricing = (body: any): void => {
  const basePrice = toInt(body.price, toInt(body.priceAdult, 0));
  const salePrice = toInt(body.priceNew, toInt(body.priceNewAdult, basePrice));
  const stock = toInt(body.stock, toInt(body.stockAdult, 0));

  body.price = basePrice;
  body.priceNew = salePrice;
  body.stock = stock;
};

const parseJsonArrayField = (value: unknown, fallback: any[] = []): { value: any[]; error?: string } => {
  if (value === undefined) {
    return { value: fallback };
  }

  if (Array.isArray(value)) {
    return { value };
  }

  if (typeof value === "string") {
    if (!value.trim()) {
      return { value: [] };
    }

    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) {
        return { value: fallback, error: "Dữ liệu mảng không hợp lệ!" };
      }
      return { value: parsed };
    } catch (_error) {
      return { value: fallback, error: "Dữ liệu mảng không hợp lệ!" };
    }
  }

  return { value: fallback, error: "Dữ liệu mảng không hợp lệ!" };
};

const parseDateField = (value: unknown, fallback: Date | null = null): { value: Date | null; error?: string } => {
  if (value === undefined) {
    return { value: fallback };
  }
  if (value === null || value === "") {
    return { value: null };
  }
  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) {
    return { value: fallback, error: "Ngày không hợp lệ!" };
  }
  return { value: parsed };
};

const ensureValidDateRange = (departureDate: Date | null, endDate: Date | null): string | null => {
  if ((departureDate && !endDate) || (!departureDate && endDate)) {
    return "Ngày khởi hành và ngày kết thúc phải được nhập đồng thời!";
  }
  if (departureDate && endDate && endDate.getTime() < departureDate.getTime()) {
    return "Ngày kết thúc phải lớn hơn hoặc bằng ngày khởi hành!";
  }
  return null;
};

const buildDurationLabel = (departureDate: Date | null, endDate: Date | null): string => {
  if (!departureDate || !endDate) {
    return "";
  }
  const diffMs = endDate.getTime() - departureDate.getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  const days = Math.ceil(diffMs / dayMs) + 1;
  return `${days} ngày`;
};

const extractSlugBase = (value: unknown): string => {
  const raw = String(value || "").trim();
  return slugify(raw, { lower: true, strict: true });
};

const buildUniqueTourSlug = async (slugBase: string, excludeId?: string): Promise<string> => {
  let base = slugBase || `tour-${Date.now()}`;
  let candidate = base;
  let counter = 1;

  while (true) {
    const condition: any = { slug: candidate };
    if (excludeId) {
      condition._id = { $ne: excludeId };
    }
    const existed = await Tour.findOne(condition).select("_id");
    if (!existed) {
      return candidate;
    }
    candidate = `${base}-${counter}`;
    counter += 1;
  }
};

const isDuplicateKeyError = (error: unknown): boolean => {
  return typeof error === "object" && error !== null && (error as any).code === 11000;
};

export const list = async (req: Request): Promise<{ tourList: any[]; pagination: any }> => {
  const find: any = { deleted: false };

  const pageInfo = await pagination(Tour, find, req as any);

  const tourList: any[] = await Tour.find(find).sort({ createdAt: "desc" }).limit(pageInfo.limitItems).skip(pageInfo.skip);

  for (const item of tourList) {
    if ((item as any).createdBy) {
      (item as any).createdByFullName = "Admin";
      (item as any).createdAtFormat = moment((item as any).createdAt).format("HH:mm - DD/MM/YYYY");
    }

    if ((item as any).updatedBy) {
      (item as any).updatedByFullName = "Admin";
      (item as any).updatedAtFormat = moment((item as any).updatedAt).format("HH:mm - DD/MM/YYYY");
    }
  }

  return { tourList, pagination: pageInfo };
};

export const create = async (req: Request): Promise<{ categoryList: any[]; cityList: any[] }> => {
  const categoryList = await Category.find({ deletedAt: { $exists: false } });
  const categoryTree = buildCategoryTree(categoryList as any[]);

  const cityList = await City.find({});
  return { categoryList: categoryTree, cityList };
};

export const createPost = async (req: Request): Promise<{ code: string; message: string }> => {
  try {
    const anyReq = req as any;
    const reqWithAccount = req as AccountRequest;

    const payload: any = { ...anyReq.body };
    normalizeTourPricing(payload);

    const locationsParsed = parseJsonArrayField(payload.locations, []);
    if (locationsParsed.error) {
      return { code: "error", message: "Danh sách điểm đến không hợp lệ!" };
    }
    const schedulesParsed = parseJsonArrayField(payload.schedules, []);
    if (schedulesParsed.error) {
      return { code: "error", message: "Lịch trình tour không hợp lệ!" };
    }
    payload.locations = locationsParsed.value;
    payload.schedules = schedulesParsed.value;

    const departureDateParsed = parseDateField(payload.departureDate, null);
    if (departureDateParsed.error) {
      return { code: "error", message: "Ngày khởi hành không hợp lệ!" };
    }
    const endDateParsed = parseDateField(payload.endDate, null);
    if (endDateParsed.error) {
      return { code: "error", message: "Ngày kết thúc không hợp lệ!" };
    }
    const dateRangeError = ensureValidDateRange(departureDateParsed.value, endDateParsed.value);
    if (dateRangeError) {
      return { code: "error", message: dateRangeError };
    }
    payload.departureDate = departureDateParsed.value;
    payload.endDate = endDateParsed.value;
    payload.time = buildDurationLabel(payload.departureDate, payload.endDate);

    payload.avatar = anyReq.files?.avatar?.[0]?.path || "";
    payload.images = anyReq.files?.images?.length ? anyReq.files.images.map((item: any) => item.path) : [];
    payload.createdBy = reqWithAccount.account?.id;

    const slugBase = extractSlugBase(payload.slug || payload.name);
    payload.slug = await buildUniqueTourSlug(slugBase);

    const newRecord = new Tour(payload);
    await newRecord.save();

    return {
      code: "success",
      message: "Đã tạo tour!",
    };
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return { code: "error", message: "Slug tour đã tồn tại, vui lòng thử tên khác!" };
    }
    return { code: "error", message: "Tạo tour thất bại, vui lòng thử lại!" };
  }
};

export const trash = async (req: Request): Promise<{ tourList: any[] }> => {
  const find: any = { deleted: true };

  const tourList: any[] = await Tour.find(find).sort({ deletedAt: "desc" });

  for (const item of tourList) {
    if ((item as any).createdBy) {
      (item as any).createdByFullName = "Admin";
      (item as any).createdAtFormat = moment((item as any).createdAt).format("HH:mm - DD/MM/YYYY");
    }

    if ((item as any).deletedBy) {
      (item as any).deletedByFullName = "Admin";
      (item as any).deletedAtFormat = moment((item as any).deletedAt).format("HH:mm - DD/MM/YYYY");
    }
  }

  return { tourList };
};

export const edit = async (req: Request): Promise<{ categoryList: any[]; tourDetail: any; cityList: any[] } | { code: string; message: string }> => {
  try {
    const { id } = req.params as { id: string };

    const tourDetail: any = await Tour.findOne({ _id: id, deleted: false });

    if (!tourDetail) {
      return { code: "error", message: "Tour không tồn tại!" };
    }

    if (tourDetail.departureDate) {
      tourDetail.departureDateFormat = moment(tourDetail.departureDate).format("YYYY-MM-DD");
    }

    const categoryList = await Category.find({ deletedAt: { $exists: false } });
    const categoryTree = buildCategoryTree(categoryList as any[]);
    const cityList = await City.find({});
    return { categoryList: categoryTree, tourDetail, cityList };
  } catch (error) {
    return { code: "error", message: "Tour không tồn tại!" };
  }
};

export const editPatch = async (req: Request): Promise<{ code: string; message: string }> => {
  try {
    const { id } = req.params as { id: string };
    const anyReq = req as any;
    const reqWithAccount = req as AccountRequest;

    const tourDetail: any = await Tour.findOne({ _id: id, deleted: false });

    if (!tourDetail) {
      return {
        code: "error",
        message: "Tour không tồn tại!",
      };
    }

    const updatePayload: Record<string, any> = {};
    const incomingBody = (anyReq.body || {}) as Record<string, unknown>;

    for (const field of ["name", "category", "status", "position", "information"]) {
      if (incomingBody[field] !== undefined) {
        updatePayload[field] = incomingBody[field];
      }
    }

    if (incomingBody.price !== undefined || incomingBody.priceNew !== undefined || incomingBody.stock !== undefined || incomingBody.priceAdult !== undefined || incomingBody.priceNewAdult !== undefined || incomingBody.stockAdult !== undefined) {
      const pricingPayload = {
        price: incomingBody.price ?? tourDetail.price,
        priceNew: incomingBody.priceNew ?? tourDetail.priceNew,
        stock: incomingBody.stock ?? tourDetail.stock,
        priceAdult: incomingBody.priceAdult,
        priceNewAdult: incomingBody.priceNewAdult,
        stockAdult: incomingBody.stockAdult,
      };
      normalizeTourPricing(pricingPayload);
      updatePayload.price = pricingPayload.price;
      updatePayload.priceNew = pricingPayload.priceNew;
      updatePayload.stock = pricingPayload.stock;
    }

    if (incomingBody.locations !== undefined) {
      const locationsParsed = parseJsonArrayField(incomingBody.locations);
      if (locationsParsed.error) {
        return { code: "error", message: "Danh sách điểm đến không hợp lệ!" };
      }
      updatePayload.locations = locationsParsed.value;
    }

    if (incomingBody.schedules !== undefined) {
      const schedulesParsed = parseJsonArrayField(incomingBody.schedules);
      if (schedulesParsed.error) {
        return { code: "error", message: "Lịch trình tour không hợp lệ!" };
      }
      updatePayload.schedules = schedulesParsed.value;
    }

    const hasDepartureDate = Object.prototype.hasOwnProperty.call(incomingBody, "departureDate");
    const hasEndDate = Object.prototype.hasOwnProperty.call(incomingBody, "endDate");
    if (hasDepartureDate || hasEndDate) {
      const departureDateParsed = parseDateField(incomingBody.departureDate, tourDetail.departureDate || null);
      if (departureDateParsed.error) {
        return { code: "error", message: "Ngày khởi hành không hợp lệ!" };
      }
      const endDateParsed = parseDateField(incomingBody.endDate, tourDetail.endDate || null);
      if (endDateParsed.error) {
        return { code: "error", message: "Ngày kết thúc không hợp lệ!" };
      }
      const dateRangeError = ensureValidDateRange(departureDateParsed.value, endDateParsed.value);
      if (dateRangeError) {
        return { code: "error", message: dateRangeError };
      }

      updatePayload.departureDate = departureDateParsed.value;
      updatePayload.endDate = endDateParsed.value;
      updatePayload.time = buildDurationLabel(departureDateParsed.value, endDateParsed.value);
    }

    if (anyReq.files?.avatar?.[0]) {
      updatePayload.avatar = anyReq.files.avatar[0].path;
    }

    if (anyReq.files?.images?.length) {
      const uploadedImages = anyReq.files.images.map((item: any) => item.path);
      updatePayload.images = [...(tourDetail.images || []), ...uploadedImages];
    }

    const slugSource = incomingBody.slug ?? incomingBody.name;
    if (slugSource !== undefined) {
      const slugBase = extractSlugBase(slugSource);
      updatePayload.slug = await buildUniqueTourSlug(slugBase, id);
    }

    updatePayload.updatedBy = reqWithAccount.account?.id;

    await Tour.updateOne({ _id: id, deleted: false }, updatePayload);

    return {
      code: "success",
      message: "Đã cập nhật tour!",
    };
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return { code: "error", message: "Slug tour đã tồn tại, vui lòng thử tên khác!" };
    }
    return {
      code: "error",
      message: "Cập nhật tour thất bại!",
    };
  }
};

export const deletePatch = async (req: Request): Promise<{ code: string; message: string }> => {
  try {
    const { id } = req.params as { id: string };
    const reqWithAccount = req as AccountRequest;

    const tourDetail = await Tour.findOne({ _id: id, deleted: false });

    if (!tourDetail) {
      return {
        code: "error",
        message: "Tour không tồn tại!",
      };
    }

    await Tour.updateOne(
      { _id: id, deleted: false },
      {
        deleted: true,
        deletedBy: reqWithAccount.account?.id,
        deletedAt: Date.now(),
      },
    );

    return {
      code: "success",
      message: "Đã xóa tour!",
    };
  } catch (error) {
    return {
      code: "error",
      message: "Tour không tồn tại!",
    };
  }
};

export const undoPatch = async (req: Request): Promise<{ code: string; message: string }> => {
  try {
    const { id } = req.params as { id: string };

    const tourDetail = await Tour.findOne({ _id: id, deleted: true });

    if (!tourDetail) {
      return {
        code: "error",
        message: "Tour không tồn tại!",
      };
    }

    await Tour.updateOne(
      { _id: id, deleted: true },
      {
        deleted: false,
        deletedBy: "",
        deletedAt: null,
      },
    );

    return {
      code: "success",
      message: "Đã khôi phục tour!",
    };
  } catch (error) {
    return {
      code: "error",
      message: "Tour không tồn tại!",
    };
  }
};

export const destroyDel = async (req: Request): Promise<{ code: string; message: string }> => {
  try {
    const { id } = req.params as { id: string };

    const tourDetail = await Tour.findOne({ _id: id, deleted: true });

    if (!tourDetail) {
      return {
        code: "error",
        message: "Tour không tồn tại!",
      };
    }

    await Tour.deleteOne({ _id: id, deleted: true });

    return {
      code: "success",
      message: "Đã xóa vĩnh viễn tour!",
    };
  } catch (error) {
    return {
      code: "error",
      message: "Tour không tồn tại!",
    };
  }
};

export const changeMultiPatch = async (req: Request): Promise<{ code: string; message: string }> => {
  try {
    const { listId, option } = (req as any).body as { listId: string[]; option: string };
    const reqWithAccount = req as AccountRequest;

    switch (option) {
      case "active":
      case "inactive":
        await Tour.updateMany(
          { _id: { $in: listId }, deleted: false },
          {
            status: option,
            updatedBy: reqWithAccount.account?.id,
          },
        );
        return {
          code: "success",
          message: "Đã cập nhật trạng thái tour!",
        };
        break;

      case "delete":
        await Tour.updateMany(
          { _id: { $in: listId }, deleted: false },
          {
            deleted: true,
            deletedBy: reqWithAccount.account?.id,
            deletedAt: Date.now(),
          },
        );
        return {
          code: "success",
          message: "Đã chuyển tour vào thùng rác!",
        };
        break;

      case "undo":
        await Tour.updateMany(
          { _id: { $in: listId }, deleted: true },
          {
            deleted: false,
            deletedBy: "",
            deletedAt: null,
          },
        );
        return {
          code: "success",
          message: "Đã khôi phục các tour!",
        };
        break;

      case "destroy":
        await Tour.deleteMany({ _id: { $in: listId }, deleted: true });
        return {
          code: "success",
          message: "Đã xóa vĩnh viễn các tour!",
        };
        break;

      default:
        return {
          code: "error",
          message: "Dữ liệu không hợp lệ!",
        };
    }
  } catch (error) {
    return {
      code: "error",
      message: "Dữ liệu không hợp lệ!",
    };
  }
};
