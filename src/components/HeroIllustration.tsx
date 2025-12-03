import { motion } from 'framer-motion';
export function HeroIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative w-full max-w-4xl mx-auto"
    >
      <div className="aspect-[16/9] rounded-2xl bg-white/10 p-2 shadow-glass backdrop-blur-lg border border-white/20">
        <div className="h-full w-full rounded-lg bg-slate-900/80 p-4 border border-slate-700/50">
          <div className="flex items-center gap-1.5 mb-3">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 w-3/4 rounded bg-slate-700/50 animate-pulse"></div>
            <div className="h-4 w-1/2 rounded bg-slate-700/50 animate-pulse delay-75"></div>
            <div className="h-4 w-5/6 rounded bg-slate-700/50 animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute -bottom-8 -right-8 w-48 h-32 rounded-xl bg-white/10 p-2 shadow-glass backdrop-blur-lg border border-white/20"
      >
        <div className="h-full w-full rounded-md bg-slate-900/80 p-3 border border-slate-700/50">
          <div className="h-3 w-1/3 rounded bg-slate-700/50 mb-2"></div>
          <div className="h-12 w-full rounded bg-gradient-to-r from-orange-500 to-amber-500"></div>
        </div>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="absolute -top-8 -left-8 w-32 h-24 rounded-xl bg-white/10 p-2 shadow-glass backdrop-blur-lg border border-white/20"
      >
        <div className="h-full w-full rounded-md bg-slate-900/80 p-3 border border-slate-700/50">
          <div className="h-3 w-1/2 rounded bg-slate-700/50 mb-2"></div>
          <div className="h-3 w-3/4 rounded bg-slate-700/50"></div>
        </div>
      </motion.div>
    </motion.div>
  );
}