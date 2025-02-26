import { Container } from "./layout/container";
import { Logo } from "./logo";

export const Footer = () => {
  // Get current year for copyright notice
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="border-t-border/10 mt-24 border-t py-10">
      <Container as="footer" className="text-center">
        {/* Logo section */}
        <div className="flex justify-center">
          <Logo />
        </div>

        {/* Copyright and license information */}
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <p>
            {currentYear} Hyper Recent •
            <a 
              href="https://creativecommons.org/publicdomain/zero/1.0/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mx-1 hover:text-gray-900 underline"
            >
              CC0 1.0 Universal
            </a>
          </p>
          <p className="text-xs text-gray-500">
            This work is dedicated to the public domain. No rights reserved.
          </p>
        </div>
      </Container>
    </div>
  );
};
