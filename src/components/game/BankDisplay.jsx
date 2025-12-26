import { Coins } from 'lucide-react'

export function BankDisplay({ bankTotal, currentPlayerName, showCurrentTurn }) {
  return (
    <div className="relative text-center py-8 bg-gradient-to-br from-primary via-primary to-secondary rounded-3xl shadow-lg overflow-hidden group">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),transparent_50%)]"></div>
      </div>

      <div className="relative">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Coins className="w-4 h-4 text-white/70" />
          <div className="text-xs font-bold text-white/70 uppercase tracking-widest">
            Bank Total
          </div>
        </div>
        <div className="text-bank font-black text-white font-mono tracking-tight drop-shadow-lg transition-transform group-hover:scale-105">
          {bankTotal}
        </div>

        {/* Current Turn - nested in bank display */}
        {showCurrentTurn && currentPlayerName && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <p className="text-sm font-bold text-white/90">
              Current Turn: <span className="text-white">{currentPlayerName}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
