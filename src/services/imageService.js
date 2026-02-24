import { storage } from './firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Uploads a local image file to Firebase Storage
 * @param {string} uri - The local URI of the image
 * @param {string} path - The storage path (e.g., 'pets/buddy.jpg')
 * @returns {Promise<string>} - The download URL of the uploaded image
 */
export const uploadImage = async (uri, path) => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(storage, path);

        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);

        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};
