import { Link } from "react-router-dom";
import companyInfo from "../../../shared/config/companyInfo";
import useScrollToTop from "../../../shared/hooks/useScrollToTop";

const PrivacyPolicy = () => {
    useScrollToTop();
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 sm:p-12 relative overflow-hidden">
                    {/* Decorative gradient orbs */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-tr from-red-500/20 to-purple-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-bl from-red-400/20 to-purple-400/10 rounded-full blur-3xl" />

                    {/* Header */}
                    <header className="relative text-center mb-10">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                            Privacy Policy
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Last updated:{" "}
                            <span className="font-medium text-blue-600 dark:text-blue-400">
                                {new Date().toLocaleDateString()}
                            </span>
                        </p>
                        <div className="mt-6 h-1 w-32 mx-auto bg-gradient-to-r from-red-500 to-purple-500 rounded-full"></div>
                    </header>

                    {/* Quick Summary */}
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-8 shadow-sm">
                        <h3 className="text-red-800 dark:text-red-300 font-semibold mb-3">
                            Quick Summary
                        </h3>
                        <ul className="text-red-700 dark:text-red-400 space-y-1">
                            <li>• We collect data to process orders and improve services</li>
                            <li>• Your printing files are kept confidential and encrypted</li>
                            <li>• We never sell your personal data to third parties</li>
                            <li>• You can request deletion or correction of your data anytime</li>
                            <li>• Cookies are used only for analytics and personalization</li>
                        </ul>
                    </div>

                    {/* Main Content */}
                    <article className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed space-y-8">
                        <Section title="1. Information We Collect">
                            <Subsection title="1.1 Personal Information">
                                <List
                                    items={[
                                        "Contact details (name, email, phone number)",
                                        "Billing and shipping addresses",
                                        "Payment information (processed securely)",
                                        "Business details (company name, GST if applicable)",
                                    ]}
                                />
                            </Subsection>

                            <Subsection title="1.2 Printing Files and Content">
                                <List
                                    items={[
                                        "Design files uploaded for printing",
                                        "Print specifications and job details",
                                        "Artwork and creative content",
                                    ]}
                                />
                            </Subsection>

                            <Subsection title="1.3 Technical Information">
                                <List
                                    items={[
                                        "IP address, browser, and device information",
                                        "Usage analytics and site behavior data",
                                        "Cookies and tracking identifiers",
                                    ]}
                                />
                            </Subsection>
                        </Section>

                        <Section title="2. How We Use Your Information">
                            <List
                                items={[
                                    "To process and fulfill print orders",
                                    "To provide customer support and communication",
                                    "To improve our website and services",
                                    "To send marketing emails (with your consent)",
                                    "To meet legal and security requirements",
                                ]}
                            />
                        </Section>

                        <Section title="3. File Storage and Confidentiality">
                            <p>
                                We understand that your printing files may contain sensitive
                                information. We ensure strict confidentiality:
                            </p>
                            <List
                                items={[
                                    "Files are stored securely on encrypted servers",
                                    "Access is restricted to authorized staff only",
                                    "Files are auto-deleted after 90 days (unless requested sooner)",
                                    "We never share files with third parties except for order fulfillment",
                                ]}
                            />
                        </Section>

                        <Section title="4. Data Sharing and Disclosure">
                            <p>
                                We may share your information only with trusted partners and
                                agencies:
                            </p>
                            <List
                                items={[
                                    "Payment processors (for transactions)",
                                    "Shipping partners (for delivery)",
                                    "Legal authorities (when required by law)",
                                    "Service providers (for operational support)",
                                ]}
                            />
                        </Section>

                        <Section title="5. Your Rights">
                            <p>You have full control over your personal data, including the right to:</p>
                            <List
                                items={[
                                    "Access and review stored data",
                                    "Request corrections or updates",
                                    "Request deletion of your account and data",
                                    "Opt out of promotional emails",
                                    "Withdraw previously given consent",
                                ]}
                            />
                        </Section>

                        <Section title="6. Data Security">
                            <p>
                                We use industry-standard encryption, firewalls, and access
                                control systems to safeguard your data from unauthorized access,
                                alteration, or misuse.
                            </p>
                        </Section>

                        <Section title="7. Cookies and Tracking">
                            <p>
                                We use cookies to personalize user experience and analyze
                                traffic. You can control cookie settings through your browser.
                            </p>
                        </Section>

                        <Section title="8. International Data Transfers">
                            <p>
                                Your data may be processed and stored in India. By using our
                                services, you consent to such processing and storage.
                            </p>
                        </Section>

                        <Section title="9. Children's Privacy">
                            <p>
                                Our services are not intended for individuals under 16 years of
                                age. We do not knowingly collect data from children.
                            </p>
                        </Section>

                        <Section title="10. Changes to This Policy">
                            <p>
                                This Privacy Policy may be updated periodically. Major changes
                                will be notified via email or on our website.
                            </p>
                        </Section>

                        <Section title="11. Contact Us">
                            <p>If you have questions about our Privacy Policy, contact us at:</p>
                            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-2xl shadow-inner">
                                <p>
                                    <strong>Email:</strong>{" "}
                                    <span className="text-red-600 dark:text-red-400">
                                        {companyInfo.contact.email}
                                    </span>
                                </p>
                                <p>
                                    <strong>Phone:</strong>{" "}
                                    <span className="text-red-600 dark:text-red-400">
                                        {companyInfo.contact.phone}
                                    </span>
                                </p>
                                <p>
                                    <strong>Address:</strong> {companyInfo.contact.address}
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
        <div className="pl-3 border-l-4 border-red-500/60 space-y-3">{children}</div>
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

export default PrivacyPolicy;
