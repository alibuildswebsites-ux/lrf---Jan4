import React, { useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const TermsOfService = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Terms of Service | Lofton Realty";
  }, []);

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <Navbar />

      <main className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
            <h1 className="text-3xl md:text-5xl font-extrabold text-charcoal mb-4">Terms of Service</h1>
            <p className="text-gray-500 mb-8 font-medium">Last Updated: October 26, 2023</p>

            <div className="space-y-8 text-gray-600 leading-relaxed text-lg">
              
              <section>
                <h2 className="text-2xl font-bold text-charcoal mb-4">1. Agreement to Terms</h2>
                <p>
                  Welcome to Lofton Realty. By accessing or using our website, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree with any part of these terms, you must not use our website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-charcoal mb-4">2. Use of the Site</h2>
                <p className="mb-4">
                  You are granted a limited, non-exclusive, non-transferable license to access and use the site for personal, non-commercial purposes, primarily to view real estate listings and information.
                </p>
                <p><strong>You agree not to:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the site for any unlawful purpose or to solicit others to perform or participate in any unlawful acts.</li>
                  <li>Attempt to disrupt or interfere with the security or proper functioning of the site.</li>
                  <li>Use any automated system (robots, spiders, scrapers) to access the site without our prior written permission.</li>
                  <li>Copy, reproduce, or resell any content or data found on the site.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-charcoal mb-4">3. Intellectual Property</h2>
                <p>
                  All content included on this site, such as text, graphics, logos, images, audio clips, digital downloads, and software, is the property of Lofton Realty or its content suppliers and is protected by United States and international copyright laws. The compilation of all content on this site is the exclusive property of Lofton Realty.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-charcoal mb-4">4. User Submissions</h2>
                <p>
                  If you submit contact forms, inquiries, or other information to us, you grant Lofton Realty permission to use that information to contact you and provide services. You represent that any information you provide is accurate, current, and complete. You agree not to submit content that is illegal, offensive, or infringes on the rights of others.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-charcoal mb-4">5. Accuracy of Information</h2>
                <p>
                  While we strive to provide accurate and up-to-date information regarding properties, market trends, and services, we cannot guarantee that all information on the site is error-free, complete, or current. Property listings are subject to prior sale, price changes, or withdrawal without notice. We recommend verifying all important details with our real estate professionals.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-charcoal mb-4">6. Third-Party Links</h2>
                <p>
                  Our website may contain links to third-party websites or services that are not owned or controlled by Lofton Realty. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites. You acknowledge and agree that Lofton Realty shall not be responsible or liable for any damage or loss caused by your use of any such third-party sites.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-charcoal mb-4">7. Limitation of Liability</h2>
                <p>
                  To the fullest extent permitted by applicable law, Lofton Realty shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the site; (ii) any conduct or content of any third party on the site; or (iii) any content obtained from the site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-charcoal mb-4">8. No Warranties</h2>
                <p>
                  The site is provided on an "AS IS" and "AS AVAILABLE" basis. Lofton Realty makes no representations or warranties of any kind, express or implied, regarding the operation of the site or the information, content, materials, or products included on this site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-charcoal mb-4">9. Changes to the Terms</h2>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our site after those revisions become effective, you agree to be bound by the revised terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-charcoal mb-4">10. Governing Law</h2>
                <p>
                  These Terms shall be governed and construed in accordance with the laws of the State of Texas, United States, without regard to its conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-charcoal mb-4">11. Contact Information</h2>
                <p className="mb-2">If you have any questions about these Terms of Service, please contact us:</p>
                <p className="font-bold text-charcoal">Lofton Realty</p>
                <p>Email: <a href="mailto:Info@LoftonRealty.com" className="text-brand hover:underline">Info@LoftonRealty.com</a></p>
                <p>Phone: (713) 203-7661</p>
              </section>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};