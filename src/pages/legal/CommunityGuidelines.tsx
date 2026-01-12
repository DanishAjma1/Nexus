import React, { useEffect, useState } from "react";
import {
    Users,
    ArrowLeft,
    Heart,
    ShieldAlert,
    Sparkles,
    MessageSquare,
    ShieldCheck,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { motion } from "framer-motion";

export const CommunityGuidelines: React.FC = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        window.scrollTo(0, 0);
    }, []);

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const cardHover = {
        hover: {
            y: -8,
            boxShadow: "0 20px 40px rgba(5, 150, 105, 0.1)",
            transition: { duration: 0.3, ease: "easeInOut" }
        }
    };

    const iconScale = {
        hover: {
            scale: 1.1,
            transition: { duration: 0.2 }
        }
    };

    const principles = [
        {
            icon: <Heart />,
            title: "Be Respectful",
            description: "Treat all community members with professional courtesy. Harassment, hate speech, or discrimination of any kind will not be tolerated.",
            color: "text-rose-600",
            bgColor: "bg-rose-50",
            borderColor: "border-rose-100"
        },
        {
            icon: <ShieldAlert />,
            title: "Maintain Integrity",
            description: "Provide honest information about your projects, skills, and investment capacity. Misrepresentation undermines the trust our platform is built on.",
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-100"
        },
        {
            icon: <Sparkles />,
            title: "Focus on Innovation",
            description: "Our platform is dedicated to the AI sector. Keep discussions, projects, and investments relevant to building the future of technology.",
            color: "text-amber-600",
            bgColor: "bg-amber-50",
            borderColor: "border-amber-100"
        },
        {
            icon: <MessageSquare />,
            title: "In-App Communication",
            description: "For your security and record-keeping, all business communications must take place through TrustBridge's messaging system.",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-100"
        }
    ];

    const complianceSteps = [
        "Review process is handled by human moderators",
        "Confidential reporting mechanism",
        "Three-strike policy: 3 suspensions result in permanent block",
        "Zero tolerance for retaliation",
        "48-hour response time guarantee"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-200"
                >
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 px-8 py-12 text-white overflow-hidden">
                        {/* Animated background elements */}
                        <div className="absolute inset-0 overflow-hidden">
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-64 h-64 bg-white/5 rounded-full"
                                    initial={{
                                        x: Math.random() * 100 - 50,
                                        y: Math.random() * 100 - 50,
                                        scale: 0
                                    }}
                                    animate={{
                                        scale: [0, 1, 0],
                                        opacity: [0, 0.1, 0]
                                    }}
                                    transition={{
                                        duration: 4,
                                        delay: i * 0.5,
                                        repeat: Infinity,
                                        repeatDelay: 2
                                    }}
                                />
                            ))}
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

                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="relative z-10"
                        >
                            <motion.div
                                variants={fadeInUp}
                                className="flex items-center gap-6 mb-6"
                            >
                                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                                    <Users size={40} />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold mb-2">Community Guidelines</h1>
                                    <p className="text-emerald-100 text-lg italic">
                                        Building a trusted ecosystem for AI innovation
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                variants={fadeInUp}
                                className="flex items-center gap-4 text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={16} />
                                    <span>Enterprise-grade security</span>
                                </div>
                                <div className="w-1 h-1 bg-white/50 rounded-full" />
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} />
                                    <span>Industry compliance</span>
                                </div>
                                <div className="w-1 h-1 bg-white/50 rounded-full" />
                                <div className="flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    <span>Professional standards</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Content */}
                    <div className="p-8 sm:p-12 space-y-12 text-gray-700">
                        <motion.section
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-center max-w-3xl mx-auto pb-12 pt-6"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-6">
                                <Sparkles size={16} />
                                Our Mission Statement
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                Fostering Trust in AI Innovation
                            </h2>
                            <p className="text-lg leading-relaxed text-gray-600">
                                TrustBridge AI is committed to creating a secure, transparent environment where
                                breakthrough artificial intelligence solutions can connect with the right partners,
                                investors, and collaborators. Our guidelines ensure every interaction upholds the
                                highest standards of professional conduct.
                            </p>
                        </motion.section>

                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {principles.map((principle, index) => (
                                <motion.div
                                    key={index}
                                    variants={{ ...fadeInUp, ...cardHover }}
                                    whileHover="hover"
                                    className={`p-8 ${principle.bgColor} rounded-2xl border ${principle.borderColor} transition-all duration-300 cursor-default`}
                                >
                                    <div className="flex items-start gap-4 mb-5">
                                        <motion.div
                                            variants={iconScale}
                                            className={`p-3 rounded-xl ${principle.bgColor} border ${principle.borderColor}`}
                                        >
                                            <div className={principle.color}>
                                                {principle.icon}
                                            </div>
                                        </motion.div>
                                        <div>
                                            <h3 className="font-bold text-xl text-gray-900 mb-2">
                                                {principle.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {principle.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-5 border-t border-gray-100">
                                        <span className={`text-xs font-semibold ${principle.color} uppercase tracking-wider`}>
                                            Core Principle {index + 1}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Compliance Section */}
                        <motion.section
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                            className="bg-gradient-to-br from-emerald-50 to-blue-50 p-10 rounded-3xl border border-emerald-100 shadow-inner"
                        >
                            <div className="max-w-4xl mx-auto">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-3 bg-emerald-100 rounded-xl">
                                        <ShieldCheck size={28} className="text-emerald-700" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            Compliance & Reporting
                                        </h2>
                                        <p className="text-emerald-700 font-medium">
                                            Professional conduct monitoring
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Reporting Protocol
                                        </h3>
                                        <p className="text-gray-600 mb-6 leading-relaxed">
                                            Our dedicated compliance team ensures swift and confidential handling
                                            of all reported violations. All reports are treated with utmost
                                            professionalism and discretion.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Our Process
                                        </h3>
                                        <ul className="space-y-4">
                                            {complianceSteps.map((step, index) => (
                                                <motion.li
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.7 + (index * 0.1) }}
                                                    className="flex items-center gap-3"
                                                >
                                                    <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                                        <span className="text-emerald-700 font-bold text-sm">
                                                            {index + 1}
                                                        </span>
                                                    </div>
                                                    <span className="text-gray-700">{step}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        {/* Commitment Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="text-center py-12"
                        >
                            <div className="max-w-2xl mx-auto">
                                <div className="w-16 h-1 bg-emerald-500 mx-auto mb-8 rounded-full" />
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                    Our Commitment to Excellence
                                </h3>
                                <p className="text-gray-600 mb-8 leading-relaxed">
                                    By participating in the TrustBridge AI community, you contribute to
                                    elevating professional standards across the artificial intelligence industry.
                                    Together, we're building the foundation for responsible AI development.
                                </p>

                                <motion.div
                                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                >
                                    <Button
                                        onClick={() => navigate(-1)}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Acknowledge and Return
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                                        onClick={() => window.print()}
                                    >
                                        Download Guidelines (PDF)
                                    </Button>
                                </motion.div>

                                <p className="text-sm text-gray-500 mt-8 pt-8 border-t border-gray-100">
                                    Last updated: {new Date().toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};