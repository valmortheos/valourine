/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

interface BottomNavProps {
  items: NavItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function BottomNav({ items, activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-24 pb-8 px-6 bottom-nav-blur z-50 flex items-center justify-around max-w-lg mx-auto rounded-t-3xl">
      {items.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;
        
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className="relative flex flex-col items-center justify-center w-12 h-12 outline-none group"
          >
            <div className={cn(
              "p-2.5 rounded-2xl transition-all duration-300",
              isActive ? "bg-zinc-900 text-white scale-110 shadow-xl shadow-zinc-200" : "text-zinc-300 hover:text-zinc-500"
            )}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
          </button>
        );
      })}
    </nav>
  );
}

import { AnimatePresence } from 'motion/react';
