import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import { Github, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="bg-muted/30 border-t">
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 relative rounded-lg overflow-hidden">
                  <Image
                    src="/Ruet-Logo.jpg"
                    alt="RUET Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg leading-tight">
                    SmartAttend
                  </span>
                  <span className="text-xs text-muted-foreground">RUET</span>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">
                Revolutionizing education with AI-powered attendance management
                for modern classrooms.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>RUET, Rajshahi</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>niloydev59@gmail.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>+880 XXX XXXXX</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator />

        <div className="py-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2024 SmartAttend RUET. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link
              href="https://github.com/Niloydey59"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="w-5 h-5" />
            </Link>
            <Link
              href="mailto:niloydev59@gmail.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
