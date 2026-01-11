import { Globe } from "@/components/ui/globe";

import BirthdayWidget from "./_components/birthday-widget";
import Hero from "./_components/hero";
import HonoraryEmployeesSlider from "./_components/honorary-employees-slider";
import TodaysTopNews from "./_components/todays-top-news";

const Page = async () => {
  return (
    <>
      <Hero />

      {/* Globe Section */}
      <div className="bg-background relative flex size-full w-full items-center justify-center overflow-hidden rounded-lg border px-40 pt-8 pb-40 md:pb-60">
        <span className="pointer-events-none bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl leading-none font-semibold whitespace-pre-wrap text-transparent dark:from-white dark:to-slate-900/10">
          Bukhara Info
        </span>
        <Globe className="top-24" />
        <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
      </div>

      {/* Main Content Section */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: News Section - takes most of the width */}
          <div className="flex-1 lg:w-3/4">
            <TodaysTopNews />
          </div>

          {/* Right: Birthday Widget - fixed width on desktop */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-24">
              <BirthdayWidget />
            </div>
          </aside>
        </div>
      </div>

      {/* Honorary Employees Slider */}
      <HonoraryEmployeesSlider />
    </>
  );
};

export default Page;
