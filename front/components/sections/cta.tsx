import { Container } from "@/components/ui/container";
import { Users, GraduationCap } from "lucide-react";

export function CTASection() {
  return (
    <section id="solutions" className="py-20">
      <Container>
        <div className="relative overflow-hidden rounded-2xl gradient-bg p-8 md:p-16 text-center text-white">
          {/* Background Pattern */}
          <div className='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] opacity-20' />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              SmartAttend for Educational Community
            </h2>
            <p className="text-lg md:text-xl mb-10 opacity-90 leading-relaxed">
              Our platform is specially designed for teachers and students to
              streamline attendance management and enhance the educational
              experience.
            </p>

            {/* Role Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <GraduationCap className="w-10 h-10 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-3">For Teachers</h3>
                <p className="text-sm opacity-90 mb-4">
                  Streamline class management and focus on what matters most -
                  teaching.
                </p>
                <ul className="text-sm text-left space-y-2">
                  <li className="flex items-center">
                    <span className="bg-white/20 rounded-full w-1.5 h-1.5 mr-2"></span>
                    <span>Automated attendance tracking</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-white/20 rounded-full w-1.5 h-1.5 mr-2"></span>
                    <span>Comprehensive analytics</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-white/20 rounded-full w-1.5 h-1.5 mr-2"></span>
                    <span>Multi-class management</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <Users className="w-10 h-10 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-3">For Students</h3>
                <p className="text-sm opacity-90 mb-4">
                  Simple registration and effortless attendance tracking for all
                  your classes.
                </p>
                <ul className="text-sm text-left space-y-2">
                  <li className="flex items-center">
                    <span className="bg-white/20 rounded-full w-1.5 h-1.5 mr-2"></span>
                    <span>Quick face recognition</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-white/20 rounded-full w-1.5 h-1.5 mr-2"></span>
                    <span>Personal attendance records</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-white/20 rounded-full w-1.5 h-1.5 mr-2"></span>
                    <span>Absence notifications</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
