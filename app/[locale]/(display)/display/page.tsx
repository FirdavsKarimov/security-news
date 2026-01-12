import AnnouncementsSlider from "./_components/announcements-slider";
import BirthdaySlider from "./_components/birthday-slider";
import EventsSlider from "./_components/events-slider";
import FormerLeadersSlider from "./_components/former-leaders-slider";
import MainNewsSlider from "./_components/main-news-slider";

const DisplayPage = () => {
    return (
        <div className="fixed inset-0 bg-slate-900 overflow-hidden">
            {/* Professional 5-Section Grid Layout - Main news slightly smaller */}
            <div className="h-screen w-screen grid grid-cols-[1.2fr_1.8fr_1fr] grid-rows-2 gap-3 p-3">

                {/* Top Left - Former Leaders */}
                <div className="row-span-1">
                    <FormerLeadersSlider />
                </div>

                {/* Center - Main News (spans 2 rows) - slightly smaller ratio */}
                <div className="row-span-2 overflow-hidden border border-slate-700 rounded-lg">
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

                {/* Bottom Right - Announcements (E'lonlar) */}
                <div className="row-span-1">
                    <AnnouncementsSlider />
                </div>
            </div>
        </div>
    );
};

export default DisplayPage;
