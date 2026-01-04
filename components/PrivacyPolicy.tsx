import React, { useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const PrivacyPolicy = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Privacy Policy | Lofton Realty";
  }, []);

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <Navbar />

      <main className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
            <h1 className="text-3xl md:text-5xl font-extrabold text-charcoal mb-4">Privacy Policy</h1>
            <p className="text-gray-500 mb-8 font-medium">Last Updated: October 26, 2023</p>

            <div className="space-y-8 text-gray-600 leading-relaxed text-lg">
              
              <section>
                <h2 className="text-2xl font-bold text-charcoal mb-4">1. Introduction</h2>
                <p>
                  At Lofton Realty, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or use our real estate services. By using our site, you agree to the practices described in this policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-charcoal mb-4">2. Information We Collect</h2>
                <p className="mb-4">We collect information to provide better services to our clients. This includes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Personal Information:</strong> Name, email address, phone number, and mailing address provided when you submit forms, request property tours, or sign up for newsletters.</li>
                  <li><strong>Property Preferences:</strong> Details about the types of homes, locations, and price ranges you are interested in.</li>
                  <li><strong>Usage Data:</strong> Information about how you interact with our website, such as pages visited, time spent on the site, and referring websites, collected via cookies and analytics tools.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-charcoal mb-4">3. How We Use Your Information</h2>
                <p className="mb-4">We use the information we collect for specific business purposes, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Responding to your inquiries regarding buying, selling, or renting properties.</li>
                  <li>Scheduling property viewings and consultations.</li>
                  <li>Sending you relevant listing updates, market reports, and newsletters (you may opt out at any time).</li>
                  <li> improving our website functionality and user experience.</li>
                  <li>Complying with legal obligations and real estate regulations.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-charcoal mb-4">4. Data Protection & Security</h2>
                <p>
                  We implement a variety of security measures to maintain the safety of your personal information. While we strive to use commercially acceptable means to protect your personal data, please remember that no method of transmission over the Internet or method of electronic storage is 100% secure. We cannot guarantee its absolute security, but we are committed to following industry best practices to minimize risk.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-charcoal mb-4">5. Your Rights</h2>
                <p className="mb-4">Depending on your location, you may have certain rights regarding your personal information, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The right to access the personal data we hold about you.</li>
                  <li>The right to request correction of inaccurate information.</li>
                  <li>The right to request deletion of your data (subject to legal retention requirements).</li>
                  <li>The right to opt out of marketing communications.</li>
                </ul>
                <p className="mt-4">
                  To exercise any of these rights, please contact us using the information provided at the bottom of this policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-charcoal mb-4">6. Cookies & Third-Party Tools</h2>
                <p>
                  Our website uses cookies to enhance your browsing experience. Cookies are small files that a site or its service provider transfers to your computer's hard drive through your Web browser (if you allow) that enables the site's systems to recognize your browser and capture and remember certain information. We may also use third-party tools, such as Google Analytics, to help us understand how our site is used. You can choose to disable cookies through your individual browser options.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-charcoal mb-4">7. Third-Party Links</h2>
                <p>
                  Our website may contain links to third-party sites, such as mortgage calculators, school district maps, or partner services. These sites have separate and independent privacy policies. We, therefore, have no responsibility or liability for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity of our site and welcome any feedback about these sites.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-charcoal mb-4">8. Contact Us</h2>
                <p className="mb-2">If you have any questions regarding this Privacy Policy, please contact us:</p>
                <p className="font-bold text-charcoal">Lofton Realty</p>
                <p>Email: <a href="mailto:Info@LoftonRealty.com" className="text-brand hover:underline">Info@LoftonRealty.com</a></p>
                <p>Phone: (713) 203-7661</p>
                <p>Houston, TX</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-charcoal mb-4">9. Changes to This Policy</h2>
                <p>
                  Lofton Realty reserves the right to update this Privacy Policy at any time. When we do, we will revise the updated date at the top of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect.
                </p>
              </section>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};