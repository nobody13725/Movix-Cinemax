export const FALLBACK_POSTER = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80";
export const FALLBACK_BACKDROP = "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80";
export const FALLBACK_CINEMA = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=300&q=80";
export const FALLBACK_COMBO = "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=400&q=80";
export const FALLBACK_BANNER = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80";

export function handleImageError(e, fallback = FALLBACK_POSTER) {
  if (e && e.currentTarget) {
    e.currentTarget.onerror = null;
    e.currentTarget.src = fallback;
  }
}
