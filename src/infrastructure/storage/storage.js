import supabase from './supabase.js';
import BUCKETS from "./bucketConfig.js"; // Import the Supabase client

export function uploadFile(fileBuffer, filePath, contentType, bucket = BUCKETS.DEV) {
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

export function downloadFile(filePath, bucket = BUCKETS.DEV) {
    return supabase.storage
        .from(bucket)
        .download(filePath)
        .then(({ data, error }) => {
            if (error) {
                throw error;
            }
            return data;
        })
        .catch((error) => {
            console.error('Error downloading file:', error.message);
            throw new Error(error.message);
        })
        .finally(() => {
            console.log('Download attempt completed');
        });
}