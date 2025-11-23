export function normalizeUrl(url: string): string {
  // Trim whitespace
  url = url.trim();

  // If URL doesn't start with http:// or https://, add https://
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  return url;
}

export function isValidUrl(url: string): boolean {
  try {
    // Normalize URL first (add https:// if missing)
    const normalizedUrl = normalizeUrl(url);
    const urlObj = new URL(normalizedUrl);

    // Check if it's http or https protocol
    if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
      return false;
    }

    // Validate that there's a valid hostname
    if (!urlObj.hostname || urlObj.hostname.length === 0) {
      return false;
    }

    // Basic validation for hostname format (should have at least one dot for domain)
    // Allow localhost and IP addresses as well
    const isLocalhost =
      urlObj.hostname === "localhost" || urlObj.hostname === "127.0.0.1";
    const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(urlObj.hostname);
    const hasDomain = urlObj.hostname.includes(".");

    return isLocalhost || isIP || hasDomain;
  } catch {
    return false;
  }
}

export function isValidCustomCode(code: string): boolean {
  // Must be 6-8 alphanumeric characters
  const regex = /^[A-Za-z0-9]{6,8}$/;
  return regex.test(code);
}

export function validateLinkInput(
  url: string,
  customCode: string
): { valid: boolean; error?: string } {
  if (!url || !url.trim()) {
    return { valid: false, error: "URL is required" };
  }

  if (!isValidUrl(url)) {
    return {
      valid: false,
      error:
        "Invalid URL format. Please enter a valid URL (e.g., example.com or https://example.com)",
    };
  }

  if (!customCode || !customCode.trim()) {
    return { valid: false, error: "Custom code is required" };
  }

  if (!isValidCustomCode(customCode)) {
    return {
      valid: false,
      error: "Custom code must be 6-8 alphanumeric characters",
    };
  }

  return { valid: true };
}
