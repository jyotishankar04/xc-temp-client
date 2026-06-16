// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"api.mdx": () => import("../content/docs/api.mdx?collection=docs"), "concepts.mdx": () => import("../content/docs/concepts.mdx?collection=docs"), "dashboard.mdx": () => import("../content/docs/dashboard.mdx?collection=docs"), "getting-started.mdx": () => import("../content/docs/getting-started.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "troubleshooting.mdx": () => import("../content/docs/troubleshooting.mdx?collection=docs"), "sdk/index.mdx": () => import("../content/docs/sdk/index.mdx?collection=docs"), "sdk/installation.mdx": () => import("../content/docs/sdk/installation.mdx?collection=docs"), "sdk/quick-start.mdx": () => import("../content/docs/sdk/quick-start.mdx?collection=docs"), "sdk/java/index.mdx": () => import("../content/docs/sdk/java/index.mdx?collection=docs"), "sdk/node/express.mdx": () => import("../content/docs/sdk/node/express.mdx?collection=docs"), "sdk/node/fastify.mdx": () => import("../content/docs/sdk/node/fastify.mdx?collection=docs"), "sdk/node/index.mdx": () => import("../content/docs/sdk/node/index.mdx?collection=docs"), "sdk/node/standalone.mdx": () => import("../content/docs/sdk/node/standalone.mdx?collection=docs"), "sdk/python/django.mdx": () => import("../content/docs/sdk/python/django.mdx?collection=docs"), "sdk/python/fastapi.mdx": () => import("../content/docs/sdk/python/fastapi.mdx?collection=docs"), "sdk/python/flask.mdx": () => import("../content/docs/sdk/python/flask.mdx?collection=docs"), "sdk/python/index.mdx": () => import("../content/docs/sdk/python/index.mdx?collection=docs"), "sdk/python/standalone.mdx": () => import("../content/docs/sdk/python/standalone.mdx?collection=docs"), }),
};
export default browserCollections;