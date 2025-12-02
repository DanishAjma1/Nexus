import React, { useState } from 'react';
import { Search, Book, MessageCircle, Phone, Mail, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

const faqs = [
  {
    question: 'How do I connect with investors?',
    answer: 'You can browse our investor directory and send connection requests. Once an investor accepts, you can start messaging them directly through our platform.'
  },
  {
    question: 'What should I include in my startup profile?',
    answer: 'Your startup profile should include a compelling pitch, funding needs, team information, market opportunity, and any traction or metrics that demonstrate your progress.'
  },
  {
    question: 'How do I share documents securely?',
    answer: 'You can upload documents to your secure document vault and selectively share them with connected investors. All documents are encrypted and access-controlled.'
  },
  {
    question: 'What are collaboration requests?',
    answer: 'Collaboration requests are formal expressions of interest from investors. They indicate that an investor wants to learn more about your startup and potentially discuss investment opportunities.'
  }
];

export const HelpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]*$/.test(value)) {
      setFormData(prev => ({ ...prev, name: value }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'name') return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { name, email, message } = formData;

    if (!name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!/^[A-Za-z\s]+$/.test(name)) {
      toast.error('Name can only contain letters and spaces');
      return false;
    }

    if (!email.trim()) {
      toast.error('Email is required');
      return false;
    }

    const allowedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
    const emailRegex = new RegExp(`^[^\\s@]+@(${allowedDomains.join('|')})$`, 'i');
    if (!emailRegex.test(email)) {
      toast.error('Invalid Email');
      return false;
    }

    if (!message.trim()) {
      toast.error('Message is required');
      return false;
    }
    if (message.trim().length < 10) {
      toast.error('Message must be at least 10 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log('Form submitted', formData);
    toast.success('Message sent successfully!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in bg-black min-h-screen p-6 text-purple-100">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-purple-100">Help & Support</h1>
        <p className="text-purple-300">Find answers to common questions or get in touch with our support team</p>
      </div>

      {/* Search */}
      <div className="max-w-2xl">
        <div className="flex items-center bg-purple-900 rounded-lg p-2 w-full shadow-md">
          <Search size={18} className="text-purple-400 mr-2" />
          <input
            type="text"
            placeholder="Search help articles..."
            className="bg-purple-900 text-purple-100 placeholder-purple-400 w-full focus:outline-none p-2 rounded-md"
          />
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{
          icon: <Book size={24} className="text-purple-400" />,
          title: "Documentation",
          desc: "Browse our detailed documentation and guides",
          button: "View Docs"
        }, {
          icon: <MessageCircle size={24} className="text-purple-400" />,
          title: "Live Chat",
          desc: "Chat with our support team in real-time",
          button: "Start Chat"
        }, {
          icon: <Phone size={24} className="text-purple-400" />,
          title: "Contact Us",
          desc: "Get help via email or phone",
          button: "Contact Support",
          buttonIcon: <Mail size={16} />
        }].map((item, idx) => (
          <Card key={idx} className="bg-purple-900 border border-purple-700 shadow-lg">
            <CardBody className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-lg mb-4">
                {item.icon}
              </div>
              <h2 className="text-lg font-medium">{item.title}</h2>
              <p className="text-sm text-purple-300 mt-2">{item.desc}</p>
              <Button
                variant="outline"
                className="mt-4 border-purple-700 text-purple-100 hover:bg-purple-800"
                {...(item.buttonIcon ? { leftIcon: item.buttonIcon } : {})}
              >
                {item.button}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* FAQs */}
      <Card className="bg-purple-900 border border-purple-700 shadow-lg">
        <CardHeader>
          <h2 className="text-lg font-medium">Frequently Asked Questions</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-purple-700 last:border-0 pb-6 last:pb-0">
                <h3 className="text-base font-medium mb-2">{faq.question}</h3>
                <p className="text-purple-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Contact form */}
      <Card className="bg-gradient-to-br from-purple-900 to-black border border-purple-700 shadow-lg">
        <CardHeader>
          <h2 className="text-lg font-medium">Still need help?</h2>
        </CardHeader>
        <CardBody>
          <form className="space-y-6 max-w-2xl" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleNameChange}
                className="w-full p-2 rounded-lg bg-black text-purple-100 placeholder-purple-400 border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-black text-purple-100 placeholder-purple-400 border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <textarea
              name="message"
              rows={4}
              placeholder="How can we help you?"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-black text-purple-100 placeholder-purple-400 border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>

            <Button type="submit" className="bg-purple-700 text-purple-100 hover:bg-purple-600 w-full">
              Send Message
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
