export function BankDisplay({ bankTotal }) {
  return (
    <div className="text-center py-8 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-card">
      <div className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-2">
        Bank Total
      </div>
      <div className="text-bank font-bold text-white">{bankTotal}</div>
    </div>
  )
}
