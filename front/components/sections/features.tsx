import { Container } from "@/components/ui/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Brain,
  Clock,
  Shield,
  BarChart3,
  Users,
  Smartphone,
  Camera,
  CheckCircle,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Recognition",
    description:
      "Advanced facial recognition technology with 99.8% accuracy for reliable attendance tracking.",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Clock,
    title: "Real-time Processing",
    description:
      "Instant attendance marking with less than 2 seconds recognition time per student.",
    color: "text-green-600 dark:text-green-400",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "End-to-end encryption ensures student data privacy and complies with educational standards.",
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Comprehensive reports and analytics for teachers to track student attendance patterns.",
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    icon: Users,
    title: "Multi-Class Management",
    description:
      "Efficiently manage multiple classes and courses with automated attendance distribution.",
    color: "text-pink-600 dark:text-pink-400",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description:
      "Access attendance data anywhere with our responsive design and mobile optimization.",
    color: "text-indigo-600 dark:text-indigo-400",
  },
];

const benefits = [
  "Eliminate manual attendance taking",
  "Reduce classroom disruption time",
  "Prevent proxy attendance fraud",
  "Generate automatic reports",
  "Track attendance trends",
  "Improve academic insights",
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <Container>
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for
            <span className="gradient-text"> Modern Education</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover how our smart attendance system revolutionizes classroom
            management with cutting-edge technology and intuitive design.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg bg-background shadow-sm flex items-center justify-center mb-4`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-background rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                Why Choose SmartAttend?
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Our system is designed specifically for educational
                institutions, understanding the unique challenges of classroom
                management and providing solutions that work in real-world
                scenarios.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative bg-gradient-to-br from-primary/10 to-indigo-500/10 rounded-xl p-8 text-center">
                <Camera className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h4 className="text-xl font-semibold mb-2">
                  Smart Recognition
                </h4>
                <p className="text-muted-foreground mb-4">
                  Advanced AI algorithms ensure accurate identification even in
                  challenging lighting conditions.
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm font-medium text-primary">
                  <Zap className="w-4 h-4" />
                  <span>Lightning Fast Processing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
