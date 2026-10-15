'use client';

import React, { useState } from 'react';
import { X, Database, CheckCircle, AlertTriangle, RefreshCw, Terminal, ExternalLink } from 'lucide-react';

interface NeonSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  isNeonConnected: boolean;
  onRefreshStatus: () => void;
}

export const NeonSetupModal: React.FC<NeonSetupModalProps> = ({
  isOpen,
  onClose,
  isNeonConnected,
  onRefreshStatus,
}) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [initResult, setInitResult] = useState<{ success?: boolean; message?: string } | null>(null);

  if (!isOpen) return null;

  const handleInitDb = async () => {
    setIsInitializing(true);
    setInitResult(null);

    try {
      const res = await fetch('/api/init-db', { method: 'POST' });
      const data = await res.json();
      setInitResult({
        success: data.success,
        message: data.message || data.error,
      });
      if (data.configured) {
        onRefreshStatus();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setInitResult({
        success: false,
        message: msg,
      });
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-2.5 mb-2">
          <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">
              Neon PostgreSQL Database
            </h3>
            <span
              className={`inline-flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                isNeonConnected
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              {isNeonConnected ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  <span>PostgreSQL Active</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3" />
                  <span>Demo Memory Mode Active</span>
                </>
              )}
            </span>
          </div>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
          PlanPal connects directly to **Neon Serverless PostgreSQL** via `@neondatabase/serverless` for persistent relational storage of users, activity broadcasts, swipe interactions, matches, and messages.
        </p>

        {/* How to Connect Neon instructions */}
        <div className="mt-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 space-y-3">
          <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
            <span>How to connect your Neon DB:</span>
            <a
              href="https://neon.tech"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 hover:underline"
            >
              <span>neon.tech</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </h4>

          <ol className="text-xs text-zinc-600 dark:text-zinc-300 space-y-1.5 list-decimal list-inside leading-relaxed">
            <li>Create a free database at <strong>neon.tech</strong>.</li>
            <li>Copy your connection string from the Neon dashboard.</li>
            <li>
              Add it to <code className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 font-mono text-[11px]">.env.local</code>:
            </li>
          </ol>

          <div className="p-3 rounded-xl bg-zinc-900 text-zinc-100 font-mono text-[11px] overflow-x-auto">
            DATABASE_URL=postgresql://user:pass@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
          </div>
        </div>

        {/* Database Tables Schema */}
        <div className="mt-4">
          <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <Terminal className="w-3.5 h-3.5" />
            <span>PostgreSQL Relational Schema</span>
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <span className="font-bold text-zinc-900 dark:text-white">users</span>
              <p className="text-[10px] text-zinc-400">id, name, avatar, major, badges</p>
            </div>
            <div className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <span className="font-bold text-zinc-900 dark:text-white">activities</span>
              <p className="text-[10px] text-zinc-400">title, category, location, time</p>
            </div>
            <div className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <span className="font-bold text-zinc-900 dark:text-white">swipes</span>
              <p className="text-[10px] text-zinc-400">activity_id, user_id, action</p>
            </div>
            <div className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <span className="font-bold text-zinc-900 dark:text-white">matches & messages</span>
              <p className="text-[10px] text-zinc-400">status, sender_id, text, time</p>
            </div>
          </div>
        </div>

        {/* Test & Seed Neon Action */}
        <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col space-y-3">
          <button
            onClick={handleInitDb}
            disabled={isInitializing}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-600/20 active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${isInitializing ? 'animate-spin' : ''}`} />
            <span>{isInitializing ? 'Initializing Tables in Neon...' : 'Test & Initialize Neon Schema'}</span>
          </button>

          {initResult && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start space-x-2 ${
                initResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
              }`}
            >
              {initResult.success ? (
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              )}
              <span className="leading-relaxed">{initResult.message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
