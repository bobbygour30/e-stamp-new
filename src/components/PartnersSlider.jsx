export default function PartnersSlider() {
  const logos = [
    "/logos/logo-1.png",
    "/logos/logo-2.png",
    "/logos/logo-3.png",
    "/logos/logo-4.png",
    "/logos/logo-5.png",
    "/logos/logo-6.png",
  ];

  return (
    <section className="bg-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-wider text-indigo-600 font-semibold">
            Trusted By
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">
            Leading Organizations & Partners
          </h2>
        </div>

        {/* Slider */}
        <div className="relative">
          {/* Gradient fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10" />

          <div className="flex w-max animate-logo-scroll hover:[animation-play-state:paused]">
            {[...logos, ...logos].map((logo, index) => (
              <div
                key={index}
                className="flex items-center justify-center px-10 md:px-14"
              >
                <div className="h-14 w-40 flex items-center justify-center">
                  <img
                    src={logo}
                    alt="Partner logo"
                    className="max-h-full max-w-full object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
