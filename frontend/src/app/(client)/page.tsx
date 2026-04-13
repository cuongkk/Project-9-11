/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import ToastProvider from "../../components/ui/ToastProvider";
import { FaArrowRight, FaClock, FaHotel, FaStar, FaPlane, FaHiking, FaUtensils, FaBolt, FaCheckCircle, FaHeadset, FaShieldAlt } from "react-icons/fa";

export default function Home() {
  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="z-10 order-2 md:order-1">
              <span className="inline-block text-primary font-bold tracking-widest text-xs uppercase mb-4 bg-primary-container/20 px-4 py-1 rounded-full">LUSH HORIZON IDENTITY</span>
              <h1 className="text-5xl md:text-7xl font-extrabold font-headline leading-[1.1] text-on-background tracking-tighter mb-6">
                Curating <span className="text-primary">Velocity</span> In Every Journey.
              </h1>
              <p className="text-lg text-on-surface-variant leading-relaxed mb-8 max-w-lg">
                Move beyond traditional booking. Experience hand-picked destinations curated for the modern high-energy traveler who demands both luxury and momentum.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="primary-gradient-btn text-on-primary px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                  Start Exploring
                </button>
                <button className="bg-surface-container-high text-on-surface px-10 py-4 rounded-full font-bold text-lg hover:bg-surface-container-highest transition-colors">Watch Film</button>
              </div>
              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-4">
                  <img
                    className="w-12 h-12 rounded-full border-4 border-surface object-cover"
                    data-alt="close-up portrait of a traveler smiling in a sunlit outdoor setting with soft bokeh background"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCDWxlzlN4irSGBAEYENW57ChWBoKMUmBVUJS4RykXidDpXYOGoAZ4X-Gig-SuJ85xobyzc9E0R5-tOB8S7BMFyFUhNs3dFKCO6EndqT6z7c3IW-qJ55iAxwEMQlMZRQkzNDIjlHILc-ErxqOr4j9l3rayuSV1ocATOJPkyJ8RLtRb9XHQ9Svm6gxh4jTMQ4Dhbrk41sLzuiNjv-kAWPbKdSyOXZZjT4LDvSBfmObFN1ImsC4zKhBTnBRbxq7YnzVQ9mTzQr0yfkI"
                  />
                  <img
                    className="w-12 h-12 rounded-full border-4 border-surface object-cover"
                    data-alt="portrait of a man with adventure gear looking thoughtfully into the distance at sunset"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcOfL-1aC3hVQTMtrBKMdcD0OMGK42Qgd6AxB3UYFXqNWs-sbRHDRM0uX0Mke-NZZshOybx9MxyLqvBstyV9b03cgmissSqtGM4Ny-ia50dh-o7Wfvm4H3fWXMjHRn7QmdZ5l86DE25wtjAGlf0xLLA1PrzIC8kPyvLKNhjfbhSyGM7oZR-xEsw6S2Qdp0CC8R8pJKJhuE4maBgfrpOsJWPeBryW_6YUhZ6_W8rnXKheNVic39HggOtQsxyc_vF3frh6bcT8SKWuA"
                  />
                  <img
                    className="w-12 h-12 rounded-full border-4 border-surface object-cover"
                    data-alt="vibrant portrait of a young traveler in a tropical location with lush green leaves in the background"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgjLXJ2HUyca6jHAXtgzz68c6UZ06VPtNZ5E4W5_BvgiA6FXLgNxb9EWCXcQGrK6b7wI53zyp_COLBzx0_1ar2KkkN3euui33mSpMbGckDTV8Xex7PPEkTOBRvbpsq6jhoqvIwH7Ip_zkTtkIJoT6gM8juV79VmCUM3Zo47bPSL5g51LQE0j99ucHDS-SZKaoAlHN3bZZjYtx8LktP3OLuCMdJFHcJuRNvKLM4gXa9IYI1aTXhFTITYicVwd6xEoW-m-f4u5Dvvgc"
                  />
                </div>
                <p className="text-sm font-semibold text-on-surface-variant">
                  Trusted by <span className="text-on-background">12,000+</span> Velocity Seekers
                </p>
              </div>
            </div>
            <div className="relative order-1 md:order-2 h-[500px] md:h-[700px]">
              <div className="absolute inset-0 bg-primary-container rounded-xl md:rounded-lg rotate-3 scale-95 opacity-20" />
              <img
                className="absolute inset-0 w-full h-full object-cover rounded-xl md:rounded-lg shadow-2xl"
                data-alt="breathtaking landscape of a turquoise alpine lake surrounded by jagged snow-capped mountains at dawn with mirror-like reflections"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCL9ISqhG-P0uawEcG8EjE_VgyrDh2VCijBuNeByvzes-VYnTz72wa2bvg24xx-a8J3hJxNqmXbXnGls-afxEfz2zrN4iPUcVCHtogdD7l6x-4OaLa-fybNLp0ATTUWkdoOac3GqbAFN2JgzLWS6YpwJr8JstJBB95w9NA0VNjwovwlufxWIjK4VPs1xzo_ZNl0w5QQIjvpLPccUpsU1xW4zQtZ8zFGBPoQ6tsgrUWcj4NbahIOd5pjiw_SyDuGJlpu75i-H9MwuG4"
              />
              <div className="absolute -bottom-6 -left-6 bg-surface-container-lowest p-6 rounded-lg shadow-2xl hidden md:block max-w-[240px]">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <span className="font-bold">4.9 / 5.0</span>
                </div>
                <p className="text-xs text-on-surface-variant">"The most seamless travel experience I've had in a decade of world exploration."</p>
              </div>
            </div>
          </div>
        </section>
        {/* Featured Tours Grid */}
        <section className="py-24 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold font-headline text-on-background tracking-tight mb-4">Curated Expeditions</h2>
                <p className="text-on-surface-variant max-w-md">Limited access journeys designed for the sophisticated explorer.</p>
              </div>
              <button className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all group">
                View All Tours <FaArrowRight></FaArrowRight>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Tour Card 1 */}
              <div className="group bg-surface-container-lowest rounded-lg overflow-hidden transition-all duration-500 hover:shadow-2xl">
                <div className="relative h-80 overflow-hidden">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    data-alt="misty morning over a lush green rice terrace in southeast asia with tropical palm trees in the background"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuChTeD-jeFJqCIa_fnzaL90E33o1BV9t5uCNQ4SWDYAnD49ud7qJT4bWXKZiu_sQzJks98kj_IJBP0VvO4B6MK9dq2FYrwIp_c-o75I7-Z3HlUWcKSnovtTkYDXYO5n8s13QtfsdgEt5fmQsTE3AiSk05ibbF2rGxin7EV5xcSBNkd9L3cmf0duXvb1eFI952oZFxzeHK0pddRr6hsVxTAaOF2gqkQOuWlHPUvrHgsvmJVftOMiWKyjLk-oKWe1VUvU3wkhOf55sRg"
                  />
                  <div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur-md px-4 py-2 rounded-full font-headline font-bold text-primary">$2,499</div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">
                    <FaClock className="text-sm"></FaClock> 8 Days / 7 Nights
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">The Emerald Trails of Bali</h3>
                  <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <FaHotel className="text-sm"></FaHotel> Luxury Villa
                    </span>
                    <span className="flex items-center gap-1">
                      <FaPlane className="text-sm"></FaPlane> Flights Incl.
                    </span>
                  </div>
                </div>
              </div>
              {/* Tour Card 2 */}
              <div className="group bg-surface-container-lowest rounded-lg overflow-hidden transition-all duration-500 hover:shadow-2xl">
                <div className="relative h-80 overflow-hidden">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    data-alt="a small wooden boat floating on a crystal clear emerald lake with high mountain peaks and a serene atmosphere"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2owZpu-Dakqhx70O6_Bokd5DGBt_r2vZQ8Yfrl1wXRO8kScWzIjtvjjHkcDfinpVKpjfm2cmAtaxpVjk_4H6RTrZNouyWt1BoBFTD1OFCHGkrMeJt95ZS4A0Y0o2QaauT9ksu2xpOxobEdTzpiIDccIOFxmxr7UMXpNBPVNRme9I66_tlPyV8rzQ5322ChBJwvvQuRmiGhs7FF2XYyrrLBQs0oEtksT0RpJ39-2wavUwn6MfeKKMleqNMZw8BMZ2LA2ewx_mPGhc"
                  />
                  <div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur-md px-4 py-2 rounded-full font-headline font-bold text-primary">$3,850</div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">
                    <FaClock className="	text-sm"></FaClock> 12 Days / 11 Nights
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">Alpine Velocity Expedition</h3>
                  <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <FaHiking className="text-sm"></FaHiking> Pro Guided
                    </span>
                    <span className="flex items-center gap-1">
                      <FaUtensils className="text-sm"></FaUtensils> All Meals
                    </span>
                  </div>
                </div>
              </div>
              {/* Tour Card 3 */}
              <div className="group bg-surface-container-lowest rounded-lg overflow-hidden transition-all duration-500 hover:shadow-2xl">
                <div className="relative h-80 overflow-hidden">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    data-alt="architectural view of historic venice canals at sunset with gondolas and soft glowing streetlights"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkkkeV-cr81mKRd9L8y6_7vOp0tAsRNjGdzkbyV5djuY5EzyIBBpy4VlCnH3Vr5s2BcgEOQIx0bptRkuOe11ExBpmZT07y46MY6eHaCFz4PJeAknk1AkbaFYoiWW2NohWU-Zv2kdnypTE1JbaSrTcbmIQM8wcKKBVdQuut8EeFhcXG57M0upCz_BxjfEsttsT_dY9pJM2RON-6YAckJ53RsvV2tV3UD0QfWO60-mtrhjxY8JMrM6ieNTGg5f_W5WpMYy67JEQhkvQ"
                  />
                  <div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur-md px-4 py-2 rounded-full font-headline font-bold text-primary">$4,200</div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">
                    <FaClock className="text-sm"></FaClock> 10 Days / 9 Nights
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">Renaissance Reimagined</h3>
                  <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span className="text-sm">museum</span> Private Entry
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-sm">directions_car</span> Private Transfer
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Why Choose Us */}
        <section className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold font-headline mb-6 tracking-tight">
                Redefining the <span className="text-primary">Travel Standard</span>
              </h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto text-lg leading-relaxed">We don't just book trips. We engineer seamless experiences for high-velocity lifestyles.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="p-8 rounded-lg bg-surface-container transition-transform hover:-translate-y-2">
                <FaBolt className="text-4xl text-primary mb-6"></FaBolt>
                <h4 className="font-bold text-lg mb-3">Velocity Planning</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">Instant confirmation and optimized routes for the time-conscious traveler.</p>
              </div>
              <div className="p-8 rounded-lg bg-surface-container transition-transform hover:-translate-y-2">
                <FaCheckCircle className="text-4xl text-primary mb-6"></FaCheckCircle>
                <h4 className="font-bold text-lg mb-3">Elite Curation</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">Every destination is vetted for privacy, luxury, and cultural authenticity.</p>
              </div>
              <div className="p-8 rounded-lg bg-surface-container transition-transform hover:-translate-y-2">
                <FaHeadset className="text-4xl text-primary mb-6"></FaHeadset>
                <h4 className="font-bold text-lg mb-3">24/7 Concierge</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">Global support ready to handle logistical changes in real-time.</p>
              </div>
              <div className="p-8 rounded-lg bg-surface-container transition-transform hover:-translate-y-2">
                <FaShieldAlt className="text-4xl text-primary mb-6"></FaShieldAlt>
                <h4 className="font-bold text-lg mb-3">Seamless Trust</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">Full coverage insurance and secure encrypted transactions for peace of mind.</p>
              </div>
            </div>
          </div>
        </section>
        {/* Customer Reviews */}
        <section className="py-24 bg-on-background text-white">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-6xl font-extrabold font-headline leading-tight tracking-tighter mb-8">
                  Voices from the <span className="text-primary-fixed">Horizon</span>
                </h2>
                <div className="space-y-12">
                  <div className="relative pl-8 border-l-4 border-primary">
                    <p className="text-2xl font-medium leading-relaxed mb-6 italic text-slate-300">
                      "TravelKa transformed how I view exploration. It’s no longer about where you go, but the speed and grace with which you experience it."
                    </p>
                    <div>
                      <h5 className="font-bold text-xl">Marcus Vane</h5>
                      <p className="text-primary-fixed text-sm">Tech Entrepreneur &amp; Frequent Traveler</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6 pt-12">
                  <div className="bg-slate-800 p-8 rounded-lg">
                    <div className="flex text-primary-fixed mb-4">
                      <FaStar className="text-sm"></FaStar>
                      <FaStar className="text-sm"></FaStar>
                      <FaStar className="text-sm"></FaStar>
                      <FaStar className="text-sm"></FaStar>
                      <FaStar className="text-sm"></FaStar>
                    </div>
                    <p className="text-sm text-slate-400 mb-6">"Exceptional attention to detail. The private jet transfers were perfectly timed."</p>
                    <span className="text-xs font-bold uppercase tracking-widest">Elena R.</span>
                  </div>
                  <div className="bg-slate-800 p-8 rounded-lg">
                    <div className="flex text-primary-fixed mb-4">
                      <FaStar className="text-sm"></FaStar>
                      <FaStar className="text-sm"></FaStar>
                      <FaStar className="text-sm"></FaStar>
                      <FaStar className="text-sm"></FaStar>
                      <FaStar className="text-sm"></FaStar>
                    </div>
                    <p className="text-sm text-slate-400 mb-6">"Finally a service that understands luxury isn't just about price, it's about time."</p>
                    <span className="text-xs font-bold uppercase tracking-widest">Julian Thorne</span>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-slate-800 p-8 rounded-lg">
                    <div className="flex text-primary-fixed mb-4">
                      <FaStar className="text-sm"></FaStar>
                      <FaStar className="text-sm"></FaStar>
                      <FaStar className="text-sm"></FaStar>
                      <FaStar className="text-sm"></FaStar>
                      <FaStar className="text-sm"></FaStar>
                    </div>
                    <p className="text-sm text-slate-400 mb-6">"The curation is unmatched. I felt like every stop was tailored specifically for me."</p>
                    <span className="text-xs font-bold uppercase tracking-widest">Sarah Jenkins</span>
                  </div>
                  <div className="bg-slate-800 p-8 rounded-lg">
                    <div className="flex text-primary-fixed mb-4">
                      <FaStar className="text-sm"></FaStar>
                      <FaStar className="text-sm"></FaStar>
                      <FaStar className="text-sm"></FaStar>
                      <FaStar className="text-sm"></FaStar>
                      <FaStar className="text-sm"></FaStar>
                      <FaStar className="text-sm"></FaStar>
                    </div>
                    <p className="text-sm text-slate-400 mb-6">"Seamless app interface and even better service on the ground."</p>
                    <span className="text-xs font-bold uppercase tracking-widest">David K.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Newsletter / CTA */}
        <section className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-8">
            <div className="bg-primary-container rounded-xl p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="relative z-10 max-w-xl">
                <h2 className="text-3xl md:text-5xl font-extrabold font-headline text-on-primary-container leading-tight tracking-tight mb-6">Unlock Your Exclusive Travel Journal</h2>
                <p className="text-on-primary-container/80 text-lg">Join 50k+ velocity seekers. Receive rare destination insights and priority access to seasonal expeditions.</p>
              </div>
              <div className="relative z-10 w-full max-w-md">
                <div className="flex p-2 bg-surface rounded-full shadow-lg">
                  <input className="flex-1 bg-transparent border-none focus:ring-0 px-6 text-on-surface" placeholder="Enter your email" type="email" />
                  <button className="primary-gradient-btn text-on-primary px-8 py-3 rounded-full font-bold">Join Now</button>
                </div>
              </div>
              {/* Decorative Circle */}
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary opacity-10 rounded-full blur-3xl" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
