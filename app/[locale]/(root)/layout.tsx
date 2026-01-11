import { Particles } from "@/components/ui/particles";
import { ChildProps } from "@/types";

import { Footer, Navbar } from "./_components";

const Layout = ({ children }: ChildProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="mb-24">
        <Navbar />
      </div>
      <main className="relative flex-1">
        <Particles
          className="absolute inset-0 z-0 pointer-events-none"
          quantity={400}
          ease={80}
          refresh
        />
        <div className="relative z-10">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

