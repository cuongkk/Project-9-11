"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMulterStorage = getMulterStorage;
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const validate_1 = require("./validate");
let cloudinaryConfigured = false;
let multerStorage = null;
function configureCloudinary() {
    if (cloudinaryConfigured) {
        return;
    }
    const creds = (0, validate_1.parseCloudinaryEnv)();
    cloudinary_1.v2.config({
        cloud_name: creds.cloudName,
        api_key: creds.apiKey,
        api_secret: creds.apiSecret,
    });
    cloudinaryConfigured = true;
}
/**
 * Lazily configures Cloudinary from env and returns a shared `multer-storage-cloudinary` engine.
 * Matches previous `helpers/cloudinary.helper.js` behavior (single storage instance per process).
 */
function getMulterStorage() {
    if (!multerStorage) {
        configureCloudinary();
        multerStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
            cloudinary: cloudinary_1.v2,
            params: {},
        });
    }
    return multerStorage;
}
