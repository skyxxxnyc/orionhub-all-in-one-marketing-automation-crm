import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowRight, Zap, Users, Target } from 'lucide-react';
import { HeroIllustration } from '@/components/HeroIllustration';
import { Toaster } from '@/components/ui/sonner';
export function HomePage() {
  const features = [
    {
      icon: <Zap className="h-8 w-8 text-orange-400" />,
      title: 'Marketing Automation',
      description: 'Build powerful workflows to nurture leads and engage customers automatically.',
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-400" />,
      title: 'Sales CRM',
      description: 'Manage your contacts, deals, and sales pipeline in one visual platform.',
    },
    {
      icon: <Target className="h-8 w-8 text-emerald-400" />,
      title: 'All-in-One Platform',
      description: 'Funnels, email marketing, scheduling, and more. Everything you need to grow.',
    },
  ];
  return (
    <div className="min-h-screen w-full bg-slate-900 text-white overflow-x-hidden">
      <ThemeToggle className="fixed top-4 right-4" />
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500" />
          <span className="text-xl font-bold font-display">OrionHub</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/login">Log In</Link>
          </Button>
          <Button className="btn-gradient rounded-full" asChild>
            <Link to="/register">Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </header>
      <main>
        <div className="relative isolate">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-24 sm:py-32 lg:py-40 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-5xl md:text-7xl font-display font-bold text-balance leading-tight">
                  The All-in-One <span className="text-gradient">Marketing & Sales</span> Platform
                </h1>
                <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto text-pretty">
                  OrionHub gives you the tools to find customers, build relationships, and grow your business—all from a single, powerful platform.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Button size="lg" className="btn-gradient rounded-full px-8 py-4 text-lg font-semibold" asChild>
                    <Link to="/register">Start Your Free Trial</Link>
                  </Button>
                  <Button size="lg" variant="link" className="text-white" asChild>
                    <Link to="/app">View Demo <span aria-hidden="true">→</span></Link>
                  </Button>
                </div>
              </motion.div>
            </div>
            <HeroIllustration />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-24 sm:py-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center p-6 rounded-2xl bg-slate-800/50 border border-slate-700"
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-slate-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} OrionHub. All rights reserved.</p>
          <p className="mt-2 text-sm">Built with ❤️ at Cloudflare</p>
        </div>
      </footer>
      <Toaster richColors closeButton />
    </div>
  );
}