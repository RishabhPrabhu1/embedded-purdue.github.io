"use client"

import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"

type CodeProps = {
  inline?: boolean
  className?: string
  children?: React.ReactNode
} & React.HTMLAttributes<HTMLElement>

export default function Markdown({
  children,
  className = "prose prose-invert max-w-none break-words",
  imageBase,
}: {
  children: string
  className?: string
  imageBase?: string
}) {
  const schema: any = {
    ...defaultSchema,
    tagNames: [...(defaultSchema.tagNames || []), "section", "iframe"],
    attributes: {
      ...(defaultSchema.attributes || {}),
      "*": [...(defaultSchema.attributes?.["*"] || []), "class", "className", "style"],
      iframe: [
        "src",
        "width",
        "height",
        "loading",
        "referrerpolicy",
        "allow",
        "allowfullscreen",
        "frameborder",
        "title",
      ],
      section: ["style", "class", "className"],
    },
  }

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
        components={{
          img({ src, alt, ...props }) {
            let finalSrc = src || ""
            if (finalSrc && !finalSrc.startsWith("http") && !finalSrc.startsWith("/")) {
              finalSrc = (imageBase ? `${imageBase.replace(/\/$/, "")}/` : "") + finalSrc
            }

            return (
              <img
                src={finalSrc}
                alt={alt as string}
                loading="lazy"
                draggable={false}
                className="my-8 block h-auto w-full max-w-full border-y border-white/[0.08] bg-black object-contain"
                {...props}
              />
            )
          },

          iframe(props: React.IframeHTMLAttributes<HTMLIFrameElement>) {
            return (
              <div className="not-prose my-8 overflow-hidden border-y border-white/[0.09] bg-black">
                <iframe {...props} className={`aspect-video w-full ${props.className || ""}`} />
              </div>
            )
          },

          pre({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
            const codeChild = React.Children.toArray(children).find(
              (child: any) => child?.type === "code"
            ) as any
            const lang = codeChild?.props?.className
              ? /language-(\w+)/.exec(codeChild.props.className)?.[1]
              : null

            return (
              <div className="not-prose group relative my-8 border-y border-white/[0.09] bg-[#090908]">
                {lang && (
                  <div className="border-b border-white/[0.07] px-4 py-2 font-mono text-[0.5rem] uppercase tracking-[0.16em] text-[#756f67]">
                    {lang}
                  </div>
                )}
                <pre className="overflow-x-auto bg-transparent p-4 font-mono text-sm leading-6 text-[#b9b3a9] sm:p-5" {...props}>
                  {children}
                </pre>
              </div>
            )
          },

          code({ inline, className: codeClassName, children, ...props }: CodeProps) {
            if (inline) {
              return (
                <code
                  className={`inline max-w-full border border-white/[0.08] bg-black/35 px-1.5 py-0.5 font-mono text-[0.86em] text-[#d7d1c6] ${codeClassName || ""}`}
                  {...props}
                >
                  {children}
                </code>
              )
            }

            return (
              <code
                className={`font-mono text-sm leading-relaxed text-[#b9b3a9] ${codeClassName || ""}`}
                {...props}
              >
                {children}
              </code>
            )
          },

          blockquote({ children, ...props }) {
            return (
              <blockquote
                className="my-8 border-l border-[#daa000]/70 bg-transparent py-1 pl-5 text-[#aaa49a] not-italic sm:pl-6"
                {...props}
              >
                {children}
              </blockquote>
            )
          },

          table({ children, ...props }) {
            return (
              <div className="not-prose my-8 overflow-x-auto border-y border-white/[0.09]">
                <table className="w-full border-collapse text-sm text-[#9a958c]" {...props}>
                  {children}
                </table>
              </div>
            )
          },

          thead(props) {
            return <thead className="border-b border-white/[0.1] bg-black/30" {...props} />
          },

          tr(props) {
            return <tr className="border-b border-white/[0.07] last:border-b-0" {...props} />
          },

          th(props) {
            return (
              <th
                className="border-r border-white/[0.07] px-4 py-3 text-left font-mono text-[0.58rem] font-medium uppercase tracking-[0.12em] text-[#d5cfc4] last:border-r-0"
                {...props}
              />
            )
          },

          td(props) {
            return (
              <td
                className="border-r border-white/[0.07] px-4 py-3 align-top leading-6 text-[#918b82] last:border-r-0"
                {...props}
              />
            )
          },

          ul(props) {
            return <ul className="my-6 ml-5 list-disc space-y-2 marker:text-[#8f7325]" {...props} />
          },

          ol(props) {
            return <ol className="my-6 ml-5 list-decimal space-y-2 marker:text-[#8f7325]" {...props} />
          },

          h1(props) {
            return (
              <h1
                className="mb-8 border-b border-white/[0.09] pb-4 text-[clamp(2.5rem,5vw,4.6rem)] font-medium leading-[0.92] tracking-[-0.055em] text-[#ece7dc]"
                {...props}
              />
            )
          },

          h2(props) {
            return (
              <h2
                className="mb-5 mt-11 border-b border-white/[0.08] pb-3 text-[clamp(1.9rem,3vw,2.8rem)] font-medium leading-[1] tracking-[-0.045em] text-[#e7e1d7]"
                {...props}
              />
            )
          },

          h3(props) {
            return (
              <h3
                className="mb-3 mt-8 text-[clamp(1.45rem,2.2vw,2rem)] font-medium leading-[1.08] tracking-[-0.035em] text-[#dcd6cc]"
                {...props}
              />
            )
          },

          hr(props) {
            return <hr className="my-9 border-0 border-t border-white/[0.08]" {...props} />
          },

          a(props) {
            return (
              <a
                className="break-words font-medium text-[#d8aa27] underline decoration-[#d8aa27]/35 decoration-1 underline-offset-4 transition-colors hover:text-[#f2c34f] hover:decoration-[#f2c34f]/70"
                {...props}
              />
            )
          },

          p(props) {
            const { children } = props
            const childArray = React.Children.toArray(children)

            if (childArray.length === 1) {
              const child = childArray[0] as any
              if (
                child?.props?.className?.includes("not-prose") ||
                child?.props?.className?.includes("relative my-8") ||
                child?.type === "pre"
              ) {
                return <>{children}</>
              }
            }

            return <p className="my-4 break-words leading-7 text-[#9a958c]" {...props} />
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
