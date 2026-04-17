export default function Table({ headers, rows }: { headers: string[], rows: (string|React.ReactNode)[][] }) {
  return (
    <div className="w-full overflow-x-auto border border-black/10 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-black/10 bg-gray-50 uppercase tracking-widest text-[10px] font-bold text-black/50">
          <tr>{headers.map((h, i) => <th key={i} className="px-6 py-4">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-black/5 hover:bg-gray-50/50 transition-colors">
              {row.map((cell, j) => <td key={j} className="px-6 py-4 font-medium">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}