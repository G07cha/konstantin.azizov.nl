---
title: Blog
layout: doc
prev: false
next: false
---

<script setup>
import { VPFeatures } from "vitepress/theme";
import { data as posts } from "./posts.data";
import { formatDate } from "../src/utils";

const features = posts.map((post) => ({
  title: post.title,
  details: formatDate(post.date),
  link: post.url,
}));
</script>

# Blog

<div class="posts vp-raw">
  <VPFeatures :features="features" />
</div>

<style scoped>
.posts {
  margin-top: 32px;
}

/* VPFeatures is meant for the full-width home layout */
.posts :deep(.VPFeatures) {
  padding: 0;
}
</style>
