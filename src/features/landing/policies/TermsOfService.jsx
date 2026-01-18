import { Link } from "react-router-dom";
import companyInfo from "../../../shared/config/companyInfo";
import useScrollToTop from "../../../shared/hooks/useScrollToTop";

const TermsOfService = () => {
    useScrollToTop();
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 sm:p-12 relative overflow-hidden">
                    {/* Gradient Accents */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-tr from-red-500/20 to-purple-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-bl from-red-400/20 to-purple-400/10 rounded-full blur-3xl" />

                    {/* Header */}
                    <header className="relative text-center mb-10">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                            Terms of Service
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Last updated:{" "}
                            <span className="font-medium text-blue-600 dark:text-blue-400">
                                {new Date().toLocaleDateString()}
                            </span>
                        </p>
                        <div className="mt-6 h-1 w-32 mx-auto bg-gradient-to-r from-red-500 to-purple-500 rounded-full"></div>
                    </header>

                    {/* Quick Summary in Red */}
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-8 shadow-sm">
                        <h3 className="text-red-800 dark:text-red-300 font-semibold mb-3">
                            Quick Summary
                        </h3>
                        <ul className="text-red-700 dark:text-red-400 space-y-1">
                            <li>• You must be 18+ and legally capable to use our services</li>
                            <li>• Payment is required before production starts</li>
                            <li>• You are responsible for file accuracy and legality</li>
                            <li>• We aren’t liable for shipping delays or indirect damages</li>
                            <li>• By using our services, you accept these terms fully</li>
                        </ul>
                    </div>

                    {/* Main Content */}
                    <article className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed space-y-8">
                        <Section title="1. Acceptance of Terms">
                            <p>
                                By placing an order with{" "}
                                <strong>{companyInfo.name}</strong>, you confirm that you are at
                                least 18 years old and legally capable of entering into binding
                                agreements. These terms constitute a legal contract between you
                                and {companyInfo.name}.
                            </p>
                        </Section>

                        <Section title="2. Services Description">
                            <p>
                                {companyInfo.name} provides professional custom printing
                                services, including but not limited to:
                            </p>
                            <List
                                items={[
                                    "Business cards, brochures, and stationery",
                                    "Marketing and promotional materials",
                                    "Large-format prints and banners",
                                    "Packaging and label printing",
                                    "Custom apparel and merchandise",
                                ]}
                            />
                        </Section>

                        <Section title="3. Order Process">
                            <Subsection title="3.1 Placing Orders">
                                <p>
                                    Orders can be placed through our website or via direct
                                    communication. Ensure accurate shipping details, contact
                                    information, and payment credentials.
                                </p>
                            </Subsection>

                            <Subsection title="3.2 File Submission">
                                <p>You are responsible for ensuring that your files:</p>
                                <List
                                    items={[
                                        "Meet format and resolution requirements",
                                        "Do not contain prohibited or illegal material",
                                        "Do not infringe any intellectual property rights",
                                        "Are free from malware or viruses",
                                    ]}
                                />
                            </Subsection>

                            <Subsection title="3.3 Order Confirmation">
                                <p>
                                    Orders are confirmed only after payment and file approval. We
                                    reserve the right to refuse or cancel any order at our
                                    discretion.
                                </p>
                            </Subsection>
                        </Section>

                        <Section title="4. Pricing and Payment">
                            <Subsection title="4.1 Pricing">
                                <p>
                                    All prices are in Indian Rupees (₹). Prices may change without
                                    prior notice; however, confirmed orders are honored at the
                                    quoted rate.
                                </p>
                            </Subsection>

                            <Subsection title="4.2 Payment Terms">
                                <List
                                    items={[
                                        "Full payment is required before production begins",
                                        "Accepted modes: Credit/Debit cards, UPI, Net Banking",
                                        "Taxes and shipping are extra unless stated",
                                        "Rush orders may incur additional fees",
                                    ]}
                                />
                            </Subsection>
                        </Section>

                        <Section title="5. Intellectual Property">
                            <Subsection title="5.1 Your Content">
                                <p>
                                    You retain ownership of your submitted designs. By uploading
                                    them, you grant us a limited license to process, reproduce, and
                                    print your content solely to fulfill your order.
                                </p>
                            </Subsection>

                            <Subsection title="5.2 Prohibited Content">
                                <List
                                    items={[
                                        "Copyrighted or trademarked material without permission",
                                        "Obscene, defamatory, or illegal content",
                                        "Violent or hate-promoting designs",
                                        "Content violating privacy or publicity rights",
                                    ]}
                                />
                            </Subsection>
                        </Section>

                        <Section title="6. Shipping and Delivery">
                            <Subsection title="6.1 Shipping Methods">
                                <p>
                                    We partner with trusted courier services. Delivery times are
                                    estimated and not guaranteed. International orders may face
                                    customs delays or additional duties.
                                </p>
                            </Subsection>

                            <Subsection title="6.2 Risk of Loss">
                                <p>
                                    Once handed over to the carrier, responsibility for loss or
                                    damage transfers to you. We are not liable for delays caused
                                    by third parties.
                                </p>
                            </Subsection>

                            <Subsection title="6.3 Delivery Issues">
                                <p>
                                    Report any delivery issue within 48 hours of expected delivery
                                    for assistance in resolving with the carrier.
                                </p>
                            </Subsection>
                        </Section>

                        <Section title="7. Warranties and Liabilities">
                            <Subsection title="7.1 Service Warranty">
                                <p>
                                    We guarantee professional quality and workmanship. If an error
                                    occurs on our part, we will reprint or reperform the service at
                                    no additional charge.
                                </p>
                            </Subsection>

                            <Subsection title="7.2 Limitation of Liability">
                                <p>
                                    Our total liability will not exceed the order value in
                                    question. We are not liable for indirect or consequential
                                    losses.
                                </p>
                            </Subsection>
                        </Section>

                        <Section title="8. User Responsibilities">
                            <List
                                items={[
                                    "Provide accurate and complete information",
                                    "Review all files before production",
                                    "Maintain confidentiality of your account",
                                    "Comply with applicable laws",
                                    "Use our services for lawful purposes only",
                                ]}
                            />
                        </Section>

                        <Section title="9. Termination">
                            <p>
                                We may suspend or terminate access if you violate these terms.
                                You may terminate your account anytime by contacting us.
                            </p>
                        </Section>

                        <Section title="10. Governing Law">
                            <p>
                                These terms are governed by the laws of India. Disputes will be
                                handled in the courts of Hajipur, Bihar.
                            </p>
                        </Section>

                        <Section title="11. Changes to Terms">
                            <p>
                                We may update these terms periodically. Continued use of our
                                services implies acceptance of any revisions.
                            </p>
                        </Section>

                        <Section title="12. Contact Information">
                            <div className="bg-red-50 dark:bg-gray-700/50 p-6 rounded-2xl shadow-inner space-y-1">
                                <p>
                                    <strong>{companyInfo.name}</strong>
                                </p>
                                <p>{companyInfo.contact.address}</p>
                                <p>
                                    Email:{" "}
                                    <span className="text-red-500 dark:text-red-400 font-medium">
                                        {companyInfo.contact.email}
                                    </span>
                                </p>
                                <p>
                                    Phone:{" "}
                                    <span className="text-red-500 dark:text-red-400 font-medium">
                                        {companyInfo.contact.phone}
                                    </span>
                                </p>
                            </div>

                            <div className="mt-6 p-5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl shadow-sm">
                                <p className="text-yellow-800 dark:text-yellow-300">
                                    By using our services, you acknowledge that you have read,
                                    understood, and agree to be bound by these Terms of Service.
                                </p>
                            </div>
                        </Section>
                    </article>

                    {/* Footer */}
                    <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline hover:scale-105 transition-transform"
                        >
                            ← Back to Home
                        </Link>
                    </footer>
                </div>
            </div>
        </div>
    );
};

// ✅ Reusable Subcomponents
const Section = ({ title, children }) => (
    <section className="scroll-mt-16">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 mt-8">
            {title}
        </h2>
        <div className="pl-2 border-l-4 border-red-500/60 space-y-3">{children}</div>
    </section>
);

const Subsection = ({ title, children }) => (
    <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-2">
            {title}
        </h3>
        {children}
    </div>
);

const List = ({ items }) => (
    <ul className="list-disc list-inside space-y-1">
        {items.map((item, i) => (
            <li key={i}>{item}</li>
        ))}
    </ul>
);

export default TermsOfService;
