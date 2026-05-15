// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const mathRemark = [remarkMath];
const mathRehype = [rehypeKatex];

// https://astro.build/config
export default defineConfig({
	site: 'https://hooktech.github.io',
	trailingSlash: 'always',
	markdown: {
		remarkPlugins: mathRemark,
		rehypePlugins: mathRehype,
	},
	integrations: [
		mdx({
			remarkPlugins: mathRemark,
			rehypePlugins: mathRehype,
		}),
		sitemap(),
	],
});
