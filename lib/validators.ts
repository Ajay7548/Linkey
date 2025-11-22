export function isValidUrl(url: string): boolean {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
}

export function isValidCustomCode(code: string): boolean {
    // Must be 6-8 alphanumeric characters
    const regex = /^[A-Za-z0-9]{6,8}$/;
    return regex.test(code);
}

export function validateLinkInput(url: string, customCode: string): { valid: boolean; error?: string } {
    if (!url || !url.trim()) {
        return { valid: false, error: 'URL is required' };
    }

    if (!isValidUrl(url)) {
        return { valid: false, error: 'Invalid URL format. Must start with http:// or https://' };
    }

    if (!customCode || !customCode.trim()) {
        return { valid: false, error: 'Custom code is required' };
    }

    if (!isValidCustomCode(customCode)) {
        return { valid: false, error: 'Custom code must be 6-8 alphanumeric characters' };
    }

    return { valid: true };
}
