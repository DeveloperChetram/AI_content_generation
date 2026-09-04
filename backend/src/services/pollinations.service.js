require('dotenv').config();
const axios = require('axios');
const { uploadImageFromUrl } = require('./imagekit.service');

const ASPECT_RATIO_DIMENSIONS = {
    '1:1': { width: 1024, height: 1024 },
    '16:9': { width: 1920, height: 1080 },
    '9:16': { width: 1080, height: 1920 },
    '4:3': { width: 1440, height: 1080 },
    '3:4': { width: 1080, height: 1440 }
};

/**
 * Builds the Pollinations image generation URL with all query parameters
 * @param {string} prompt - Prompt for the image
 * @param {object} options - Options for image generation
 * @returns {string} Fully qualified image URL
 */
/**
 * Builds the Pollinations image generation URL with all query parameters
 * @param {string} prompt - Prompt for the image
 * @param {object} options - Options for image generation
 * @returns {string} Fully qualified image URL
 */
const  POLLINATIONS_DEFAULT_MODEL  = null;
const POLLINATIONS_USE_FREE = true;

function getPollinationsImageUrl(prompt, options = {}) {
    const {
        model = POLLINATIONS_DEFAULT_MODEL || 'flux',
        aspectRatio = '16:9',
        width: customWidth,
        height: customHeight,
        seed = Math.floor(Math.random() * 1000000),
        nologo = true,
        enhance = true,
        safe = false,
        isFree = (POLLINATIONS_USE_FREE || 'true')
    } = options;

    const dimensions = ASPECT_RATIO_DIMENSIONS[aspectRatio] || ASPECT_RATIO_DIMENSIONS['16:9'];
    const width = customWidth || dimensions.width;
    const height = customHeight || dimensions.height;

    const encodedPrompt = encodeURIComponent(prompt.trim());
    const params = new URLSearchParams({
        model,
        width: width.toString(),
        height: height.toString(),
        seed: seed.toString(),
        nologo: nologo ? 'true' : 'false'
    });

    if (enhance) {
        params.append('enhance', 'true');
    }

    if (safe) {
        params.append('safe', typeof safe === 'string' ? safe : 'privacy');
    }

    const apiKey = process.env.POLLINATIONS_API_KEY;
    // If an API key is available and free mode is not forced, use authenticated route
    if (apiKey && !isFree) {
        params.append('key', apiKey);
        return `https://gen.pollinations.ai/image/${encodedPrompt}?${params.toString()}`;
    }

    // 100% Free public gateway
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?${params.toString()}`;
}

/**
 * Generates an image using Pollinations AI and optionally uploads it to ImageKit
 * @param {string} prompt - The text prompt for generating image
 * @param {object} options - Generation options (aspectRatio, model, isFree, uploadToImageKit, etc.)
 * @returns {Promise<{success: boolean, image_url: string, direct_url: string, prompt: string, model: string}>}
 */
async function generatePollinationsImage(prompt, options = {}) {
    try {
        if (!prompt || !prompt.trim()) {
            throw new Error('Prompt is required for image generation');
        }

        const model = options.model || process.env.POLLINATIONS_DEFAULT_MODEL || 'flux';
        const aspectRatio = options.aspectRatio || '16:9';
        const uploadToImageKit = options.uploadToImageKit !== undefined ? options.uploadToImageKit : true;

        let imageUrl = getPollinationsImageUrl(prompt, {
            model,
            aspectRatio,
            ...options
        });

        console.log(`[Pollinations] Generating image URL with model "${model}", aspect ratio "${aspectRatio}"`);
        console.log(`[Pollinations] Initial URL: ${imageUrl}`);

        let finalUrl = imageUrl;

        // Optionally upload to ImageKit for permanent, optimized CDN hosting
        if (uploadToImageKit && process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY) {
            try {
                const uploadResult = await uploadImageFromUrl(imageUrl);
                if (uploadResult && uploadResult.url) {
                    finalUrl = uploadResult.url;
                    console.log(`[Pollinations] Uploaded to ImageKit: ${finalUrl}`);
                }
            } catch (uploadError) {
                console.warn('[Pollinations] ImageKit upload error:', uploadError.message);
                
                // If it failed because of 401/402 on the authenticated URL, retry with free public URL
                if (imageUrl.includes('gen.pollinations.ai')) {
                    console.log('[Pollinations] Authenticated key failed or out of pollen. Switching to Free Public Gateway...');
                    const freeUrl = getPollinationsImageUrl(prompt, {
                        ...options,
                        model,
                        aspectRatio,
                        isFree: true
                    });
                    
                    try {
                        const retryUpload = await uploadImageFromUrl(freeUrl);
                        if (retryUpload && retryUpload.url) {
                            finalUrl = retryUpload.url;
                            imageUrl = freeUrl;
                            console.log(`[Pollinations] Successfully uploaded from Free Gateway to ImageKit: ${finalUrl}`);
                        }
                    } catch (freeUploadError) {
                        console.warn('[Pollinations] Free gateway upload to ImageKit failed, using free direct URL:', freeUploadError.message);
                        finalUrl = freeUrl;
                        imageUrl = freeUrl;
                    }
                } else {
                    finalUrl = imageUrl;
                }
            }
        }

        return {
            success: true,
            image_url: finalUrl,
            direct_url: imageUrl,
            prompt,
            model,
            aspectRatio
        };
    } catch (error) {
        console.error('[Pollinations] Error generating image:', error);
        return {
            success: false,
            error: error.message || 'Image generation failed'
        };
    }
}

module.exports = {
    generatePollinationsImage,
    getPollinationsImageUrl
};
