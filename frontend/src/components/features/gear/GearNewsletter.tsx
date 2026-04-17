export function GearNewsletter() {
  return (
    <section className="bg-surface-container-low py-20 px-8 mx-4 md:mx-8 mb-12 rounded-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
          <h2 className="text-4xl font-extrabold text-on-surface leading-tight mb-4">Join the Velocity Journal.</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">Weekly deep-dives into destination secrets and technical gear teardowns. Unsubscribe anytime.</p>
        </div>
        <div className="md:w-1/2 w-full">
          <form className="flex gap-4">
            <input
              className="flex-1 bg-surface-container-lowest border-none rounded-full px-8 py-4 focus:ring-2 focus:ring-primary/20 text-on-surface shadow-sm"
              placeholder="Enter your email"
              type="email"
            />
            <button className="primary-gradient-btn text-on-primary px-10 py-4 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all">Join</button>
          </form>
          <p className="text-xs text-on-surface-variant mt-4 opacity-70">By subscribing, you agree to our Privacy Policy and Terms of Service.</p>
        </div>
      </div>
    </section>
  );
}
