import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const FAQ = () => {
  const faqs = [
    {
      question: "What is LogbookWrapped?",
      answerText: "LogbookWrapped is a privacy-first web application designed for pilots to visualize their flight history. By uploading your logbook data, you receive an easy-to-share recap of your flying career—whether you're looking at a specific year in Wrapped mode, tracking year-over-year progression in Growth mode, or celebrating all-time Milestones.",
      answerUI: <>LogbookWrapped is a privacy-first web application designed for pilots to visualize their flight history. By uploading your logbook data, you receive an easy-to-share recap of your flying career—whether you're looking at a specific year in Wrapped mode, tracking year-over-year progression in Growth mode, or celebrating all-time Milestones.</>
    },
    {
      question: "Is my logbook data private and secure?",
      answerText: "Yes, 100%. LogbookWrapped is built on a client-side, privacy-first architecture. When you upload your CSV, your browser processes the data locally. Your raw logbook entries are never uploaded to, transmitted to, or stored on any of our servers. The moment you refresh or close your browser, all processed data is permanently erased from memory.",
      answerUI: <>Yes, 100%. LogbookWrapped is built on a client-side, privacy-first architecture. When you upload your CSV, your browser processes the data locally. Your raw logbook entries are never uploaded to, transmitted to, or stored on any of our servers. The moment you refresh or close your browser, all processed data is permanently erased from memory. Read our <Link to="/privacy" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">Privacy Policy</Link>.</>
    },
    {
      question: "Which electronic flight bags (EFBs) and logbook formats are supported?",
      answerText: "Our parser automatically fuzzy-matches and supports standard CSV exports from major EFBs including ForeFlight, Garmin Pilot, MyFlightbook, and LogTen Pro.",
      answerUI: <>Our parser automatically fuzzy-matches and supports standard CSV exports from major EFBs including ForeFlight, Garmin Pilot, MyFlightbook, and LogTen Pro.</>
    },
    {
      question: "How does the app handle missing data in my logbook?",
      answerText: "Our engine automatically cleans, patches, and interprets incomplete data. For example, if you leave the landings column blank but log flight time between two different airports, we automatically credit you with 1 landing. We also rebuild missing flight times using Hobbs or Tach meters, and self-heal missing aircraft types based on previous flights with the same tail number.",
      answerUI: <>Our engine automatically cleans, patches, and interprets incomplete data. For example, if you leave the landings column blank but log flight time between two different airports, we automatically credit you with 1 landing. We also rebuild missing flight times using Hobbs or Tach meters, and self-heal missing aircraft types based on previous flights with the same tail number. Read more on our <Link to="/methodology" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">Methodology page</Link>.</>
    },
    {
      question: "Why aren't some of my international flights showing up on the map?",
      answerText: "To keep the application fast and lightweight in your browser, our geographic database exclusively supports airports in the US, Canada, Mexico, the Caribbean, and US territories. Airports outside these regions will not be plotted on the map.",
      answerUI: <>To keep the application fast and lightweight in your browser, our geographic database exclusively supports airports in the US, Canada, Mexico, the Caribbean, and US territories. Airports outside these regions will not be plotted on the map.</>
    },
    {
      question: "How do you calculate distance and fuel burn?",
      answerText: "We use the Haversine Great Circle formula to calculate the exact Earth-curvature distance of your flight path. For fuel, we look up your logged aircraft in our database of over 50 performance profiles. If you fly an experimental or unsupported aircraft, we default to 120 knots and 10 GPH.",
      answerUI: <>We use the Haversine Great Circle formula to calculate the exact Earth-curvature distance of your flight path. For fuel, we look up your logged aircraft in our database of over 50 performance profiles. If you fly an experimental or unsupported aircraft, we default to 120 knots and 10 GPH. View our <Link to="/aircraftprofiles" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">supported aircraft database</Link>.</>
    },
    {
      question: "Can I integrate LogbookWrapped into my own aviation app?",
      answerText: "Yes! We offer a 100% serverless, client-side import API using the browser's native window.postMessage() API. This allows partner applications to securely send user flight data to LogbookWrapped for visualization without routing data through third-party backends. Contact us to get your domain added to our allowlist.",
      answerUI: <>Yes! We offer a 100% serverless, client-side import API using the browser's native window.postMessage() API. This allows partner applications to securely send user flight data to LogbookWrapped for visualization without routing data through third-party backends. Read our <Link to="/dev" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">API Implementation Guide</Link> or <Link to="/contact" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">contact us</Link> to get your domain added to our allowlist.</>
    },
    {
      question: "Is LogbookWrapped free to use?",
      answerText: "LogbookWrapped is 100% free with no ads. It's a labor of love built by a pilot, for pilots. If you enjoy the tool, you can help cover our server hosting costs by donating via Buy Me a Coffee or PayPal on our About page.",
      answerUI: <>LogbookWrapped is 100% free with no ads. It's a labor of love built by a pilot, for pilots. If you enjoy the tool, you can help cover our server hosting costs by dropping a donation in the AvGas Tip Jar on our <Link to="/about" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">About page</Link>.</>
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-4xl mx-auto px-6 py-16 text-slate-300"
    >
      <Helmet>
        <title>Frequently Asked Questions | LogbookWrapped</title>
        <meta name="description" content="Answers to common questions about LogbookWrapped's privacy, data processing, supported logbook formats like ForeFlight and Garmin, and parsing methodology." />
        <link rel="canonical" href="https://logbookwrapped.com/faq" />
        {/* JSON-LD Schema for Answer Engine Optimization (AEO) and SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answerText
              }
            }))
          })}
        </script>
      </Helmet>

      <header className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-slate-400">Everything you need to know about how LogbookWrapped works, your privacy, and our methodology.</p>
      </header>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <section key={index} className="bg-slate-800/40 border border-slate-700/50 p-6 md:p-8 rounded-2xl">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">{faq.question}</h2>
            <p className="text-lg leading-relaxed text-slate-300">{faq.answerUI}</p>
          </section>
        ))}
      </div>

      <section className="mt-12 text-center bg-slate-800/40 border border-slate-700/50 p-8 rounded-2xl">
        <h2 className="text-2xl font-semibold text-white mb-4">Still have questions?</h2>
        <p className="text-slate-300 mb-6">
          Whether you found an edge case in our parser or want to integrate with our API, we're here to help.
        </p>
        <Link 
          to="/contact"
          className="inline-flex items-center justify-center px-8 py-3 bg-white text-slate-900 font-bold rounded-full transition-transform hover:scale-105 active:scale-95 hover:bg-slate-100 shadow-xl"
        >
          Contact Us
        </Link>
      </section>
    </motion.div>
  );
};