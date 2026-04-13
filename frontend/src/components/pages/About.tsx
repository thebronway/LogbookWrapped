import { Helmet } from 'react-helmet-async';

export const About = () => (
  <div className="max-w-4xl mx-auto px-6 py-16 text-slate-300">
    <Helmet>
      <title>About Logbook Wrapped | Your Aviation Story</title>
      <meta name="description" content="Learn more about Logbook Wrapped, the privacy-first tool built for pilots to visualize their flight history." />
    </Helmet>
    <h1 className="text-4xl font-bold text-white mb-6">About Logbook Wrapped</h1>
    <div className="space-y-6 text-lg leading-relaxed">
      <p>
        Welcome to Logbook Wrapped, the premier tool for pilots wanting to visualize their aviation milestones. We believe your flight history is more than just rows in a CSV file—it's a story of your journey through the skies.
      </p>
      <p>
        Born from the viral success of end-of-year review apps like Spotify Wrapped, Logbook Wrapped was created to give aviators a beautiful, engaging, and easy-to-share recap of their flying hours, favorite routes, fleet diversity, and aviation extremes.
      </p>
      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Why Privacy Matters</h2>
      <p>
        As pilots ourselves, we know how sensitive logbook data can be. Your certificates, routes, and remarks are your business. That's why Logbook Wrapped is built with a <strong>100% client-side privacy-first architecture</strong>. When you drop your CSV into our platform, your browser processes the data locally. No FAA numbers, names, or routes ever touch our servers.
      </p>
    </div>
  </div>
);