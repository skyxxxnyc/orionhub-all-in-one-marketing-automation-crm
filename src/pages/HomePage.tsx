import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowRight, Zap, Users, Target } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
export function HomePage() {
  const features = [
    {
      icon: <Zap className="h-10 w-10 text-black" />,
      title: 'Automation',
      description: 'Build powerful workflows to nurture leads automatically.',
    },
    {
      icon: <Users className="h-10 w-10 text-black" />,
      title: 'Sales CRM',
      description: 'Manage contacts, deals, and pipelines in one visual platform.',
    },
    {
      icon: <Target className="h-10 w-10 text-black" />,
      title: 'Growth',
      description: 'Funnels, email marketing, and scheduling to scale fast.',
    },
  ];
  return (
    <div className="min-h-screen w-full bg-white text-black overflow-x-hidden selection:bg-orange-500 selection:text-white">
      <ThemeToggle className="fixed top-6 right-6" />
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-between items-center border-b-4 border-black">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 bg-orange-500 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
          <span className="text-3xl font-display font-black uppercase tracking-tighter">OrionHub</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/login" className="font-black uppercase text-sm hover:underline underline-offset-4">Log In</Link>
          <Button className="brutalist-button bg-orange-500 text-white" asChild>
            <Link to="/register">Join Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </header>
      <main>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="editorial-heading mb-8">
              The <span className="text-orange-500">Raw</span> Power of <br />
              Marketing.
            </h1>
            <p className="text-xl md:text-2xl font-medium max-w-xl mb-10 leading-relaxed">
              OrionHub is a high-performance CRM and automation engine built for those who value speed, clarity, and results. No fluff. Just growth.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="brutalist-button bg-black text-white text-xl px-10 py-8" asChild>
                <Link to="/register">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" className="brutalist-button text-xl px-10 py-8" asChild>
                <Link to="/app">View Demo</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square bg-orange-500 border-8 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center p-12">
              <div className="w-full h-full bg-white border-4 border-black p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="h-8 w-3/4 bg-black" />
                  <div className="h-8 w-1/2 bg-black" />
                  <div className="h-8 w-5/6 bg-black" />
                </div>
                <div className="h-24 w-full bg-orange-500 border-4 border-black" />
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-black border-4 border-white rotate-12 flex items-center justify-center">
              <span className="text-white font-black text-4xl">10X</span>
            </div>
          </motion.div>
        </section>
        <section className="bg-black text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border-4 border-white p-8 bg-black hover:bg-orange-500 transition-colors group"
                >
                  <div className="bg-white p-4 w-fit border-4 border-black mb-6 group-hover:rotate-6 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-3xl font-black uppercase mb-4">{feature.title}</h3>
                  <p className="text-lg font-medium opacity-80">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-7xl font-black uppercase mb-12 tracking-tighter">
            Ready to <span className="underline decoration-orange-500 decoration-8 underline-offset-8">Dominate</span>?
          </h2>
          <Button size="lg" className="brutalist-button bg-orange-500 text-white text-2xl px-16 py-10" asChild>
            <Link to="/register">Get Started Now</Link>
          </Button>
        </section>
      </main>
      <footer className="border-t-4 border-black py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-black" />
            <span className="text-2xl font-black uppercase tracking-tighter">OrionHub</span>
          </div>
          <p className="font-mono text-sm uppercase font-bold">&copy; {new Date().getFullYear()} OrionHub. Built for the Edge.</p>
        </div>
      </footer>
      <Toaster richColors closeButton />
    </div>
  );
}