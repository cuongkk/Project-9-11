import type { Request } from "express";
import Journal from "./journal.model";

const normalizeStatus = (value: unknown): "active" | "inactive" => {
  return String(value || "active") === "inactive" ? "inactive" : "active";
};

const normalizeTrendingScore = (value: unknown): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return parsed;
};

export const list = async (_req: Request): Promise<{ journalList: any[] }> => {
  const journalList = await Journal.find({}).sort({ createdAt: -1 });
  return { journalList };
};

export const createPost = async (req: Request): Promise<{ code: "success" | "error"; message: string }> => {
  const anyReq = req as any;

  const payload = {
    title: String(anyReq.body?.title || "").trim(),
    summary: String(anyReq.body?.summary || "").trim(),
    tag: String(anyReq.body?.tag || "").trim(),
    author: String(anyReq.body?.author || "").trim(),
    dateLabel: String(anyReq.body?.dateLabel || "").trim(),
    image: String(anyReq.body?.image || "").trim(),
    avatar: String(anyReq.body?.avatar || "").trim(),
    trendingScore: normalizeTrendingScore(anyReq.body?.trendingScore),
    status: normalizeStatus(anyReq.body?.status),
  };

  if (!payload.title || !payload.summary || !payload.tag || !payload.author || !payload.dateLabel || !payload.image || !payload.avatar) {
    return {
      code: "error",
      message: "Thiếu thông tin bắt buộc của journal!",
    };
  }

  const record = new Journal(payload);
  await record.save();

  return {
    code: "success",
    message: "Tạo journal thành công!",
  };
};

export const edit = async (req: Request): Promise<{ journalDetail: any } | { code: "success" | "error"; message: string }> => {
  const { id } = req.params as { id: string };
  const journalDetail = await Journal.findById(id);

  if (!journalDetail) {
    return {
      code: "error",
      message: "Journal không tồn tại!",
    };
  }

  return { journalDetail };
};

export const editPatch = async (req: Request): Promise<{ code: "success" | "error"; message: string }> => {
  const { id } = req.params as { id: string };
  const anyReq = req as any;

  const journalDetail = await Journal.findById(id);
  if (!journalDetail) {
    return {
      code: "error",
      message: "Journal không tồn tại!",
    };
  }

  const payload = {
    title: String(anyReq.body?.title || "").trim(),
    summary: String(anyReq.body?.summary || "").trim(),
    tag: String(anyReq.body?.tag || "").trim(),
    author: String(anyReq.body?.author || "").trim(),
    dateLabel: String(anyReq.body?.dateLabel || "").trim(),
    image: String(anyReq.body?.image || "").trim(),
    avatar: String(anyReq.body?.avatar || "").trim(),
    trendingScore: normalizeTrendingScore(anyReq.body?.trendingScore),
    status: normalizeStatus(anyReq.body?.status),
  };

  if (!payload.title || !payload.summary || !payload.tag || !payload.author || !payload.dateLabel || !payload.image || !payload.avatar) {
    return {
      code: "error",
      message: "Thiếu thông tin bắt buộc của journal!",
    };
  }

  await Journal.updateOne({ _id: id }, payload);

  return {
    code: "success",
    message: "Cập nhật journal thành công!",
  };
};
