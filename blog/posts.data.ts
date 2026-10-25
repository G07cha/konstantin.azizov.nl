import { createContentLoader } from "vitepress";

export interface Post {
  title: string;
  url: string;
  date: string;
}

declare const data: Post[];
export { data };

export default createContentLoader("blog/*.md", {
  transform(raw): Post[] {
    return raw
      .filter(({ url }) => url !== "/blog/")
      .map(({ url, frontmatter }) => ({
        title: frontmatter.title,
        url,
        // YAML parses dates into Date objects, keep just the YYYY-MM-DD part
        date: new Date(frontmatter.date).toISOString().slice(0, 10),
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  },
});
