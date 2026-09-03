type TelemetryItem = {
  label: string
  value: string | number
  detail?: string
  accent?: boolean
}

export function SiteTelemetry({ items }: { items: readonly TelemetryItem[] }) {
  return (
    <div className="grid grid-cols-2 lg:col-span-4 lg:grid-cols-2 lg:grid-rows-2">
      {items.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className={`relative flex min-h-[132px] flex-col justify-between px-5 py-5 sm:px-7 lg:min-h-0 lg:px-7 lg:py-6 ${
            index % 2 === 0 ? "border-r border-white/[0.08]" : ""
          } ${index < 2 ? "border-b border-white/[0.08]" : ""}`}
        >
          <span className="font-mono text-[0.53rem] uppercase tracking-[0.16em] text-[#625e57]">{item.label}</span>
          <div className="mt-5">
            <span
              className={`block text-[clamp(2.35rem,4vw,4rem)] font-medium leading-none tracking-[-0.065em] ${
                item.accent ? "text-[#d8aa27]" : "text-[#e9e4da]"
              }`}
            >
              {item.value}
            </span>
            {item.detail && (
              <span className="mt-2 block font-mono text-[0.49rem] uppercase tracking-[0.13em] text-[#5d5952]">
                {item.detail}
              </span>
            )}
          </div>
          <span
            aria-hidden="true"
            className={`absolute left-0 top-0 h-px w-7 ${item.accent ? "bg-[#daa000]/70" : "bg-white/[0.12]"}`}
          />
        </div>
      ))}
    </div>
  )
}
