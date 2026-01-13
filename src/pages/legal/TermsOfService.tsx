import React, { useEffect, useState } from "react";
import { Shield, FileText, AlertCircle, CheckCircle, Lock, Globe, Users, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { motion } from "framer-motion";

export const TermsOfService: React.FC = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" as any }
        }
    };

    const sectionStagger = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const cardHover = {
        hover: {
            y: -4,
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.08)",
            transition: { duration: 0.3 }
        }
    };


    const pulseAnimation = {
        initial: { scale: 1 },
        pulse: {
            scale: [1, 1.02, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
            }
        }
    };

    const termsSections = [
        {
            id: "acceptance",
            number: "1",
            title: "Acceptance of Terms",
            icon: <CheckCircle size={20} />,
            content: "By accessing and using TrustBridge AI (the 'Platform'), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform. TrustBridge AI is a professional networking and crowdfunding platform designed for entrepreneurs and investors in the AI ecosystem.",
            important: true
        },
        {
            id: "eligibility",
            number: "2",
            title: "User Eligibility and Registration",
            icon: <Users size={20} />,
            content: "To use the Platform, you must be at least 18 years old and capable of forming a binding contract. You agree to provide accurate, current, and complete information during the registration process.",
            bullets: [
                "Entrepreneurs must represent a legitimate business entity.",
                "Investors must confirm their status as accredited or sophisticated investors where required by law.",
                "You are responsible for maintaining the confidentiality of your account credentials."
            ]
        },
        {
            id: "fees",
            number: "3",
            title: "Platform Fees and Payments",
            icon: <Building size={20} />,
            content: "TrustBridge AI may charge fees for certain services, including but not limited to, successful fundraising campaigns. All fees are clearly disclosed prior to use. Payments are processed through secure third-party providers."
        },
        {
            id: "ip",
            number: "4",
            title: "Intellectual Property",
            icon: <FileText size={20} />,
            content: "All content on the Platform, including logos, text, and software, is the property of TrustBridge AI or its licensors. You retain ownership of any content you upload, but you grant TrustBridge AI a non-exclusive license to display and process that content."
        },
        {
            id: "liability",
            number: "5",
            title: "Limitation of Liability",
            icon: <AlertCircle size={20} />,
            content: "TrustBridge AI is a facilitator and does not guarantee the success of any investment or partnership. Users are solely responsible for conducting their own due diligence. To the maximum extent permitted by law, TrustBridge AI shall not be liable for any indirect, incidental, or consequential damages.",
            important: true
        },
        {
            id: "termination",
            number: "6",
            title: "Termination and Suspension",
            icon: <Lock size={20} />,
            content: "We reserve the right to suspend or terminate your account for violations of these Terms. Our enforcement policy includes a 'Three-Strike' rule: receiving three separate account suspensions will result in a permanent block from the Platform without further notice.",
            important: true
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-200"
                >
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 px-8 py-12 text-white overflow-hidden">
                        {/* Animated background */}
                        <div className="absolute inset-0">
                            <motion.div
                                className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.1, 0.05, 0.1]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </div>

                        {/* <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            onClick={() => navigate(-1)}
                            className="absolute top-8 left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all active:scale-95 group"
                            whileHover={{ x: -5 }}
                        >
                            <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                        </motion.button> */}

                        <div className="relative z-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center gap-6 mb-6"
                            >
                                <motion.div
                                    className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20"
                                    whileHover={{ rotate: 5, scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Shield size={40} />
                                </motion.div>
                                <div>
                                    <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
                                    <div className="flex items-center gap-4 text-primary-100">
                                        <div className="flex items-center gap-2">
                                            <Globe size={16} />
                                            <span>Global Compliance</span>
                                        </div>
                                        <div className="w-1 h-1 bg-white/50 rounded-full" />
                                        <span className="italic">Effective January 12, 2026</span>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-wrap gap-4 mt-6"
                            >
                                <div className="px-4 py-2 bg-white/10 rounded-full text-sm backdrop-blur-sm border border-white/20">
                                    Legal Document
                                </div>
                                <div className="px-4 py-2 bg-white/10 rounded-full text-sm backdrop-blur-sm border border-white/20">
                                    Binding Agreement
                                </div>
                                <div className="px-4 py-2 bg-white/10 rounded-full text-sm backdrop-blur-sm border border-white/20">
                                    Professional Platform
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Quick Navigation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="border-b border-gray-200 bg-gray-50 px-8 py-4"
                    >
                        <div className="flex flex-wrap gap-2">
                            {termsSections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => {
                                        const element = document.getElementById(section.id);
                                        element?.scrollIntoView({ behavior: 'smooth' });
                                        setActiveSection(section.id);
                                    }}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeSection === section.id
                                        ? 'bg-primary-100 text-primary-700 border border-primary-200'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    {section.number}. {section.title}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Content */}
                    <div className="p-8 sm:p-12">
                        <motion.div
                            variants={sectionStagger}
                            initial="hidden"
                            animate="visible"
                            className="space-y-10"
                        >
                            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-12">
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    These Terms of Service govern your access to and use of TrustBridge AI's professional networking and crowdfunding platform. By accessing our services, you agree to these terms on behalf of yourself or your organization.
                                </p>
                            </motion.div>

                            {termsSections.map((section) => (
                                <motion.section
                                    key={section.id}
                                    id={section.id}
                                    variants={{ ...fadeInUp, ...cardHover }}
                                    onViewportEnter={() => setActiveSection(section.id)}
                                    viewport={{ once: true, margin: "-100px" }}
                                    whileHover="hover"
                                    className={`p-8 rounded-2xl border transition-all duration-300 cursor-default ${section.important
                                        ? 'bg-amber-50 border-amber-200 shadow-sm'
                                        : 'bg-gray-50 border-gray-200'
                                        }`}
                                >
                                    <div className="flex items-start gap-6 mb-6">
                                        <motion.div
                                            className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${section.important
                                                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                                : 'bg-primary-100 text-primary-700 border border-primary-200'
                                                }`}
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                        >
                                            <span className="font-bold text-lg">{section.number}</span>
                                        </motion.div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h2 className="text-2xl font-bold text-gray-900">
                                                    {section.title}
                                                </h2>
                                                {section.important && (
                                                    <motion.span
                                                        variants={pulseAnimation}
                                                        initial="initial"
                                                        animate="pulse"
                                                        className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full border border-amber-200"
                                                    >
                                                        Important
                                                    </motion.span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 leading-relaxed">
                                                {section.content}
                                            </p>
                                        </div>
                                    </div>

                                    {section.bullets && (
                                        <motion.ul
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="pl-6 space-y-3 mt-4"
                                        >
                                            {section.bullets.map((bullet, idx) => (
                                                <motion.li
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="flex items-start gap-3 text-gray-700"
                                                >
                                                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary-500 mt-2" />
                                                    <span>{bullet}</span>
                                                </motion.li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </motion.section>
                            ))}

                            {/* Important Notice */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="bg-gradient-to-r from-primary-50 to-blue-50 p-8 rounded-2xl border border-primary-200"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-primary-100 rounded-xl">
                                        <AlertCircle size={24} className="text-primary-700" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Legal Disclaimer</h3>
                                        <p className="text-primary-700 font-medium">
                                            Professional advice required
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    This document does not constitute legal advice. We strongly recommend consulting with legal counsel to understand how these terms apply to your specific situation. For questions regarding your obligations under these terms, please contact your legal advisor.
                                </p>
                            </motion.div>

                            {/* Contact & Action */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="pt-12 border-t border-gray-200"
                            >
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-gray-900">Need Assistance?</h3>
                                        <p className="text-gray-600">
                                            Our legal team is available to answer questions about these terms and their application to your use of TrustBridge AI.
                                        </p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <span className="font-semibold">Email:</span>
                                                <a href="mailto:aitrustbridge@gmail.com" className="text-primary-600 hover:text-primary-700 underline">
                                                    aitrustbridge@gmail.com
                                                </a>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-end">
                                        <Button
                                            onClick={() => navigate(-1)}
                                            variant="outline"
                                            className="border-gray-300 hover:bg-gray-50"
                                        >
                                            Return to Platform
                                        </Button>
                                        <Button
                                            className="bg-primary-600 hover:bg-primary-700"
                                            onClick={() => window.print()}
                                        >
                                            Download PDF
                                        </Button>
                                    </div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="mt-8 pt-8 border-t border-gray-200 text-center"
                                >
                                    <p className="text-sm text-gray-500">
                                        © 2026 TrustBridge AI. All rights reserved.
                                    </p>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};