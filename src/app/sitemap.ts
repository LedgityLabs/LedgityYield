import { MetadataRoute } from "next";

const fqdn = "https://ledgity.finance";
const pages = [
  "/",
  "/legal/privacy-policy",
  "/legal/terms-and-conditions",
  "/app/invest",
  "/app/lockdrop",
  "/app/multi-lockdrop",
  "/app/dashboard",
  "/app/get-usdc",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((page) => ({
    url: `${fqdn}${page}`,
    lastModified: new Date(),
  }));
}
