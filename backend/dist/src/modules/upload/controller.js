"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
/**
 * Thin HTTP layer for future dedicated upload APIs (direct browser → server → Cloudinary).
 * Not mounted by the legacy Pug app; domain routes still attach multer inline.
 */
exports.UploadController = {
    /**
     * Optional health-style handler (e.g. mount behind admin only when needed).
     */
    ready: ((_req, res) => {
        res.sendStatus(204);
    }),
};
