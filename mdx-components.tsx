import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

import {
  CodeBlock,
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  Pre,
} from "@/components/codeblock";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    CodeBlockTab,
    CodeBlockTabs,
    CodeBlockTabsList,
    CodeBlockTabsTrigger,
    pre: ({ ref, ...props }) => {
      void ref;

      return (
        <CodeBlock {...props}>
          <Pre>{props.children}</Pre>
        </CodeBlock>
      );
    },
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
