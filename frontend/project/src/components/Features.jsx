import { GraduationCap, BookOpen, FileText, Brain } from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "Scholarships",
    description:
      "Access a comprehensive database of scholarships tailored to your academic profile. Discover funding opportunities from top institutions and organizations worldwide. Get timely notifications about deadlines and application requirements.",
  },
  {
    icon: BookOpen,
    title: "Study Materials",
    description:
      "Curated collection of high-quality study materials covering diverse subjects and topics. Access notes, reference books, and learning resources prepared by experts. Download materials anytime and study at your own pace.",
  },
  {
    icon: FileText,
    title: "Previous Year Questions (PYQ)",
    description:
      "Extensive archive of previous year examination papers and solutions. Practice with authentic questions to understand exam patterns and difficulty levels. Improve your preparation strategy with detailed answer explanations.",
  },
  {
    icon: Brain,
    title: "Quiz",
    description:
      "Interactive quizzes to test your knowledge and track progress. Multiple difficulty levels and topics to match your learning needs. Instant feedback and detailed explanations help reinforce concepts and identify areas for improvement.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-20 bg-gradient-to-br from-midnight via-onyx to-primary-900/70"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Our Features
          </h2>
          <p className="text-xl text-slate-200">
            Everything you need to succeed in your academic journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-onyx via-primary-900/80 to-midnight p-8 rounded-2xl border border-primary-700/40 hover:border-primary-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/20 transform hover:-translate-y-2"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-300 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary-500/30">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-accent-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-200 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
