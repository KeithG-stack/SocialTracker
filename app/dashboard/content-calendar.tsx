/**
 * ContentCalendar.tsx
 *
 * Dashboard widget displaying a simple content calendar with various influencer content types.
 * Shows scheduled activities such as recording videos, promotions, sponsorships, and collaborations.
 */

'use client';

import React from 'react';

type CalendarItem = {
  date: string;
  platform: string;
  type: string;
  description: string;
};

const calendarData: CalendarItem[] = [
  {
    date: '2024-06-10',
    platform: 'Instagram',
    type: 'Promotion',
    description: 'Promote new skincare product with story and post.',
  },
  {
    date: '2024-06-11',
    platform: 'YouTube',
    type: 'Record Video',
    description: 'Film Q&A video with fan-submitted questions.',
  },
  {
    date: '2024-06-12',
    platform: 'TikTok',
    type: 'Collab',
    description: 'Dance challenge collab with @dancer123.',
  },
  {
    date: '2024-06-13',
    platform: 'Twitter',
    type: 'Sponsorship',
    description: 'Sponsored tweet for new energy drink.',
  },
  {
    date: '2024-06-14',
    platform: 'Instagram',
    type: 'Giveaway',
    description: 'Announce giveaway winners in IG Live.',
  },
  {
    date: '2024-06-15',
    platform: 'YouTube',
    type: 'Promotion',
    description: 'Mention affiliate link in video description.',
  },
  {
    date: '2024-06-16',
    platform: 'TikTok',
    type: 'Record Video',
    description: 'Film behind-the-scenes vlog.',
  },
  {
    date: '2024-06-17',
    platform: 'Instagram',
    type: 'Collab',
    description: 'Photo shoot with @fashionista.',
  },
  {
    date: '2024-06-18',
    platform: 'Twitter',
    type: 'Promotion',
    description: 'Live tweet during product launch event.',
  },
  {
    date: '2024-06-19',
    platform: 'YouTube',
    type: 'Sponsorship',
    description: 'Integrate sponsored segment in weekly vlog.',
  },
];

export default function ContentCalendar() {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Content Calendar</h3>
      <table className="min-w-full text-sm text-gray-700">
        <thead>
          <tr>
            <th className="text-left py-2 px-2">Date</th>
            <th className="text-left py-2 px-2">Platform</th>
            <th className="text-left py-2 px-2">Type</th>
            <th className="text-left py-2 px-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {calendarData.map((item, idx) => (
            <tr key={idx} className="border-b last:border-b-0">
              <td className="py-2 px-2">{item.date}</td>
              <td className="py-2 px-2">{item.platform}</td>
              <td className="py-2 px-2 font-semibold">{item.type}</td>
              <td className="py-2 px-2">{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
