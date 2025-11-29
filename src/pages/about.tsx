const About = () => {
  return (
    <section id="about" className="bg-white py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Left Side - Dashboard Image */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight text-[#1E293B] mb-6">
                About Us
              </h2>
              <p className="!text-[15px] md:text-base text-[#1E293B] leading-relaxed">
                We bring clarity to pharmaceutical shipments by standardizing imports, exports, item quantities, and
                pricing across every vendor and lane. With verifiable, audit-ready records, teams make faster, more
                confident decisions for procurement, compliance, and logistics.
              </p>
            </div>

            {/* Key Features */}
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-[#C7D2FE] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-[#1E3A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-medium font-medium text-[#1E293B] mb-1">Data Integrity</h3>
                  <p className="!text-[15px] md:text-base text-[#1E293B]">
                    Normalized schemas, strict validation, and deduplication for reliable analysis.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-[#C7D2FE] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-[#1E3A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-medium font-medium text-[#1E293B] mb-1">End-to-End Visibility</h3>
                  <p className="!text-[15px] md:text-base text-[#1E293B]">
                    Track partners, lanes, costs, and timings in one verifiable source of truth.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-[#C7D2FE] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-[#1E3A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-medium font-medium text-[#1E293B] mb-1">Compliance First</h3>
                  <p className="!text-[15px] md:text-base text-[#1E293B]">
                    Audit trails and field-level lineage to meet regulatory needs with confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="relative">
            {/* Main Image Container */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#EEF2FF] to-[#C7D2FE] p-8 shadow-xl border border-[#60A5FA]/30">
              {/* Browser-like header */}
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#C7D2FE]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-6 bg-white rounded-md border border-[#C7D2FE] flex items-center px-3">
                    <div className="w-3 h-3 text-[#1E3A8A]">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <span className="ml-2 text-xs text-[#1E293B]">pharmaship.com/dashboard</span>
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="relative">
                <img
                  src="/dashboard.png"
                  alt="Pharma Dashboard Preview"
                  className="w-full h-auto rounded-2xl shadow-lg"
                />

                {/* Overlay elements for dashboard feel */}
                <div className="absolute top-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <div className="bg-[#3B82F6] text-white px-3 py-1 rounded-full text-xs font-medium">
                      Live Dashboard
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-[#1E293B]">Real-time</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating stats cards */}
              <div className="absolute -right-4 top-1/4 bg-white rounded-xl shadow-lg p-4 border border-[#C7D2FE] transform rotate-3">
                <div className="text-xs text-[#1E293B] mb-1">Total Shipments</div>
                <div className="text-lg font-bold text-[#1E293B]">2,847</div>
                <div className="text-xs text-green-600">↗ +12.5%</div>
              </div>

              <div className="absolute -left-4 bottom-1/4 bg-white rounded-xl shadow-lg p-4 border border-[#C7D2FE] transform -rotate-2">
                <div className="text-xs text-[#1E293B] mb-1">Data Accuracy</div>
                <div className="text-lg font-bold text-[#1E293B]">99.9%</div>
                <div className="text-xs text-[#3B82F6]">Verified</div>
              </div>
            </div>

            {/* Subtle background elements */}
            <div className="hidden sm:block absolute -top-8 -right-8 w-32 h-32 bg-[#C7D2FE] rounded-full opacity-30 blur-xl"></div>
            <div className="hidden sm:block absolute -bottom-8 -left-8 w-40 h-40 bg-[#60A5FA] rounded-full opacity-30 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About