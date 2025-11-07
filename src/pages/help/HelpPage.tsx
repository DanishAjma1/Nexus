import React from "react";
import { Search, Book, MessageCircle, Phone, Mail, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

const faqs = [
  {
    question: "How do I connect with investors?",
    answer:
      "You can browse our investor directory and send connection requests. Once an investor accepts, you can start messaging them directly through our platform.",
  },
  {
    question: "What should I include in my startup profile?",
    answer:
      "Your startup profile should include a compelling pitch, funding needs, team information, market opportunity, and any traction or metrics that demonstrate your progress.",
  },
  {
    question: "How do I share documents securely?",
    answer:
      "You can upload documents to your secure document vault and selectively share them with connected investors. All documents are encrypted and access-controlled.",
  },
  {
    question: "What are collaboration requests?",
    answer:
      "Collaboration requests are formal expressions of interest from investors. They indicate that an investor wants to learn more about your startup and potentially discuss investment opportunities.",
  },
];

export const HelpPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in bg-black min-h-screen p-6 text-gray-200">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-yellow-400">Help & Support</h1>
        <p className="text-gray-400">
          Find answers to common questions or get in touch with our support team
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl">
        <Input
          placeholder="Search help articles..."
          startAdornment={<Search size={18} className="text-yellow-400" />}
          fullWidth
          className="bg-neutral-900 border border-yellow-600 text-yellow-200 placeholder-gray-500 focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-neutral-900 border border-yellow-600 text-gray-200 hover:shadow-[0_0_15px_rgba(234,179,8,0.4)] transition">
          <CardBody className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-500/20 rounded-lg mb-4">
              <Book size={24} className="text-yellow-400" />
            </div>
            <h2 className="text-lg font-semibold text-yellow-400">Documentation</h2>
            <p className="text-sm text-gray-400 mt-2">
              Browse our detailed documentation and guides
            </p>
            <Button
              variant="outline"
              className="mt-4 border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
              rightIcon={<ExternalLink size={16} />}
            >
              View Docs
            </Button>
          </CardBody>
        </Card>

        <Card className="bg-neutral-900 border border-yellow-600 text-gray-200 hover:shadow-[0_0_15px_rgba(234,179,8,0.4)] transition">
          <CardBody className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-500/20 rounded-lg mb-4">
              <MessageCircle size={24} className="text-yellow-400" />
            </div>
            <h2 className="text-lg font-semibold text-yellow-400">Live Chat</h2>
            <p className="text-sm text-gray-400 mt-2">
              Chat with our support team in real-time
            </p>
            <Button className="mt-4 bg-yellow-500 text-black hover:bg-yellow-400">
              Start Chat
            </Button>
          </CardBody>
        </Card>

        <Card className="bg-neutral-900 border border-yellow-600 text-gray-200 hover:shadow-[0_0_15px_rgba(234,179,8,0.4)] transition">
          <CardBody className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-500/20 rounded-lg mb-4">
              <Phone size={24} className="text-yellow-400" />
            </div>
            <h2 className="text-lg font-semibold text-yellow-400">Contact Us</h2>
            <p className="text-sm text-gray-400 mt-2">Get help via email or phone</p>
            <Button
              variant="outline"
              className="mt-4 border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
              leftIcon={<Mail size={16} />}
            >
              Contact Support
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* FAQs */}
      <Card className="bg-neutral-900 border border-yellow-600 text-gray-200">
        <CardHeader>
          <h2 className="text-lg font-semibold text-yellow-400">Frequently Asked Questions</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-yellow-700/40 last:border-0 pb-6 last:pb-0"
              >
                <h3 className="text-base font-semibold text-yellow-300 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Contact Form */}
      <Card className="bg-neutral-900 border border-yellow-600 text-gray-200">
        <CardHeader>
          <h2 className="text-lg font-semibold text-yellow-400">Still need help?</h2>
        </CardHeader>
        <CardBody>
          <form className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Name"
                placeholder="Your name"
                className="bg-neutral-800 border-yellow-700 text-yellow-200 placeholder-gray-500 focus:ring-yellow-500 focus:border-yellow-500"
              />

              <Input
                label="Email"
                type="email"
                placeholder="your@email.com"
                className="bg-neutral-800 border-yellow-700 text-yellow-200 placeholder-gray-500 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-yellow-300 mb-1">
                Message
              </label>
              <textarea
                className="w-full rounded-md bg-neutral-800 border border-yellow-700 text-yellow-200 placeholder-gray-500 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                rows={4}
                placeholder="How can we help you?"
              ></textarea>
            </div>

            <div>
              <Button className="bg-yellow-500 text-black hover:bg-yellow-400">
                Send Message
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
