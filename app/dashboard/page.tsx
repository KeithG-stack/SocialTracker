/**
 * page.tsx
 * 
 * Main dashboard page displaying charts and engagement widgets.
 */

'use client';

import FacebookEngagement from './FacebookEngagement';
import InstagramEngagement from './InstagramEngagement';
import TwitterEngagement from './TwitterEngagement';
import SentimentAnalysis from './SentimentAnalysis';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

// Dummy data for charts
const pieData = [
  { name: 'Facebook', value: 120 },
  { name: 'Instagram', value: 90 },
  { name: 'Twitter', value: 60 },
];

const COLORS = ['#6366f1', '#f59e42', '#1da1f2'];

const lineData = [
  { name: 'Mon', Facebook: 30, Instagram: 20, Twitter: 10 },
  { name: 'Tue', Facebook: 40, Instagram: 25, Twitter: 15 },
  { name: 'Wed', Facebook: 35, Instagram: 30, Twitter: 20 },
  { name: 'Thu', Facebook: 50, Instagram: 40, Twitter: 25 },
  { name: 'Fri', Facebook: 60, Instagram: 45, Twitter: 30 },
  { name: 'Sat', Facebook: 55, Instagram: 50, Twitter: 35 },
  { name: 'Sun', Facebook: 70, Instagram: 60, Twitter: 40 },
];

/**
 * DashboardPage component renders the dashboard overview, charts, and widgets.
 */
export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Engagement Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Weekly Engagement Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Facebook" stroke="#6366f1" />
              <Line type="monotone" dataKey="Instagram" stroke="#f59e42" />
              <Line type="monotone" dataKey="Twitter" stroke="#1da1f2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Existing widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FacebookEngagement />
        <InstagramEngagement />
        <TwitterEngagement />
        <SentimentAnalysis />
      </div>
    </div>
  );
}