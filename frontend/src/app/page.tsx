// import Header from "@/components/landing-page/header";
// import HeroSection from "@/components/landing-page/heroSection";
// import FeaturesSection from "@/components/landing-page/featuresSection";
// import FooterSection from "@/components/landing-page/footerSection";
// import EventSection from "@/components/landing-page/eventSection";

import Hero from "@/components/landing-page/hero/hero";
import Header from "@/components/landing-page/header/header";
import Features from "@/components/landing-page/features/features";
import Steps from "@/components/landing-page/steps/steps";
import Footer from "@/components/landing-page/footer/footer";
import WorkTeam from "@/components/landing-page/work-team/work-team";

export default function Home() {
    return (
        <div className="overflow-hidden">
            <Header />
            <Hero />
            <Features />
            <Steps />
            <WorkTeam/>
            <Footer />
        </div>
    );
}
