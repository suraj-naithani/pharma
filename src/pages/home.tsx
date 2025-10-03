const Home = () => {
  return (
    <>
      <section className="flex-1 relative overflow-hidden bg-white">
        {/* HERO */}
        <div className="relative mx-auto max-w-7xl px-4 min-h-[90vh] flex items-center">
          <div className="w-full text-center space-y-8">
            {/* Badge */}
            <p className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-[12px] font-small text-[#7e7c7b] bg-white/60 border-1">
              Pharma shipment data platform
            </p>

            {/* Main Heading */}
            <h1 className="text-balance text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight"
              style={{ color: '#0a0a0a' }}>
              Clear Visibility for Pharma <br /> Imports & Exports
            </h1>

            {/* Description */}
            <p className="!text-[15px] md:text-base max-w-2xl mx-auto text-[#7e7c7b]">
              Understand what you buy and sell, from which partners, and at what prices. Centralize records to drive
              smarter decisions across procurement and logistics.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <a href="#about"
                className="group inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-all duration-200">
                Learn More
              </a>
              <a href="#contact"
                className="group inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-black bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200">
                Contact Us
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="animate-fade-in-up delay-700 pt-8">
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#7e7c7b' }}>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  99.9% Uptime
                </div>
                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#7e7c7b' }}>
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  SOC 2 Compliant
                </div>
                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#7e7c7b' }}>
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  Enterprise Ready
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ABOUT */}
      <section id="about" className="bg-white py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Left Side - Dashboard Image */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight text-black mb-6">
                  About Us
                </h2>
                <p className="!text-[15px] md:text-base text-[#7e7c7b] leading-relaxed">
                  We bring clarity to pharmaceutical shipments by standardizing imports, exports, item quantities, and
                  pricing across every vendor and lane. With verifiable, audit-ready records, teams make faster, more
                  confident decisions for procurement, compliance, and logistics.
                </p>
              </div>

              {/* Key Features */}
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-medium font-medium text-black mb-1">Data Integrity</h3>
                    <p className="!text-[15px] md:text-base text-[#7e7c7b]">
                      Normalized schemas, strict validation, and deduplication for reliable analysis.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-medium font-medium text-black mb-1">End-to-End Visibility</h3>
                    <p className="!text-[15px] md:text-base text-[#7e7c7b]">
                      Track partners, lanes, costs, and timings in one verifiable source of truth.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-medium font-medium text-black mb-1">Compliance First</h3>
                    <p className="!text-[15px] md:text-base text-[#7e7c7b]">
                      Audit trails and field-level lineage to meet regulatory needs with confidence.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 p-8 shadow-xl border border-gray-200/50">
                {/* Browser-like header */}
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="h-6 bg-white rounded-md border border-gray-200 flex items-center px-3">
                      <div className="w-3 h-3 text-gray-400">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <span className="ml-2 text-xs text-gray-500">pharmaship.com/dashboard</span>
                    </div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="relative">
                  <img
                    src="/euro.png"
                    alt="Pharma Dashboard Preview"
                    className="w-full h-auto rounded-2xl shadow-lg"
                  />

                  {/* Overlay elements for dashboard feel */}
                  <div className="absolute top-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Live Dashboard
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-600">Real-time</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating stats cards */}
                <div className="absolute -right-4 top-1/4 bg-white rounded-xl shadow-lg p-4 border border-gray-100 transform rotate-3">
                  <div className="text-xs text-gray-500 mb-1">Total Shipments</div>
                  <div className="text-lg font-bold text-gray-900">2,847</div>
                  <div className="text-xs text-green-600">↗ +12.5%</div>
                </div>

                <div className="absolute -left-4 bottom-1/4 bg-white rounded-xl shadow-lg p-4 border border-gray-100 transform -rotate-2">
                  <div className="text-xs text-gray-500 mb-1">Data Accuracy</div>
                  <div className="text-lg font-bold text-gray-900">99.9%</div>
                  <div className="text-xs text-blue-600">Verified</div>
                </div>
              </div>

              {/* Subtle background elements */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-50 rounded-full opacity-30 blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-purple-50 rounded-full opacity-30 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home