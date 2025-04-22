import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vishal & Monica - Wedding Invitation',
  description: 'Join us for the wedding celebration of Vishal & Monica on May 23rd, 2025',
  openGraph: {
    title: 'Vishal & Monica - Wedding Invitation',
    description: 'Join us for the wedding celebration of Vishal & Monica on May 23rd, 2025',
    images: [
      {
        url: '/public/WeddingCard.jpg',
        width: 1200,
        height: 630,
        alt: 'Wedding Invitation Card',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vishal & Monica - Wedding Invitation',
    description: 'Join us for the wedding celebration of Vishal & Monica on May 23rd, 2025',
    images: ['/public/WeddingCard.jpg'],
  },
}; 