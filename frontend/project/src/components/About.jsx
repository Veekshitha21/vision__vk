import { Linkedin, Mail, Github } from 'lucide-react';

const teamMembers = [
  {
    name: 'John Doe',
    role: 'Founder & CEO',
    image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Passionate about education and technology, leading Vision to empower students worldwide.',
    linkedin: '#',
    email: 'john@vision.edu',
    github: '#'
  },
  {
    name: 'Jane Smith',
    role: 'CTO',
    image: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Tech enthusiast building innovative solutions for better learning experiences.',
    linkedin: '#',
    email: 'jane@vision.edu',
    github: '#'
  },
  {
    name: 'Mike Johnson',
    role: 'Head of Education',
    image: 'https://images.pexels.com/photos/3184281/pexels-photo-3184281.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Dedicated to creating quality educational content and resources for students.',
    linkedin: '#',
    email: 'mike@vision.edu',
    github: '#'
  },
  {
    name: 'Sarah Williams',
    role: 'Product Manager',
    image: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Focused on user experience and making Vision accessible to everyone.',
    linkedin: '#',
    email: 'sarah@vision.edu',
    github: '#'
  },
  {
    name: 'David Brown',
    role: 'Lead Developer',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Full-stack developer passionate about building scalable and efficient platforms.',
    linkedin: '#',
    email: 'david@vision.edu',
    github: '#'
  },
  {
    name: 'Emily Davis',
    role: 'Content Strategist',
    image: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Creating engaging and informative content to help students succeed.',
    linkedin: '#',
    email: 'emily@vision.edu',
    github: '#'
  }
];

export default function About() {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-midnight via-onyx to-primary-900/70">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            About Vision
          </h2>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
            Vision is a comprehensive educational platform dedicated to supporting students
            in their academic endeavors. We believe that every student deserves access to quality
            education resources, regardless of their background or circumstances.
          </p>
        </div>

        <div className="max-w-4xl mx-auto text-slate-200 text-lg leading-relaxed space-y-4 mb-16">
          <p>
            Our platform brings together scholarships, carefully curated study materials, extensive
            collections of previous year questions, and engaging quizzes to create a holistic
            learning experience. We're committed to making education accessible, engaging, and
            effective for students at every level.
          </p>
          <p>
            Join thousands of students who have already discovered the power of organized learning
            and smart preparation. Whether you're preparing for competitive exams, regular coursework,
            or exploring scholarship opportunities, Vision is your trusted companion on the path
            to academic success.
          </p>
        </div>

        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Our Team
          </h3>
          <p className="text-lg text-slate-200">
            Meet the passionate people behind Vision
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-onyx via-primary-900/80 to-midnight p-6 rounded-2xl border border-primary-700/30 hover:border-primary-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/20 transform hover:-translate-y-2"
            >
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-accent-400/40">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-2xl font-display font-bold text-white mb-2">{member.name}</h4>
                <p className="text-accent-400 mb-3 font-semibold">{member.role}</p>
                <p className="text-slate-200 text-sm mb-4 leading-relaxed">{member.bio}</p>
                <div className="flex justify-center space-x-4">
                  <a
                    href={member.linkedin}
                    className="text-accent-400 hover:text-accent-300 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-accent-400 hover:text-accent-300 transition-colors"
                    aria-label="Email"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                  <a
                    href={member.github}
                    className="text-accent-400 hover:text-accent-300 transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

