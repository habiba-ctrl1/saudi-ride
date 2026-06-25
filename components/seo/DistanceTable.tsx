// Key-facts table. On route pages it shows distance / time / fare-per-vehicle;
// on any page it can render a labelled facts table. Tables are highly
// crawlable and often pulled into rich results / AI answers. Server component.
//
//   <DistanceTable
//     caption="Jeddah Airport → Makkah — fares by vehicle"
//     columns={["Vehicle", "Passengers", "Price (SAR)"]}
//     rows={[["Sedan", "1-3", "from 250"], ["SUV", "1-6", "from 375"]]}
//   />
export function DistanceTable({
  caption,
  columns,
  rows,
  className = "",
}: {
  caption?: string;
  columns: string[];
  rows: (string | number)[][];
  className?: string;
}) {
  if (!rows?.length) return null;

  return (
    <div className={`overflow-x-auto rounded-2xl border border-black/8 ${className}`}>
      <table className="w-full border-collapse text-sm">
        {caption && (
          <caption className="bg-[#006C35] px-4 py-3 text-left text-sm font-semibold text-white">
            {caption}
          </caption>
        )}
        <thead>
          <tr className="bg-[#F4E4BC]/40 text-left">
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-3 font-semibold text-[#1C1C1C] whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-t border-black/5 odd:bg-white even:bg-[#FAFAF7]">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-4 py-3 ${ci === 0 ? "font-medium text-[#1C1C1C]" : "text-[#444]"}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
