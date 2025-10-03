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
      <section id="about" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-balance">About Us</h2>
              <p className="mt-3 text-muted-foreground text-pretty">
                We bring clarity to pharmaceutical shipments by standardizing imports, exports, item quantities, and
                pricing across every vendor and lane. With verifiable, audit-ready records, teams make faster, more
                confident decisions for procurement, compliance, and logistics.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Pillar</div>
                <div className="mt-1 font-medium">Data Integrity</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Normalized schemas, strict validation, and deduplication for reliable analysis.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Pillar</div>
                <div className="mt-1 font-medium">End-to-End Visibility</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Track partners, lanes, costs, and timings in one verifiable source of truth.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Pillar</div>
                <div className="mt-1 font-medium">Compliance First</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Audit trails and field-level lineage to meet regulatory needs with confidence.
                </p>
              </div>
            </div>

            <div className="rounded-lg border p-4 bg-background">
              <div className="font-medium">How it works</div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">Step 1</div>
                  <div className="mt-1 font-medium">Ingest</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Import vendor files, PDFs, and spreadsheets—automatically parsed and validated.
                  </p>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">Step 2</div>
                  <div className="mt-1 font-medium">Standardize</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Harmonize units, currencies, and product references across all lanes.
                  </p>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">Step 3</div>
                  <div className="mt-1 font-medium">Analyze</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Surface costs, outliers, and performance trends to inform negotiations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home