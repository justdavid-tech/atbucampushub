import Navbar from "../components/navbar";
import Hero from "../components/hero";
import MissionSection from "../components/mission";
import FeaturesSection from "../components/features";
import WhyStudentsLove from "../components/whystudentslove";
import HowItWorks from "../components/howitworks";
import Testimonials from "../components/testimonies";
import FAQSection from "../components/faq";
import Footer from "../components/footer";

function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <MissionSection />
            <FeaturesSection />
            <WhyStudentsLove />
            <HowItWorks />
            <Testimonials />
            <FAQSection />
            <Footer />
        </>
    )
}

export default Home
