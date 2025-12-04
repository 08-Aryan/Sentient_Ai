import React from 'react';
import { ConversationStats, SentimentLabel, TrendDirection, ChartDataPoint } from '../../types';
import { X, RefreshCcw, Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface SummaryProps {
  stats: ConversationStats;
  history: ChartDataPoint[];
  onClose: () => void;
  onRestart: () => void;
}

const SummaryReport: React.FC<SummaryProps> = ({ stats, history, onClose, onRestart }) => {

  const getTrendColor = (trend: TrendDirection) => {
    switch (trend) {
      case TrendDirection.IMPROVING: return 'text-emerald-400';
      case TrendDirection.DECLINING: return 'text-rose-400';
      default: return 'text-blue-400';
    }
  };

  const getTrendIcon = (trend: TrendDirection) => {
    switch (trend) {
      case TrendDirection.IMPROVING: return <TrendingUp className="text-emerald-400" size={20} />;
      case TrendDirection.DECLINING: return <TrendingDown className="text-rose-400" size={20} />;
      default: return <Minus className="text-blue-400" size={20} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-message-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#161b22] border border-gray-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <Activity className="text-sky-500" />
            Session Analysis
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded-full transition-colors text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Overall Mood */}
            <div className="p-4 bg-gray-800/40 rounded-xl border border-gray-700/50 flex flex-col items-center text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Overall Mood</p>
              <div className={`text-xl font-bold mb-1 ${stats.overallMoodLabel === SentimentLabel.POSITIVE ? 'text-emerald-400' :
                stats.overallMoodLabel === SentimentLabel.NEGATIVE ? 'text-rose-400' : 'text-gray-100'
                }`}>
                {stats.overallMoodLabel}
              </div>
              <div className="text-xs text-gray-500 font-mono bg-gray-900/50 px-2 py-0.5 rounded">
                Avg: {stats.averageScore > 0 ? '+' : ''}{stats.averageScore.toFixed(2)}
              </div>
            </div>

            {/* Trend */}
            <div className="p-4 bg-gray-800/40 rounded-xl border border-gray-700/50 flex flex-col items-center text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Trajectory</p>
              <div className="mb-1">{getTrendIcon(stats.trend)}</div>
              <div className={`text-sm font-medium ${getTrendColor(stats.trend)}`}>
                {stats.trend}
              </div>
            </div>

            {/* Volume */}
            <div className="p-4 bg-gray-800/40 rounded-xl border border-gray-700/50 flex flex-col items-center text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Messages</p>
              <div className="text-2xl font-bold text-gray-100 mb-1">
                {stats.totalMessages}
              </div>
              <div className="text-xs text-gray-500">Exchanged</div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="h-72 w-full bg-gray-900/30 rounded-xl border border-gray-800 p-4 flex flex-col">
            <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
              <Activity size={14} /> Emotional Flow
            </h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="index" hide />
                  <YAxis domain={[-1.1, 1.1]} hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ color: '#e5e7eb', fontSize: '12px' }}
                    formatter={(value: number) => [value.toFixed(2), 'Sentiment Score']}
                    labelFormatter={(label) => `Message #${label}`}
                  />
                  <ReferenceLine y={0} stroke="#4b5563" strokeDasharray="3 3" />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#60a5fa"
                    fillOpacity={1}
                    fill="url(#colorScore)"
                    strokeWidth={2}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors text-sm"
          >
            Close Report
          </button>
          <button
            onClick={onRestart}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 transition-colors text-sm font-medium shadow-lg shadow-blue-600/20"
          >
            <RefreshCcw size={16} />
            New Session
          </button>
        </div>

      </div>
    </div>
  );
};

export default SummaryReport;