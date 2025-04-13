import supabase from './supabase.js'; // Import the Supabase client

export function uploadFile(fileBuffer, filePath, contentType) {
    return supabase.storage
        .from('attachments')
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
            console.log('Upload attempt completed');
        });
}

export function downloadFile(filePath) {
    return supabase.storage
        .from('attachments')
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