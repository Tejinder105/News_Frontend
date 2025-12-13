/**
 * Optimizes Cloudinary (and potentially other) image URLs
 * by injecting transformation parameters.
 * 
 * @param {string} url - The original image URL
 * @param {Object} options - Transformation options
 * @param {number} [options.width] - Desired width
 * @param {number} [options.height] - Desired height
 * @param {string} [options.crop='limit'] - Crop mode (limit, fill, scale, etc.)
 * @param {number} [options.quality='auto'] - Quality setting
 * @returns {string} The optimized URL
 */
export const getOptimizedImageUrl = (url, { width, height, crop = 'limit', quality = 'auto' } = {}) => {
    if (!url) return '';
    if (typeof url !== 'string') return url;

    // Check if it's a Cloudinary URL
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
        const parts = url.split('/upload/');
        const baseUrl = parts[0];
        const fileName = parts[1];

        const transformations = ['f_auto']; // Always use auto format (WebP/AVIF)

        if (quality) {
            transformations.push(`q_${quality}`);
        }

        if (width) {
            transformations.push(`w_${width}`);
        }

        if (height) {
            transformations.push(`h_${height}`);
        }

        if (width || height) {
            transformations.push(`c_${crop}`);
        }

        // Enforce HTTPS
        const secureBaseUrl = baseUrl.replace('http:', 'https:');
        return `${secureBaseUrl}/upload/${transformations.join(',')}/${fileName}`;
    }

    return url;
};
