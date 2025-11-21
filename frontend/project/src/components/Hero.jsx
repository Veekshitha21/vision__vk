const images = [
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/7092613/pexels-photo-7092613.jpeg?auto=compress&cs=tinysrgb&w=800',
];

export default function Hero({ onGetStarted }) {
  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      // Fallback: scroll to top and trigger login
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="pt-16 bg-gradient-to-br from-[#010818]/90 via-[#05123a]/80 to-primary-900/60">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-white mb-6 leading-tight drop-shadow-xl">
            <span className="text-white">Welcome to </span>
            <span className="text-accent-400">Vision</span>
          </h1>
            <div className="flex flex-wrap justify-center items-center gap-10 text-3xl md:text-4xl font-display font-semibold uppercase tracking-[0.2em] text-accent-300 mb-8">
            {['Inspire', 'Ignite', 'Impact'].map((word) => (
              <span
                key={word}
                className="inline-block px-3 drop-shadow-lg leading-[1.25]"
              >
                {word}
              </span>
            ))}
          </div>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed mb-8">
            Empowering students with comprehensive resources, scholarships, and innovative learning tools.
            Transform your academic journey with our curated study materials, previous year questions,
            and interactive quizzes designed to help you excel.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-300 text-white text-lg font-display font-semibold rounded-lg hover:from-primary-400 hover:to-primary-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary-500/40 tracking-wide"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Moving photos carousel */}
      <div className="relative h-[400px] overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/40 via-primary-700/10 to-transparent z-10"></div>
        <div className="flex gap-4 h-full animate-scroll">
          {[...images, ...images].map((img, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-80 h-full rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={img}
                alt={`Student ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

