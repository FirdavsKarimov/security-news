import BirthdaySlider from "./_components/birthday-slider";
import EventsSlider from "./_components/events-slider";
import FormerLeadersSlider from "./_components/former-leaders-slider";
import MainNewsSlider from "./_components/main-news-slider";
import MiniNewsSlider from "./_components/mini-news-slider";

const DisplayPage = () => {
    return (
        <div className="fixed inset-0 bg-slate-950 overflow-hidden">
            {/* 5-Section Grid Layout for 65" Monitor */}
            <div className="h-screen w-screen grid grid-cols-[1fr_2fr_1fr] grid-rows-2 gap-4 p-4">

                {/* Top Left - Former Leaders */}
                <div className="row-span-1">
                    <FormerLeadersSlider />
                </div>

                {/* Center - Main News (spans 2 rows) */}
                <div className="row-span-2 rounded-2xl overflow-hidden shadow-2xl">
                    <MainNewsSlider />
                </div>

                {/* Top Right - Birthdays */}
                <div className="row-span-1">
                    <BirthdaySlider />
                </div>

                {/* Bottom Left - Events */}
                <div className="row-span-1">
                    <EventsSlider />
                </div>

                {/* Bottom Right - Mini News */}
                <div className="row-span-1">
                    <MiniNewsSlider />
                </div>
            </div>
        </div>
    );
};

export default DisplayPage;
