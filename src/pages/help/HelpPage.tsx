import React, { useState } from 'react';
import { Search, Book, MessageCircle, Phone, Mail, ExternalLink, X, Send, FileText, Settings, Users, Shield, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
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
  const URL = import.meta.env.VITE_BACKEND_URL;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeModal, setActiveModal] = useState<'docs' | 'chat' | 'contact' | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'support', text: string }>>([
    { sender: 'support', text: 'Hello! How can we help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Only allow letters and spaces in name dynamically
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]*$/.test(value)) {
      setFormData(prev => ({ ...prev, name: value }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'name') return; // Name handled separately
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
    // Only allow common domains like Gmail, Yahoo, Hotmail, Outlook
    const allowedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com' , "icloud.com"];
    const emailRegex = new RegExp(`^[^\\s@]+@(${allowedDomains.join('|')})$`, 'i');
    if (!emailRegex.test(email)) {
      toast.error('Inavlud Email');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.error || 'Failed to send message');
        return;
      }

      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Failed to submit contact form', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { sender: 'user', text: chatInput }]);
    setChatInput('');
    // Simulate support response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        sender: 'support', 
        text: 'Thanks for your message! Our team will respond shortly.' 
      }]);
    }, 1000);
  };

  const documentationSections = [
    {
      title: 'Getting Started',
      icon: FileText,
      articles: [
        { title: 'Creating your account', image: '/docs/getting-started/account.png' },
        { title: 'Setting up your profile', image: '/docs/getting-started/profile.png' },
        { title: 'Understanding the dashboard', image: '/docs/getting-started/dashboard.png' },
        { title: 'First steps for entrepreneurs', image: '/docs/getting-started/first-steps.png' }
      ]
    },
    {
      title: 'For Entrepreneurs',
      icon: Users,
      articles: [
        { title: 'Building your startup profile', image: '/docs/entrepreneurs/profile.png' },
        { title: 'Connecting with investors', image: '/docs/entrepreneurs/connect.png' },
        { title: 'Managing collaboration requests', image: '/docs/entrepreneurs/collab.png' },
        { title: 'Sharing documents securely', image: '/docs/entrepreneurs/documents.png' }
      ]
    },
    {
      title: 'For Investors',
      icon: Shield,
      articles: [
        { title: 'Finding startups to invest in', image: '/docs/investors/find-startups.png' },
        { title: 'Reviewing startup profiles', image: '/docs/investors/review-profiles.png' },
        { title: 'Sending collaboration requests', image: '/docs/investors/requests.png' },
        { title: 'Due diligence best practices', image: '/docs/investors/due-diligence.png' }
      ]
    },
    {
      title: 'Platform Features',
      icon: Settings,
      articles: [
        { title: 'Using the messaging system', image: '/docs/features/messaging.png' },
        { title: 'Document management', image: '/docs/features/documents.png' },
        { title: 'Video calls and meetings', image: '/docs/features/video.png' },
        { title: 'Notifications and alerts', image: '/docs/features/notifications.png' }
      ]
    }
  ];

  const [selectedDoc, setSelectedDoc] = useState<{ title: string; image: string } | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-600">Find answers to common questions or get in touch with our support team</p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-50 rounded-lg mb-4">
              <Book size={24} className="text-primary-600" />
            </div>
            <h2 className="text-lg font-medium text-gray-900">Documentation</h2>
            <p className="text-sm text-gray-600 mt-2">
              Browse our detailed documentation and guides
            </p>
            <Button
              variant="outline"
              className="mt-4"
              rightIcon={<ExternalLink size={16} />}
              onClick={() => setActiveModal('docs')}
            >
              View Docs
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-50 rounded-lg mb-4">
              <MessageCircle size={24} className="text-primary-600" />
            </div>
            <h2 className="text-lg font-medium text-gray-900">Live Chat</h2>
            <p className="text-sm text-gray-600 mt-2">
              Chat with our support team in real-time
            </p>
            <Button className="mt-4" onClick={() => setActiveModal('chat')}>
              Start Chat
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-50 rounded-lg mb-4">
              <Phone size={24} className="text-primary-600" />
            </div>
            <h2 className="text-lg font-medium text-gray-900">Contact Us</h2>
            <p className="text-sm text-gray-600 mt-2">
              Get help via email or phone
            </p>
            <Button
              variant="outline"
              className="mt-4"
              leftIcon={<Mail size={16} />}
              onClick={() => setActiveModal('contact')}
            >
              Contact Support
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Frequently Asked Questions</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                <h3 className="text-base font-medium text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Contact form */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Still need help?</h2>
        </CardHeader>
        <CardBody>
          <form className="space-y-6 max-w-2xl" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Name"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleNameChange} // only letters allowed
              />

              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                rows={4}
                placeholder="How can we help you?"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>

            <div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Documentation Modal */}
      {activeModal === 'docs' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex">
            <div className="w-2/3 border-r border-gray-200 flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Book size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Documentation</h2>
                    <p className="text-sm text-gray-600">Click an article to preview its image</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveModal(null);
                    setSelectedDoc(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documentationSections.map((section, idx) => (
                    <Card key={idx} className="hover:shadow-md transition-shadow">
                      <CardBody className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                            <section.icon size={18} className="text-blue-600" />
                          </div>
                          <h3 className="text-md font-semibold text-gray-900">{section.title}</h3>
                        </div>
                        <ul className="space-y-2">
                          {section.articles.map((article, articleIdx) => (
                            <li key={articleIdx}>
                              <button
                                className="flex items-center justify-between w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors group"
                                onClick={() => setSelectedDoc(article)}
                              >
                                <span className="text-sm text-gray-700 group-hover:text-blue-600">{article.title}</span>
                                <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-1/3 bg-gray-50 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800">Preview</h3>
                <p className="text-xs text-gray-500">Image paths to be added later</p>
              </div>
              <div className="flex-1 flex items-center justify-center p-4">
                {selectedDoc ? (
                  <div className="text-center space-y-3">
                    <p className="text-sm font-semibold text-gray-800">{selectedDoc.title}</p>
                    <div className="w-full h-48 bg-white border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-500">
                      {selectedDoc.image}
                    </div>
                    <p className="text-xs text-gray-500">Add your image at the above path.</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Select an article to see its image path.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Chat Modal */}
      {activeModal === 'chat' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageCircle size={20} className="text-green-600" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Live Chat</h2>
                  <p className="text-sm text-green-600">Support team online</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleChatSend}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Support Modal */}
      {activeModal === 'contact' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Phone size={20} className="text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Contact Support</h2>
                  <p className="text-sm text-gray-600">We're here to help</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="border-2 border-blue-100 bg-blue-50">
                  <CardBody className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                        <p className="text-sm text-gray-600 mb-3">Get help via email within 24 hours</p>
                        <a href="mailto:aitrustbridge@gmail.com" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                          aitrustbridge@gmail.com
                        </a>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card className="border-2 border-green-100 bg-green-50">
                  <CardBody className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Phone Support</h3>
                        <p className="text-sm text-gray-600 mb-3">Mon-Fri, 9AM-6PM EST</p>
                        <a href="tel:+1234567890" className="text-sm font-medium text-green-600 hover:text-green-700">
                          +1 (234) 567-890
                        </a>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Office Hours</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-medium">Monday - Friday:</span>
                    <span>9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Saturday:</span>
                    <span>10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>

              {/* <div className="mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="text-left p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200">
                    <div className="text-sm font-medium text-gray-900">Status Page</div>
                    <div className="text-xs text-gray-500 mt-1">Check system status</div>
                  </button>
                  <button className="text-left p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200">
                    <div className="text-sm font-medium text-gray-900">Report Bug</div>
                    <div className="text-xs text-gray-500 mt-1">Submit bug reports</div>
                  </button>
                  <button className="text-left p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200">
                    <div className="text-sm font-medium text-gray-900">Feature Request</div>
                    <div className="text-xs text-gray-500 mt-1">Suggest new features</div>
                  </button>
                  <button className="text-left p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200">
                    <div className="text-sm font-medium text-gray-900">Community Forum</div>
                    <div className="text-xs text-gray-500 mt-1">Join discussions</div>
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
