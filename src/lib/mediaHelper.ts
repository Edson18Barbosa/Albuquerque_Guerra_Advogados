// Helper to dynamically retrieve focal point and zoom styling for any image
export interface ImageStyle {
  objectPosition?: string;
  transform?: string;
  transition?: string;
}

export const getImageStyle = (urlOrPath: string): ImageStyle => {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem('albuquerque_guerra_media_library');
    if (stored) {
      const items = JSON.parse(stored);
      const cleanPath = urlOrPath.split('?')[0].toLowerCase();
      
      // Look for a matching media item by public_url or file_name
      const match = items.find((item: any) => {
        const itemUrl = item.public_url.split('?')[0].toLowerCase();
        const itemFileName = item.file_name.toLowerCase();
        
        return itemUrl === cleanPath || 
               itemUrl.includes(cleanPath) || 
               cleanPath.includes(itemUrl) ||
               itemFileName === cleanPath.split('/').pop();
      });
      
      if (match) {
        return {
          objectPosition: `${match.focal_x ?? 50}% ${match.focal_y ?? 50}%`,
          transform: `scale(${match.zoom ?? 1.0})`,
          transition: 'transform 0.3s ease, object-position 0.3s ease'
        };
      }
    }
  } catch (e) {
    console.error('Error getting image style from storage:', e);
  }
  return {};
};

export interface AssignedImage {
  url: string;
  style: ImageStyle;
}

// Retrieves the URL and styling of an image assigned to a specific website section
export const getAssignedImage = (sectionKey: string, defaultPath: string): AssignedImage => {
  if (typeof window === 'undefined') return { url: defaultPath, style: {} };
  try {
    const stored = localStorage.getItem('albuquerque_guerra_media_library');
    if (stored) {
      const items = JSON.parse(stored);
      const match = items.find((item: any) => item.assigned_section === sectionKey);
      if (match) {
        return {
          url: match.public_url,
          style: {
            objectPosition: `${match.focal_x ?? 50}% ${match.focal_y ?? 50}%`,
            transform: `scale(${match.zoom ?? 1.0})`,
            transition: 'transform 0.3s ease, object-position 0.3s ease'
          }
        };
      }
    }
  } catch (e) {
    console.error('Error getting assigned image:', e);
  }
  return { url: defaultPath, style: getImageStyle(defaultPath) };
};
