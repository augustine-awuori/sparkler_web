import { getAnalytics, logEvent as logAppEvent } from "firebase/analytics";

import { app } from "./config";

export const events = {
  general: {
    APP_OPEN: "app_open",
    SESSION_START: "session_start",
    SCREEN_VIEW: "screen_view",
    USER_ENGAGEMENT: "user_engagement",
    FIREBASE_CAMPAIGN: "firebase_campaign",
    PAGE_VIEW: "page_view",
  },
  userInteraction: {
    LOGIN: "login",
    SIGN_UP: "sign_up",
    SHARE: "share",
    SEARCH: "search",
    SELECT_CONTENT: "select_content",
    VIEW_SEARCH_RESULTS: "view_search_results",
    SPARKLE: "sparkle",
  },
  ads: {
    AD_IMPRESSION: "ad_impression",
    AD_CLICK: "ad_click",
    EARN_VIRTUAL_CURRENCY: "earn_virtual_currency",
    SPEND_VIRTUAL_CURRENCY: "spend_virtual_currency",
    PRESENT_OFFER: "present_offer",
  },
  engagement: {
    LEVEL_UP: "level_up",
    UNLOCK_ACHIEVEMENT: "unlock_achievement",
    TUTORIAL_BEGIN: "tutorial_begin",
    TUTORIAL_COMPLETE: "tutorial_complete",
  },
  location: {
    LOCATION_UPDATE: "location_update",
    VIEW_PROMOTION: "view_promotion",
    SELECT_PROMOTION: "select_promotion",
  },
  media: {
    PLAY: "play",
    PAUSE: "pause",
    WATCH_VIDEO: "watch_video",
    JOIN_GROUP: "join_group",
  },
};

export function logEvent(event: string, eventParams?: object) {
  logAppEvent(getAnalytics(app), event, eventParams);
}
