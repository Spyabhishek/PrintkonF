import { Link } from "react-router-dom";
import companyInfo from "../../../shared/config/companyInfo";
import useScrollToTop from "../../../shared/hooks/useScrollToTop";

const RefundPolicy = () => {
    useScrollToTop();
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 sm:p-12 relative overflow-hidden">
                    {/* Decorative Gradient Accents */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-tr from-red-500/20 to-purple-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-bl from-red-400/20 to-purple-400/10 rounded-full blur-3xl" />

                    {/* Header */}
                    <header className="relative text-center mb-10">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                            Refund & Cancellation Policy
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Last updated:{" "}
                            <span className="font-medium text-blue-600 dark:text-blue-400">
                                {new Date().toLocaleDateString()}
                            </span>
                        </p>
                        <div className="mt-6 h-1 w-32 mx-auto bg-gradient-to-r from-red-500 to-purple-500 rounded-full"></div>
                    </header>

                    {/* Body */}
                    <article className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed space-y-8">
                        {/* 🔴 Quick Summary in Red */}
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-8 shadow-sm">
                            <h3 className="text-red-800 dark:text-red-300 font-semibold mb-3">
                                Quick Summary
                            </h3>
                            <ul className="text-red-700 dark:text-red-400 space-y-1">
                                <li>• Full refund if order cancelled before production starts</li>
                                <li>• 50% refund if cancelled during production</li>
                                <li>• No refund after production completion</li>
                                <li>• Free reprint for quality issues</li>
                            </ul>
                        </div>

                        <Section title="1. Order Cancellation">
                            <Subsection title="1.1 Before Production">
                                <p>
                                    You may cancel your order for a full refund if we haven't
                                    started the production process. Production typically begins
                                    within 2–4 hours of order confirmation during business hours.
                                </p>
                            </Subsection>

                            <Subsection title="1.2 During Production">
                                <p>
                                    If cancellation is requested after production has started but
                                    before completion, we will refund 50% of the order value to
                                    cover material and setup costs.
                                </p>
                            </Subsection>

                            <Subsection title="1.3 After Production">
                                <p>
                                    Orders cannot be cancelled once production is complete. Custom
                                    printed products are made specifically for you and cannot be
                                    resold.
                                </p>
                            </Subsection>
                        </Section>

                        <Section title="2. Refund Eligibility">
                            <Subsection title="2.1 Quality Issues">
                                <p>
                                    We stand behind the quality of our work. If you receive
                                    defective or damaged products:
                                </p>
                                <List
                                    items={[
                                        "Contact us within 7 days of delivery",
                                        "Provide photos of the issue",
                                        "We will arrange a free reprint or full refund",
                                    ]}
                                />
                            </Subsection>

                            <Subsection title="2.2 Shipping Errors">
                                <p>
                                    If we ship the wrong items or incorrect quantities, we will
                                    cover return shipping and provide the correct replacement at
                                    no additional cost.
                                </p>
                            </Subsection>

                            <Subsection title="2.3 Non-Refundable Situations">
                                <List
                                    items={[
                                        "Customer-provided design errors",
                                        "Color variations due to monitor differences",
                                        "Change of mind after production",
                                        "Files not meeting our specifications",
                                        "Rush orders cancelled after processing",
                                    ]}
                                />
                            </Subsection>
                        </Section>

                        <Section title="3. Refund Process">
                            <Subsection title="3.1 How to Request">
                                <p>To request a refund or cancellation:</p>
                                <ol className="list-decimal list-inside space-y-1">
                                    <li>
                                        Email us at{" "}
                                        <span className="font-medium text-red-600 dark:text-red-400">
                                            {companyInfo.contact.email}
                                        </span>{" "}
                                        with your order number
                                    </li>
                                    <li>
                                        Call us at{" "}
                                        <span className="font-medium text-red-600 dark:text-red-400">
                                            {companyInfo.contact.phone}
                                        </span>{" "}
                                        during business hours
                                    </li>
                                    <li>Use the contact form on our website</li>
                                </ol>
                            </Subsection>

                            <Subsection title="3.2 Processing Time">
                                <List
                                    items={[
                                        "Refund requests are processed within 3–5 business days",
                                        "Credit card refunds appear in 7–10 business days",
                                        "Bank transfers may take 10–15 business days",
                                    ]}
                                />
                            </Subsection>
                        </Section>

                        <Section title="4. File Approval Responsibility">
                            <p>
                                By approving your files for production, you accept responsibility
                                for:
                            </p>
                            <List
                                items={[
                                    "Spelling and grammatical errors",
                                    "Design layout and composition",
                                    "Image resolution and quality",
                                    "Color choices and specifications",
                                    "File format and compatibility",
                                ]}
                            />
                        </Section>

                        <Section title="5. Production Timeline">
                            <p>
                                Standard production times vary by product type. Rush orders are
                                non-refundable once accepted. We are not liable for delays caused
                                by:
                            </p>
                            <List
                                items={[
                                    "Weather conditions or natural disasters",
                                    "Supplier delays or material shortages",
                                    "Technical issues or power outages",
                                    "Customs clearance for international orders",
                                ]}
                            />
                        </Section>

                        <Section title="6. Contact for Refunds">
                            <div className="bg-red-50 dark:bg-gray-700/50 p-6 rounded-2xl shadow-inner mt-4 space-y-1">
                                <p>
                                    <strong>Refund Requests:</strong> {companyInfo.contact.email}
                                </p>
                                <p>
                                    <strong>Phone Support:</strong> {companyInfo.contact.phone}
                                </p>
                                <p>
                                    <strong>Business Hours:</strong> Monday–Saturday, 9:00 AM – 6:00 PM IST
                                </p>
                                <p>
                                    <strong>Address:</strong> {companyInfo.contact.address}
                                </p>
                            </div>

                            <div className="mt-6 p-5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl shadow-sm">
                                <p className="text-yellow-800 dark:text-yellow-300">
                                    <strong>Note:</strong> This policy complies with Indian consumer
                                    protection laws. Some conditions may vary for international
                                    orders.
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

// Reusable components for consistent design
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

export default RefundPolicy;
