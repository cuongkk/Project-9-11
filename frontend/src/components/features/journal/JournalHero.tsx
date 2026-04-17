import { FaArrowRight } from "react-icons/fa";

export function JournalHero() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-12">
      <div className="relative bg-surface-container-lowest rounded-xl overflow-hidden flex flex-col md:flex-row min-h-[600px] shadow-2xl shadow-on-surface/5">
        <div className="w-full md:w-1/2 p-12 md:p-16 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-primary-container text-on-primary-container px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Featured Adventure</span>
            <span className="text-on-surface-variant text-xs font-medium">12 MIN READ</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-[1.1] text-on-surface mb-8">The Silent Monoliths of Northern Iceland</h1>
          <p className="text-on-surface-variant text-lg leading-relaxed mb-10 max-w-xl">
            A photographic journey through the basalt columns and hidden waterfalls of the Arctic Coast Way. Discover the architecture of nature in its rawest form.
          </p>
          <div className="flex items-center gap-6">
            <button className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold text-base hover:opacity-90 transition-all flex items-center gap-2">
              Read Full Story
              <FaArrowRight />
            </button>
            <div className="flex -space-x-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                data-alt="portrait of a male travel photographer with a rugged beard and warm expression"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_l1m5fVqPQaS0FNC_iIUFqcSbMJpkV4ow7bPLlGk8zOUrNv3dOhIbf-FychKO0iDINjkO2m24LreoOVoAGjUIrVKmyuh5dHkqQq6TLKwFgsXde3-h9XCLsoOGOxmX_MTAjuWdG04ua6rsNz9JjGgA6byPgvIzl8wzICL_x-KUWNNBP9P1bFgQwdfDKFZiXIP7G9tiaLnKgt1jKHKNotZUYmf8j76W9iEm-9F25QEVOkhodvQdrPmaqwiX8t1jnQ_CG1VRnSppnzA"
              />
              <div className="w-10 h-10 rounded-full border-2 border-white bg-secondary-container flex items-center justify-center text-xs font-bold text-on-secondary-container">+4</div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="absolute inset-0 w-full h-full object-cover"
            data-alt="dramatic aerial view of dark basalt columns meeting the turquoise arctic ocean with misty atmosphere"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbWEMT9D5uOlYXKS4IaQC-LJv16UaViWzg54xRLNyIc5WccCJRELx2u8gua0YTccNPKZQOPwQBrpd_EuXOwBC5HeW3tgZOIgfQBUB3mUx7CPSy8Ig9NdN9fCqOG7sx538TzftQ1nA8KTe0SSDGr885qt05DngehRWZoD3Rjc3ytepsi25hfPEdlRXkxtsIgLsPgDz94uBiD4vCJ9XZUMGB95Xrz01__KCVcpGtrdQVPZHeScbZQDt2BI2UTj3mQxj2ILUQLaCvU64"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest/20 to-transparent" />
        </div>
      </div>
    </section>
  );
}
