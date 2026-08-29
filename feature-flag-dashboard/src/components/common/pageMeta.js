// Shared route -> label mapping used by every role shell so the page
// title/breadcrumb/tab logic only lives in one place.
export const PAGE_META = {
  "/": { title: "Dashboard", short: "home" },
  "/features": { title: "Feature Flags", short: "flags" },
  "/users": { title: "Users Management", short: "users" },
  "/audit": { title: "Audit Logs", short: "audit" },
  "/environments": { title: "Environments", short: "env" },
  "/settings": { title: "Settings", short: "settings" },
};

export function getPageTitle(pathname) {
  return PAGE_META[pathname]?.title || "FF Console";
}
