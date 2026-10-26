import { supabase } from '@/lib/supabase';

export type AnalyticsItemType = 'store' | 'instructions' | 'custom_parts';

const VISITOR_ID_KEY = 'visitor_id';

const getVisitorId = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }
    return visitorId;
  } catch {
    return null;
  }
};

export const getAnalyticsItemType = (section?: string | null): AnalyticsItemType | null => {
  const normalized = (section || '').trim().toLowerCase();
  if (normalized === 'kits' || normalized === 'kit') return 'store';
  if (normalized === 'instructions' || normalized === 'instruction') return 'instructions';
  if (normalized === 'custom_parts' || normalized === 'custom-parts' || normalized === 'custom parts') return 'custom_parts';
  return null;
};

export const recordItemClick = async ({ itemId, itemName, itemSlug, section }: {
  itemId: string;
  itemName: string;
  itemSlug: string;
  section?: string | null;
}) => {
  const itemType = getAnalyticsItemType(section);
  if (!itemType) return;
  const visitorId = getVisitorId();
  try {
    await supabase.from('item_clicks').insert({
      item_id: itemId,
      item_type: itemType,
      item_name: itemName,
      item_slug: itemSlug,
      visitor_id: visitorId,
      path: typeof window !== 'undefined' ? window.location.pathname : null,
    });
  } catch {
    // Analytics must never block navigation or page rendering.
  }
};
