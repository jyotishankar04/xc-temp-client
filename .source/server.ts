// @ts-nocheck
import * as __fd_glob_22 from "../content/docs/sdk/python/standalone.mdx?collection=docs"
import * as __fd_glob_21 from "../content/docs/sdk/python/index.mdx?collection=docs"
import * as __fd_glob_20 from "../content/docs/sdk/python/flask.mdx?collection=docs"
import * as __fd_glob_19 from "../content/docs/sdk/python/fastapi.mdx?collection=docs"
import * as __fd_glob_18 from "../content/docs/sdk/python/django.mdx?collection=docs"
import * as __fd_glob_17 from "../content/docs/sdk/node/standalone.mdx?collection=docs"
import * as __fd_glob_16 from "../content/docs/sdk/node/index.mdx?collection=docs"
import * as __fd_glob_15 from "../content/docs/sdk/node/fastify.mdx?collection=docs"
import * as __fd_glob_14 from "../content/docs/sdk/node/express.mdx?collection=docs"
import * as __fd_glob_13 from "../content/docs/sdk/java/index.mdx?collection=docs"
import * as __fd_glob_12 from "../content/docs/sdk/quick-start.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/sdk/installation.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/sdk/index.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/troubleshooting.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/index.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/getting-started.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/dashboard.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/concepts.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/api.mdx?collection=docs"
import { default as __fd_glob_3 } from "../content/docs/sdk/python/meta.json?collection=docs"
import { default as __fd_glob_2 } from "../content/docs/sdk/node/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/sdk/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, "sdk/meta.json": __fd_glob_1, "sdk/node/meta.json": __fd_glob_2, "sdk/python/meta.json": __fd_glob_3, }, {"api.mdx": __fd_glob_4, "concepts.mdx": __fd_glob_5, "dashboard.mdx": __fd_glob_6, "getting-started.mdx": __fd_glob_7, "index.mdx": __fd_glob_8, "troubleshooting.mdx": __fd_glob_9, "sdk/index.mdx": __fd_glob_10, "sdk/installation.mdx": __fd_glob_11, "sdk/quick-start.mdx": __fd_glob_12, "sdk/java/index.mdx": __fd_glob_13, "sdk/node/express.mdx": __fd_glob_14, "sdk/node/fastify.mdx": __fd_glob_15, "sdk/node/index.mdx": __fd_glob_16, "sdk/node/standalone.mdx": __fd_glob_17, "sdk/python/django.mdx": __fd_glob_18, "sdk/python/fastapi.mdx": __fd_glob_19, "sdk/python/flask.mdx": __fd_glob_20, "sdk/python/index.mdx": __fd_glob_21, "sdk/python/standalone.mdx": __fd_glob_22, });