import supabase from './supabase.js';
import { getBucket } from "./bucketConfig.js";

export function uploadFile(fileBuffer, filePath, contentType) {
    const bucket = getBucket();
    return supabase.storage
        .from(bucket)
        .upload(filePath, fileBuffer, {
            contentType,
            upsert: true,
        })
        .then(({ data, error }) => {
            if (error) {
                throw error;
            }
            return data;
        })
        .catch((error) => {
            console.error('Error uploading file:', error.message);
            throw new Error(error.message);
        })
        .finally(() => {
            console.log(`Upload attempt to "${bucket}" bucket completed`);
        });
}

export function deleteFile(filePath) {
    const bucket = getBucket();
    return supabase.storage
        .from(bucket)
        .remove([filePath])
        .then(({ data, error }) => {
            if (error) {
                throw error;
            }
            console.log(`File "${filePath}" deleted from "${bucket}"`);
            return data;
        })
        .catch((error) => {
            console.error('Error deleting file:', error.message);
            throw new Error(error.message);
        });
}
