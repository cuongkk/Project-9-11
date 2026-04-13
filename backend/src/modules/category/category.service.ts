import type { Request } from "express";
import slugify from "slugify";
import Category from "./category.model";
import { buildCategoryTree } from "./category.helper";
import { pagination } from "../../utils/pagination.helper";

const activeFilter = { deletedAt: { $exists: false } };

const parsePosition = (value: unknown): number | null => {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number.parseFloat(String(value));
  return Number.isNaN(parsed) ? null : parsed;
};

const roundPosition = (value: number): number => Math.round(value * 100) / 100;

const getRootFilter = () => ({
  ...activeFilter,
  $or: [{ parent: { $exists: false } }, { parent: "" }, { parent: null }],
});

const getNextPosition = async (parentId?: string): Promise<number> => {
  if (parentId) {
    const parent = await Category.findOne({ _id: parentId, ...activeFilter }).select("position");
    const parentPosition = Number((parent as any)?.position || 0);

    const sibling = await Category.findOne({ parent: parentId, ...activeFilter })
      .sort({ position: "desc" })
      .select("position");
    if (sibling) {
      return roundPosition(Number((sibling as any).position || 0) + 0.1);
    }

    if (parentPosition > 0) {
      return roundPosition(parentPosition + 0.1);
    }

    return 1;
  }

  const lastRoot = await Category.findOne(getRootFilter()).sort({ position: "desc" }).select("position");
  if (!lastRoot) return 1;

  const maxRoot = Number((lastRoot as any).position || 0);
  return roundPosition(Math.floor(maxRoot) + 1);
};

const reindexPositionsByParent = async (parentId?: string | null): Promise<void> => {
  if (parentId) {
    const parent = await Category.findOne({ _id: parentId, ...activeFilter }).select("position");
    const parentBase = Number((parent as any)?.position || 0);
    const siblings = await Category.find({ parent: parentId, ...activeFilter }).sort({ position: "asc", _id: "asc" });

    for (let i = 0; i < siblings.length; i += 1) {
      const nextPosition = roundPosition(parentBase + (i + 1) * 0.1);
      const currentPosition = Number((siblings[i] as any).position || 0);
      if (currentPosition !== nextPosition) {
        await Category.updateOne({ _id: (siblings[i] as any)._id }, { position: nextPosition });
      }
    }
    return;
  }

  const roots = await Category.find(getRootFilter()).sort({ position: "asc", _id: "asc" });

  for (let i = 0; i < roots.length; i += 1) {
    const nextPosition = i + 1;
    const currentPosition = Number((roots[i] as any).position || 0);
    if (currentPosition !== nextPosition) {
      await Category.updateOne({ _id: (roots[i] as any)._id }, { position: nextPosition });
    }
  }
};

export const list = async (req: Request): Promise<{ categoryList: any[]; pagination: any }> => {
  const find: any = { ...activeFilter };
  const anyReq = req as any;

  if (anyReq.query?.status) {
    find.status = anyReq.query.status;
  }

  if (anyReq.query?.keyword) {
    let regex: string = (anyReq.query.keyword as string).trim();
    regex = regex.replace(/\s\s+/g, " ");
    regex = slugify(regex);
    const re = new RegExp(regex, "i");
    find.slug = re;
  }

  const pageInfo = await pagination(Category, find, anyReq);

  const categoryList: any[] = await Category.find(find).sort({ position: "asc" }).limit(pageInfo.limitItems).skip(pageInfo.skip);

  return { categoryList, pagination: pageInfo };
};

export const create = async (req: Request): Promise<{ categoryList: any[] }> => {
  const categoryList = await Category.find(activeFilter).sort({ position: "asc" });
  const categoryTree = buildCategoryTree(categoryList as any[]);
  return { categoryList: categoryTree };
};

export const createPost = async (req: Request): Promise<{ code: "success" | "error"; message: string }> => {
  const anyReq = req as any;
  const payload: any = {
    name: String(anyReq.body?.name || "").trim(),
    parent: String(anyReq.body?.parent || "").trim(),
    status: String(anyReq.body?.status || "active").trim(),
    description: String(anyReq.body?.description || "").trim(),
  };

  if (!payload.parent) {
    delete payload.parent;
  }

  const inputPosition = parsePosition(anyReq.body?.position);
  payload.position = inputPosition ?? (await getNextPosition(payload.parent || undefined));

  const newRecord = new Category(payload);
  await newRecord.save();

  return {
    code: "success",
    message: "Tạo danh mục thành công",
  };
};

