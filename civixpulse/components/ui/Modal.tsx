export default function Modal({ isOpen, title, onClose, children }: { isOpen: boolean, title: string, onClose: () => void, children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg border border-black p-6">
        <div className="flex justify-between items-center mb-6 border-b border-black/10 pb-4">
          <h3 className="text-xl font-black uppercase tracking-tighter">{title}</h3>
          <button onClick={onClose} className="text-black/50 hover:text-black">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}