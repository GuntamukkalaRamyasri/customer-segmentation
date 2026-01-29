import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Doughnut, Bar, Radar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { LogOut, Settings, Clock, Eye, Zap, Heart, Bookmark, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

// Mock digital twin data
const digitalTwinStats = {
  watchTime: '42h 30m',
  completionRate: 78,
  scrollSpeed: 'Medium',
  peakActiveTime: '9 PM - 11 PM',
  savedCount: 127,
  replayedCount: 45,
};

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Category Interest Data (Bar Chart)
  const categoryData = {
    labels: ['Entertainment', 'Education', 'Lifestyle', 'Tech', 'Food', 'Travel'],
    datasets: [
      {
        label: 'Interest Level',
        data: [85, 65, 72, 58, 45, 38],
        backgroundColor: [
          'hsla(340, 82%, 59%, 0.8)',
          'hsla(280, 70%, 60%, 0.8)',
          'hsla(220, 70%, 55%, 0.8)',
          'hsla(45, 100%, 60%, 0.8)',
          'hsla(142, 76%, 36%, 0.8)',
          'hsla(200, 100%, 60%, 0.8)',
        ],
        borderRadius: 8,
      },
    ],
  };

  // Watch Time Distribution (Doughnut Chart)
  const watchTimeData = {
    labels: ['Entertainment', 'Education', 'Lifestyle', 'Other'],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: [
          'hsl(340, 82%, 59%)',
          'hsl(280, 70%, 60%)',
          'hsl(220, 70%, 55%)',
          'hsl(0, 0%, 30%)',
        ],
        borderWidth: 0,
        cutout: '70%',
      },
    ],
  };

  // Behavior Vector (Radar Chart)
  const behaviorData = {
    labels: ['Engagement', 'Scroll Speed', 'Watch Time', 'Saves', 'Shares', 'Replays'],
    datasets: [
      {
        label: 'Your Behavior',
        data: [85, 65, 78, 72, 45, 55],
        backgroundColor: 'hsla(340, 82%, 59%, 0.2)',
        borderColor: 'hsl(340, 82%, 59%)',
        borderWidth: 2,
        pointBackgroundColor: 'hsl(340, 82%, 59%)',
        pointBorderColor: 'hsl(0, 0%, 100%)',
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'hsl(0, 0%, 65%)',
          font: { size: 10 },
        },
      },
      y: {
        grid: {
          color: 'hsla(0, 0%, 100%, 0.1)',
        },
        ticks: {
          color: 'hsl(0, 0%, 65%)',
        },
      },
    },
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        grid: {
          color: 'hsla(0, 0%, 100%, 0.1)',
        },
        angleLines: {
          color: 'hsla(0, 0%, 100%, 0.1)',
        },
        pointLabels: {
          color: 'hsl(0, 0%, 65%)',
          font: { size: 10 },
        },
        ticks: {
          display: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'hsl(0, 0%, 65%)',
          padding: 15,
          usePointStyle: true,
          font: { size: 11 },
        },
      },
    },
  };

  const statCards = [
    { icon: Clock, label: 'Watch Time', value: digitalTwinStats.watchTime, color: 'text-primary' },
    { icon: Eye, label: 'Completion Rate', value: `${digitalTwinStats.completionRate}%`, color: 'text-secondary' },
    { icon: Zap, label: 'Scroll Speed', value: digitalTwinStats.scrollSpeed, color: 'text-accent' },
    { icon: TrendingUp, label: 'Peak Time', value: digitalTwinStats.peakActiveTime, color: 'text-save' },
    { icon: Bookmark, label: 'Saved', value: digitalTwinStats.savedCount.toString(), color: 'text-save' },
    { icon: Heart, label: 'Replayed', value: digitalTwinStats.replayedCount.toString(), color: 'text-like' },
  ];

  return (
    <div className="min-h-screen pb-24 pt-4 px-4 bg-background">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <button className="w-10 h-10 rounded-full glass flex items-center justify-center">
            <Settings className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'}
              alt={user?.username}
              className="w-20 h-20 rounded-full border-2 border-primary object-cover"
            />
            <div>
              <h2 className="text-xl font-bold text-foreground">@{user?.username || 'user'}</h2>
              <p className="text-muted-foreground text-sm">{user?.bio || 'Digital creator'}</p>
              <p className="text-xs text-muted-foreground mt-1">Joined {user?.joinedDate || 'Recently'}</p>
            </div>
          </div>
        </motion.div>

        {/* Digital Twin Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-xl font-bold text-foreground mb-2">Digital Twin Insights</h2>
          <p className="text-sm text-muted-foreground">
            Your personalized viewing behavior analysis
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {statCards.map((stat, index) => (
            <div key={stat.label} className="glass-card rounded-xl p-3 text-center">
              <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-sm font-semibold text-foreground">{stat.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Behavior Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Behavior Vector</h3>
          <div className="h-64">
            <Radar data={behaviorData} options={radarOptions} />
          </div>
        </motion.div>

        {/* Category Interest Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Category Interest</h3>
          <div className="h-48">
            <Bar data={categoryData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Watch Time Doughnut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Watch Time Distribution</h3>
          <div className="h-64">
            <Doughnut data={watchTimeData} options={doughnutOptions} />
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full h-14 rounded-xl border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Log Out
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
