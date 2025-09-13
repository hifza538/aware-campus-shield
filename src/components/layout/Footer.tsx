import { Link } from "react-router-dom";
import { Shield, Mail, FileText, Users } from "lucide-react";
import phishingIcon from "@/assets/phishing-icon.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src={phishingIcon} 
                alt="PhishAware" 
                className="h-8 w-8 brightness-0 invert"
              />
              <span className="font-bold text-xl">PhishAware</span>
            </div>
            <p className="text-primary-foreground/80 mb-4 max-w-md">
              Educational phishing awareness platform designed to help organizations 
              and students learn to identify and prevent phishing attacks through 
              ethical simulation campaigns.
            </p>
            <div className="bg-warning/20 border border-warning/30 rounded-lg p-4">
              <p className="text-sm text-warning-foreground font-medium">
                <Shield className="inline h-4 w-4 mr-2" />
                For Educational Use Only
              </p>
              <p className="text-xs text-warning-foreground/80 mt-1">
                This platform is designed for ethical education and must not be used 
                to send real malicious emails or conduct unauthorized attacks.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/features" 
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  to="/pricing" 
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  to="/demo" 
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth"
                >
                  Demo
                </Link>
              </li>
              <li>
                <Link 
                  to="/resources" 
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth"
                >
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-foreground/60 text-sm">
              © {currentYear} PhishAware. All rights reserved. For educational purposes only.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-primary-foreground/60 text-sm">
                Built with React + Tailwind
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;