type TelemetryItem = {
  label: string
  value: string | number
  detail?: string
  accent?: boolean
}

type SiteTelemetryProps = {
  items: readonly TelemetryItem[]
  variant?: "grid" | "rail"
}

export function SiteTelemetry({ items, variant = "grid" }: SiteTelemetryProps) {
  const rail = variant === "rail"

  return (
    <div
      className={
        rail
          ? "grid grid-cols-2 border-t border-white/[0.08] lg:grid-cols-4"
          : "grid grid-cols-2 lg:col-span-4 lg:grid-cols-2 lg:grid-rows-2"
      }
    >
      {items.map((item, index) => {
        const railBorder = rail
          ? `${index % 2 === 0 ? "border-r border-white/[0.08]" : ""} ${
              index < 2 ? "border-b border-white/[0.08] lg:border-b-0" : ""
            } ${index < items.length - 1 ? "lg:border-r lg:border-white/[0.08]" : ""}`
          : `${index % 2 === 0 ? "border-r border-white/[0.08]" : ""} ${
              index < 2 ? "border-b border-white/[0.08]" : ""
            }`

        return (
          <div
            key={`${item.label}-${index}`}
            className={`relative flex flex-col justify-between px-5 sm:px-7 ${
              rail ? "min-h-[108px] py-4 lg:min-h-[118px] lg:px-8 lg:py-5" : "min-h-[132px] py-5 lg:min-h-0 lg:px-7 lg:py-6"
            } ${railBorder}`}
          >
            <span className="font-mono text-[0.53rem] uppercase tracking-[0.16em] text-[#625e57]">{item.label}</span>
            <div className={`${rail ? "mt-3 flex items-end justify-between gap-3" : "mt-5"} min-w-0`}>
              <span
                className={`block break-words font-medium leading-none ${
                  String(item.value).length > 7
                    ? rail
                      ? "text-[clamp(1.25rem,2vw,2rem)] tracking-[-0.04em]"
                      : "text-[clamp(1.45rem,2.6vw,2.5rem)] tracking-[-0.045em]"
                    : rail
                      ? "text-[clamp(2rem,3vw,3rem)] tracking-[-0.055em]"
                      : "text-[clamp(2.35rem,4vw,4rem)] tracking-[-0.065em]"
                } ${item.accent ? "text-[#d8aa27]" : "text-[#e9e4da]"}`}
              >
                {item.value}
              </span>
              {item.detail && (
                <span
                  className={`block font-mono text-[0.49rem] uppercase tracking-[0.13em] text-[#5d5952] ${
                    rail ? "max-w-[120px] pb-0.5 text-right" : "mt-2"
                  }`}
                >
                  {item.detail}
                </span>
              )}
            </div>
            <span
              aria-hidden="true"
              className={`absolute left-0 top-0 h-px w-7 ${item.accent ? "bg-[#daa000]/70" : "bg-white/[0.12]"}`}
            />
          </div>
        )
      })}
    </div>
  )
}
