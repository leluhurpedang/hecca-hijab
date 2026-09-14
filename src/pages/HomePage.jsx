import React from 'react';
import { SEO } from '../components/common/SEO';
import { HeroSection } from '../components/home/HeroSection';
import { CategorySection } from '../components/home/CategorySection';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { PromoBanner } from '../components/home/PromoBanner';
import { BestSellerSection } from '../components/home/BestSellerSection';
import { ValueProps } from '../components/home/ValueProps';
import { Testimonials } from '../components/home/Testimonials';
import { Newsletter } from '../components/home/Newsletter';
import { useCMS } from '../context/CMSContext';

export function HomePage() {
  const { cms } = useCMS();
  const sections = cms.homepage?.sections || {};

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://haeccahijab.com';
  const homeSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${origin}/#organization`,
        name: 'Haecca Hijab',
        url: origin,
        logo: `${origin}/favicon.svg`,
        description:
          'Brand modest fashion dan hijab premium dengan material voal ultrafine, pashmina silk, serta aksesoris eksklusif berstandar butik.',
      },
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        url: origin,
        name: 'Haecca Hijab',
        publisher: {
          '@id': `${origin}/#organization`,
        },
        inLanguage: 'id-ID',
      },
    ],
  };

  return (
    <>
      <SEO
        title="Haecca Hijab | Hijab & Fashion Muslimah"
        description="Brand hijab dan modest fashion modern dengan material voal ultrafine, pashmina silk, dan aksesoris eksklusif berstandar butik. Elegan, lembut, dan nyaman seharian."
        url={origin}
        jsonLd={homeSchema}
      />
      <div className="flex flex-col">
        <HeroSection />
        {sections.showCategories !== false && <CategorySection />}
        {sections.showNewArrivals !== false && <FeaturedSection />}
        {sections.showSpotlight !== false && <PromoBanner />}
        {sections.showBestSellers !== false && <BestSellerSection />}
        {sections.showValueProps !== false && <ValueProps />}
        {sections.showTestimonials !== false && <Testimonials />}
        {sections.showNewsletter !== false && <Newsletter />}
      </div>
    </>
  );
}
