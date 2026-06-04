import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Rocket, Users, Zap, Shield, Star, TrendingUp } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const features = [
  { icon: Rocket, title: 'Post Your Vision', desc: 'Share your startup idea with a global community of builders ready to join forces.' },
  { icon: Users, title: 'Build Your Team', desc: 'Connect with developers, designers, and domain experts who share your ambition.' },
  { icon: Zap, title: 'Move Fast', desc: 'Streamlined applications, instant decisions, and real-time membership tracking.' },
  { icon: Shield, title: 'Curated Quality', desc: 'Every startup is reviewed. Every member is verified. Quality over quantity, always.' },
  { icon: Star, title: 'Discover Gems', desc: 'Explore ideas across 15+ categories. Find the one that ignites your excitement.' },
  { icon: TrendingUp, title: 'Track Growth', desc: 'Watch your startup evolve from idea to team. Monitor applications and memberships.' },
];

const steps = [
  { num: '01', title: 'Create Your Account', desc: 'Sign up in seconds. Build your professional profile showcasing your skills and ambitions.' },
  { num: '02', title: 'Post or Discover', desc: 'Share your startup idea or browse hundreds of vetted opportunities across every sector.' },
  { num: '03', title: 'Apply & Get Accepted', desc: 'Apply to join exciting startups. Founders review applications and build their dream team.' },
];

const Landing = () => (
  <div className="page-bg min-h-screen">
    <div className="grain" />

    {/* Navbar */}
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-dark border-b border-white/[0.06] px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B1E3F] to-[#6B1530] flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-[#FAFAFA] tracking-tight">StartupVault</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-ghost text-sm py-2 px-4">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
          </div>
        </div>
      </div>
    </header>

    {/* Hero */}
    <section className="relative pt-40 pb-28 px-6 overflow-hidden">
      {/* Glow blobs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#8B1E3F]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-80 h-80 bg-[#B8A2E3]/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B1E3F]/15 border border-[#8B1E3F]/25 text-[#B8A2E3] text-sm mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8A2E3] animate-pulse" />
          The startup collaboration platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold text-[#FAFAFA] leading-[1.05] mb-6"
        >
          Turn Ideas Into<br />
          <span className="bg-gradient-to-r from-[#8B1E3F] via-[#B8A2E3] to-[#8B1E3F] bg-clip-text text-transparent">
            Startups
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-[#FAFAFA]/50 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Discover ideas. Build teams. Create startups. The platform where ambitious builders
          find each other and make things happen.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-3.5">
            Start Building <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/login" className="btn-secondary flex items-center justify-center gap-2 text-base px-8 py-3.5">
            Explore Ideas
          </Link>
        </motion.div>
      </div>

      {/* Hero card preview */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="max-w-4xl mx-auto mt-20 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111111] z-10 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-60">
          {['AI Attendance System', 'Campus Connect', 'Smart Farming Solution'].map((name, i) => (
            <div key={i} className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge badge-pending text-xs">{['AI/ML', 'Social', 'AgriTech'][i]}</span>
              </div>
              <h3 className="text-lg font-semibold text-[#FAFAFA] mb-2">{name}</h3>
              <p className="text-sm text-[#FAFAFA]/40 mb-4">
                {['AI-powered attendance tracking using facial recognition.', 'Connecting students across campuses for collaboration.', 'IoT-based precision agriculture for smallholder farmers.'][i]}
              </p>
              <div className="flex items-center justify-between text-xs text-[#FAFAFA]/30">
                <div className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {[3, 5, 2][i]} members</div>
                <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5" /> {[18, 22, 41][i]}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>

    {/* Features */}
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp}>
            <h2 className="text-4xl md:text-5xl font-bold text-[#FAFAFA] mb-4">
              Everything you need to<br />build something great
            </h2>
            <p className="text-[#FAFAFA]/40 text-lg max-w-xl mx-auto">
              From idea validation to team assembly, StartupVault has the tools your startup needs.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="glass rounded-2xl p-6 hover:border-[#8B1E3F]/30 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#8B1E3F]/15 flex items-center justify-center mb-4 group-hover:bg-[#8B1E3F]/25 transition-colors">
                <Icon className="w-5 h-5 text-[#8B1E3F]" />
              </div>
              <h3 className="text-lg font-semibold text-[#FAFAFA] mb-2">{title}</h3>
              <p className="text-sm text-[#FAFAFA]/45 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* How It Works */}
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#FAFAFA] mb-4">How It Works</h2>
          <p className="text-[#FAFAFA]/40 text-lg">Three steps to your next startup journey</p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 relative">
          <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-[#8B1E3F]/40 to-transparent" />
          {steps.map(({ num, title, desc }) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: parseInt(num) * 0.1 }}
              className="flex-1 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B1E3F] to-[#6B1530] flex items-center justify-center text-2xl font-bold text-white mb-5 relative z-10">
                {num}
              </div>
              <h3 className="text-xl font-semibold text-[#FAFAFA] mb-2">{title}</h3>
              <p className="text-sm text-[#FAFAFA]/45 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B1E3F]/10 to-[#B8A2E3]/5 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-[#FAFAFA] mb-4">
              Ready to build?
            </h2>
            <p className="text-[#FAFAFA]/50 text-lg mb-8 max-w-md mx-auto">
              Join thousands of builders who turned their ideas into teams on StartupVault.
            </p>
            <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-base px-10 py-4">
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-white/[0.06] py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#8B1E3F] to-[#6B1530] flex items-center justify-center">
            <Rocket className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm text-[#FAFAFA]/40">StartupVault</span>
        </div>
        <p className="text-xs text-[#FAFAFA]/25">
          Discover Ideas. Build Teams. Create Startups.
        </p>
      </div>
    </footer>
  </div>
);

export default Landing;
