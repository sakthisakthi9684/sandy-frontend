export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80';

export const resolveImageUrl = (imageUrl, fallback = DEFAULT_PRODUCT_IMAGE) => {
  if (typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    return fallback;
  }

  const url = imageUrl.trim();
  if (/^https?:\/\//i.test(url) || /^data:/i.test(url) || /^blob:/i.test(url)) {
    return url;
  }

  if (url.startsWith('/uploads/')) {
    const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000')
      .replace(/\/api\/?$/, '')
      .replace(/\/$/, '');
    return apiBaseUrl ? `${apiBaseUrl}${url}` : url;
  }

  return url;
};