export const edit = async (req: Request): Promise<{ categoryList: any[]; categoryDetail: any } | { code: "success" | "error"; message: string }> => {
  try {
    const { id } = req.params as { id: string };

    const categoryDetail = await Category.findOne({ _id: id, ...activeFilter });

    if (!categoryDetail) {
      return {
        code: "error",
        message: "Danh mục không tồn tại!",
      };
    }

    const categoryList = await Category.find(activeFilter).sort({ position: "asc" });
    const categoryTree = buildCategoryTree(categoryList as any[]);
    return { categoryList: categoryTree, categoryDetail };
  } catch (error) {
    return {
      code: "error",
      message: "Danh mục không tồn tại!",
    };
  }
};

export const editPatch = async (req: Request): Promise<{ code: "success" | "error"; message: string }> => {
  try {
    const { id } = req.params as { id: string };
    const anyReq = req as any;

    const categoryDetail = await Category.findOne({ _id: id, ...activeFilter });

    if (!categoryDetail) {
      return {
        code: "error",
        message: "Danh mục không tồn tại!",
      };
    }

    const payload: any = {
      name: String(anyReq.body?.name || "").trim(),
      parent: String(anyReq.body?.parent || "").trim(),
      status: String(anyReq.body?.status || "active").trim(),
      description: String(anyReq.body?.description || "").trim(),
    };

    if (payload.parent === id) {
      return {
        code: "error",
        message: "Danh mục cha không được trùng với chính nó!",
      };
    }

    if (!payload.parent) {
      delete payload.parent;
    }

    const inputPosition = parsePosition(anyReq.body?.position);
    payload.position = inputPosition ?? (await getNextPosition(payload.parent || undefined));

    const result = await Category.updateOne({ _id: id, ...activeFilter }, payload);

    if (!result.matchedCount) {
      return {
        code: "error",

        message: "Danh mục không tồn tại!",
      };
    }

    return {
      code: "success",
      message: "Đã cập nhật danh mục!",
    };
  } catch (error) {
    return {
      code: "error",
      message: "Cập nhật danh mục thất bại!",
    };
  }
};

export const deletePatch = async (req: Request): Promise<{ code: "success" | "error"; message: string }> => {
  const DELETE_CODE = (process.env.DELETE_CODE || "").trim();

  try {
    const { id } = req.params as { id: string };
    const { deleteCode } = (req as any).body as { deleteCode?: string };

    if (!DELETE_CODE) {
      return {
        code: "error",
        message: "Thiếu cấu hình DELETE_CODE trên server",
      };
    }

    if ((deleteCode || "").trim() !== DELETE_CODE) {
      return {
        code: "error",
        message: "Mã xác nhận không đúng!",
      };
    }

    const categoryDetail = await Category.findOne({ _id: id, ...activeFilter });

    if (!categoryDetail) {
      return {
        code: "error",
        message: "Danh mục không tồn tại!",
      };
    }

    const parentId = (categoryDetail as any).parent ? String((categoryDetail as any).parent) : "";

    await Category.updateOne(
      { _id: id, ...activeFilter },
      {
        deletedAt: new Date(),
      },
    );

    await reindexPositionsByParent(parentId || null);

    return {
      code: "success",
      message: "Đã xóa danh mục!",
    };
  } catch (error) {
    return {
      code: "error",
      message: "Xóa danh mục thất bại!",
    };
  }
};

export const changeMultiPatch = async (req: Request): Promise<{ code: "success" | "error"; message: string }> => {
  try {
    const { listId, option } = (req as any).body as { listId: string[]; option: string };

    if (!Array.isArray(listId) || listId.length === 0 || !option) {
      return {
        code: "error",
        message: "Dữ liệu không hợp lệ!",
      };
    }

    switch (option) {
      case "active":
      case "inactive":
        await Category.updateMany({ _id: { $in: listId }, ...activeFilter }, { status: option });
        return {
          code: "success",
          message: "Đã cập nhật trạng thái danh mục!",
        };

      case "delete":
        const toDelete = await Category.find({ _id: { $in: listId }, ...activeFilter }).select("parent");

        await Category.updateMany(
          { _id: { $in: listId }, ...activeFilter },
          {
            deletedAt: new Date(),
          },
        );

        const parentSet = new Set<string>();
        for (const item of toDelete as any[]) {
          parentSet.add(item.parent ? String(item.parent) : "");
        }

        for (const parentId of parentSet) {
          await reindexPositionsByParent(parentId || null);
        }

        return {
          code: "success",
          message: "Đã xóa danh mục!",
        };

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
