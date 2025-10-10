const Contact = () => {
    return (
        <section id="contact" className="bg-[#EEF2FF] py-12 md:py-16">
            <div className="mx-auto max-w-6xl px-4">
                <div className="grid gap-24 lg:grid-cols-2 items-center max-w-5xl mx-auto">
                    {/* Left Side - Contact Form */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight leading-tight text-[#1E293B] mb-4">
                                Contact Us
                            </h2>
                            <p className="!text-[15px] md:text-base text-[#1E293B] leading-relaxed">
                                Ready to transform your pharmaceutical supply chain? Get in touch with our team to learn how we can
                                help you achieve complete visibility and control over your shipments.
                            </p>
                        </div>

                        {/* Contact Form */}
                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-[#1E293B] mb-1">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your first name"
                                        className="w-full px-3 py-1.5 rounded-lg border border-[#C7D2FE] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-colors text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1E293B] mb-1">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your last name"
                                        className="w-full px-3 py-1.5 rounded-lg border border-[#C7D2FE] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-colors text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1E293B] mb-1">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="w-full px-3 py-1.5 rounded-lg border border-[#C7D2FE] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-colors text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1E293B] mb-1">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your company name"
                                    className="w-full px-3 py-1.5 rounded-lg border border-[#C7D2FE] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-colors text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1E293B] mb-1">
                                    Message
                                </label>
                                <textarea
                                    placeholder="Tell us about your requirements..."
                                    rows={3}
                                    className="w-full px-3 py-1.5 rounded-lg border border-[#C7D2FE] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-colors resize-none text-sm"
                                ></textarea>
                            </div>

                            <button className="w-full bg-[#3B82F6] text-white px-4 py-2.5 rounded-lg hover:bg-[#60A5FA] transition-all duration-200 text-sm font-medium">
                                Send Message
                            </button>
                        </div>
                    </div>

                    {/* Right Side - Visual Element */}
                    <div className="relative">
                        {/* Main Visual Container */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#EEF2FF] to-[#C7D2FE] p-6 shadow-lg border border-[#60A5FA]/30">
                            {/* Header */}
                            <div className="text-center mb-6">
                                <div className="w-12 h-12 bg-[#C7D2FE] rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8 text-[#1E3A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-[#1E293B] mb-2">Let's Talk</h3>
                                <p className="!text-[15px] md:text-base text-[#1E293B]">
                                    Schedule a demo and see how we can help optimize your pharma supply chain
                                </p>
                            </div>

                            {/* Benefits List */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="!text-[15px] md:text-base text-[#1E293B]">Free 30-minute consultation</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="!text-[15px] md:text-base text-[#1E293B]">Custom demo with your data</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="!text-[15px] md:text-base text-[#1E293B]">Implementation roadmap</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="!text-[15px] md:text-base text-[#1E293B]">ROI analysis & projections</span>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="mt-6 p-3 bg-white/80 rounded-xl border border-[#C7D2FE]">
                                <div className="text-center">
                                    <div className="text-sm font-medium text-[#1E293B] mb-1">Response Time</div>
                                    <div className="text-xs text-[#1E293B]">We typically respond within 2 hours</div>
                                </div>
                            </div>
                        </div>

                        {/* Floating elements */}
                        <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#C7D2FE] rounded-full opacity-30 blur-xl"></div>
                        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#60A5FA] rounded-full opacity-30 blur-xl"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contact