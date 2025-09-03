// Frontend input validation utilities

// Sanitize string input
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 100); // Limit length
};

// Validate city name
export const validateCityName = (city) => {
  const errors = [];
  
  if (!city || typeof city !== 'string') {
    errors.push('Stadsnamn krävs');
    return { isValid: false, errors, sanitized: '' };
  }
  
  const sanitized = sanitizeString(city);
  
  if (sanitized.length === 0) {
    errors.push('Stadsnamn får inte vara tomt');
  }
  
  if (sanitized.length > 50) {
    errors.push('Stadsnamn får inte vara längre än 50 tecken');
  }
  
  if (!/^[a-zA-ZåäöÅÄÖ\s\-']+$/.test(sanitized)) {
    errors.push('Stadsnamn får endast innehålla bokstäver, mellanslag, bindestreck och apostrofer');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  };
};

// Validate coordinates
export const validateCoordinates = (lat, lon) => {
  const errors = [];
  
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  
  if (isNaN(latitude)) {
    errors.push('Ogiltig latitud');
  } else if (latitude < -90 || latitude > 90) {
    errors.push('Latitud måste vara mellan -90 och 90');
  }
  
  if (isNaN(longitude)) {
    errors.push('Ogiltig longitud');
  } else if (longitude < -180 || longitude > 180) {
    errors.push('Longitud måste vara mellan -180 och 180');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    coordinates: { lat: latitude, lon: longitude }
  };
};

// Escape HTML to prevent XSS
export const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

// Validate and sanitize search input
export const validateSearchInput = (input) => {
  const sanitized = sanitizeString(input);
  const validation = validateCityName(sanitized);
  
  return {
    ...validation,
    original: input
  };
};

// Rate limiting for frontend (basic implementation)
class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }
  
  isAllowed(key) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // Clean old entries
    for (const [timestamp] of this.requests) {
      if (timestamp < windowStart) {
        this.requests.delete(timestamp);
      }
    }
    
    // Count requests in current window
    const currentRequests = Array.from(this.requests.values())
      .filter(timestamp => timestamp > windowStart).length;
    
    if (currentRequests >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    this.requests.set(now, now);
    return true;
  }
}

// Create rate limiter instance
export const searchRateLimiter = new RateLimiter(5, 60000); // 5 requests per minute

// Security headers for API requests
export const getSecureHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  };
};

// Validate API response
export const validateApiResponse = (response) => {
  if (!response || typeof response !== 'object') {
    throw new Error('Ogiltigt API-svar');
  }
  
  // Check for error responses
  if (response.error) {
    throw new Error(response.error);
  }
  
  return response;
};
