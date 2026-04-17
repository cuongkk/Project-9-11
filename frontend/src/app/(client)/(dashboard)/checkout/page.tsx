import { FaCalendar, FaCreditCard, FaMoneyBill, FaUser } from "react-icons/fa";
import { FaShield, FaUserGroup } from "react-icons/fa6";

export default function CheckoutPage() {
  return (
    <>
      <main className="max-w-screen-2xl mx-auto px-6 md:px-12 py-10 lg:py-16 w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 xl:gap-20">
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-12">
            {/* Page Title */}
            <section>
              <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-3">Finalize Your Journey</h1>
              <p className="text-on-surface-variant font-body text-lg">Review your details and secure your editorial travel experience.</p>
            </section>
            {/* Section 1: Contact Information */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <FaUser className="text-primary" data-icon="person"></FaUser>
                <h2 className="font-headline text-xl font-bold tracking-tight">Contact Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-low/40 p-6 md:p-10 rounded-lg">
                <div className="space-y-2 group">
                  <label className="font-label text-[0.75rem] uppercase tracking-widest text-on-surface-variant ml-1 font-bold">First Name</label>
                  <input
                    className="w-full bg-surface-container-lowest border-none rounded-full px-6 py-4 focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline-variant transition-all outline-none"
                    placeholder="Alex"
                    type="text"
                  />
                </div>
                <div className="space-y-2 group">
                  <label className="font-label text-[0.75rem] uppercase tracking-widest text-on-surface-variant ml-1 font-bold">Last Name</label>
                  <input
                    className="w-full bg-surface-container-lowest border-none rounded-full px-6 py-4 focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline-variant transition-all outline-none"
                    placeholder="Rivers"
                    type="text"
                  />
                </div>
                <div className="md:col-span-2 space-y-2 group">
                  <label className="font-label text-[0.75rem] uppercase tracking-widest text-on-surface-variant ml-1 font-bold">Email Address</label>
                  <input
                    className="w-full bg-surface-container-lowest border-none rounded-full px-6 py-4 focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline-variant transition-all outline-none"
                    placeholder="alex@travelka.com"
                    type="email"
                  />
                </div>
                <div className="md:col-span-2 space-y-2 group">
                  <label className="font-label text-[0.75rem] uppercase tracking-widest text-on-surface-variant ml-1 font-bold">Phone Number</label>
                  <input
                    className="w-full bg-surface-container-lowest border-none rounded-full px-6 py-4 focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline-variant transition-all outline-none"
                    placeholder="+84 901 234 567"
                    type="tel"
                  />
                </div>
              </div>
            </section>
            {/* Section 2: Payment Method */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <FaMoneyBill className="text-primary" data-icon="payments"></FaMoneyBill>
                <h2 className="font-headline text-xl font-bold tracking-tight">Payment Method</h2>
              </div>
              <div className="grid grid-cols-1 gap-5">
                {/* Option 1: Credit Card Expanded */}
                <div className="p-6 md:p-8 bg-surface-container-lowest rounded-lg border border-primary/20 shadow-sm">
                  <label className="flex items-center justify-between mb-8 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <input className="peer hidden" name="payment" type="radio" />
                      <div className="w-12 h-8 bg-surface-container-high rounded flex items-center justify-center">
                        <FaCreditCard className="text-secondary" data-icon="credit_card"></FaCreditCard>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface">Visa / Mastercard</span>
                        <span className="text-xs text-on-surface-variant">Secure checkout with encryption</span>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-primary bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="col-span-2 md:col-span-4 space-y-1">
                      <label className="text-[0.65rem] font-bold uppercase tracking-tighter text-on-surface-variant">Card Number</label>
                      <input
                        className="w-full bg-surface-container-low border-none rounded-full px-6 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="0000 0000 0000 0000"
                        type="text"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-1">
                      <label className="text-[0.65rem] font-bold uppercase tracking-tighter text-on-surface-variant">Expiry Date</label>
                      <input className="w-full bg-surface-container-low border-none rounded-full px-6 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="MM / YY" type="text" />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-1">
                      <label className="text-[0.65rem] font-bold uppercase tracking-tighter text-on-surface-variant">CVV</label>
                      <input className="w-full bg-surface-container-low border-none rounded-full px-6 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" type="password" />
                    </div>
                  </div>
                </div>
                {/* Option 2: Momo */}
                <label className="relative flex items-center justify-between p-6 bg-surface-container-lowest rounded-lg cursor-pointer group hover:bg-surface-container-low transition-all shadow-sm border border-transparent hover:border-outline-variant/20">
                  <input className="peer hidden" name="payment" type="radio" />
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-[#A50064] rounded flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">MOMO</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-on-surface">Momo e-wallet</span>
                      <span className="text-xs text-on-surface-variant">Instant payment via mobile app</span>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-outline-variant peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </label>
              </div>
            </section>
          </div>
          {/* Sticky Order Summary Side */}
          <aside className="lg:col-span-5">
            <div className="sticky top-32 space-y-8">
              <div className="bg-surface-container-lowest rounded-lg p-8 shadow-[0_32px_64px_-16px_rgba(0,107,17,0.1)] overflow-hidden relative border border-primary/5">
                {/* Decorative gradient corner */}
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
                <h2 className="font-headline text-2xl font-extrabold tracking-tight mb-8">Order Summary</h2>
                <div className="flex gap-6 mb-10 group">
                  <div className="w-32 h-28 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                    <img
                      alt="Ha Long Bay"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      data-alt="breathtaking aerial view of limestone karsts rising from turquoise water in Ha Long Bay Vietnam during sunrise"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2k6MXiMEUUlgwqSZOPBsbGOSsADYB8hPuGx4jLEwx_piAFSpMT72UDYuCqfS8Opml48HecCnX1cU2APt7GHmVjMrAbiz5SRWc1Vu1mMyVM0Acx3UiNgnXn7kEzrJGztJ_IgxhT6xnl4o-qe6nSABIfcRKfaZJzlJZ63jS4mUQFuu6-YpGficybMnKGJdNZ6cLKqvpHEFHElSAWIL-o9tcB7d10ji4hEltWlY092sWRlNhqzOjHTRwQ6RVvYMozUI74ERInWEh8EQ"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="font-label text-[0.65rem] uppercase tracking-widest text-primary font-extrabold mb-1">Luxury Escape</span>
                    <h3 className="font-bold text-xl leading-tight text-on-surface">Vịnh Hạ Long 3N2Đ</h3>
                    <div className="flex items-center gap-2 text-on-surface-variant text-sm mt-2">
                      <FaCalendar className="text-[1rem]" data-icon="event"></FaCalendar>
                      <span>Oct 12 - Oct 14, 2024</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant text-sm mt-1">
                      <FaUserGroup className="text-[1rem]" data-icon="group"></FaUserGroup>
                      <span>2 Adults, 1 Room</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 border-t border-outline-variant/15 pt-8">
                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant font-medium">Subtotal</span>
                    <span className="font-bold text-on-surface">$540.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant font-medium">Travel Tax (10%)</span>
                    <span className="font-bold text-on-surface">$54.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant font-medium">Service Fee</span>
                    <span className="font-bold text-primary italic">Included</span>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t-2 border-dashed border-outline-variant/20">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="font-label text-[0.75rem] uppercase tracking-widest text-on-surface-variant font-bold">Total Price</span>
                      <div className="text-4xl font-plus-jakarta font-extrabold text-on-surface mt-1">$594.00</div>
                    </div>
                    <div className="text-primary text-[0.65rem] font-black bg-primary-container px-4 py-2 rounded-full tracking-widest uppercase">BEST VALUE</div>
                  </div>
                </div>
                <button className="w-full mt-10 bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold py-6 rounded-full hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-3 text-lg">
                  <FaShield data-icon="verified_user"></FaShield>
                  Confirm Booking
                </button>
                <p className="text-center text-[0.7rem] text-on-surface-variant mt-6 font-inter leading-relaxed max-w-xs mx-auto">
                  By clicking Confirm Booking, you agree to our{" "}
                  <a className="underline font-bold text-on-surface hover:text-primary" href="#">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a className="underline font-bold text-on-surface hover:text-primary" href="#">
                    Cancellation Policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
