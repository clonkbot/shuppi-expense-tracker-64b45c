import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  timestamp: Date;
}

const categories = [
  { name: 'Food', icon: '食', color: '#7B9E87' },
  { name: 'Transport', icon: '車', color: '#8B7355' },
  { name: 'Shopping', icon: '買', color: '#A67B5B' },
  { name: 'Bills', icon: '費', color: '#6B7B8C' },
  { name: 'Entertainment', icon: '遊', color: '#9B7B9B' },
  { name: 'Other', icon: '他', color: '#7B8B7B' },
];

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Food');
  const [showForm, setShowForm] = useState(false);

  const todayTotal = useMemo(() => {
    const today = new Date();
    return expenses
      .filter(e => {
        const expDate = new Date(e.timestamp);
        return expDate.toDateString() === today.toDateString();
      })
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      description: description.trim(),
      amount: parseFloat(amount),
      category: selectedCategory,
      timestamp: new Date(),
    };

    setExpenses(prev => [newExpense, ...prev]);
    setDescription('');
    setAmount('');
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const getCategoryData = (name: string) => {
    return categories.find(c => c.name === name) || categories[5];
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] relative overflow-x-hidden">
      {/* Paper texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-lg mx-auto px-4 py-6 md:py-12 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-block mb-4">
            <span className="text-[#2D2A26] text-5xl md:text-6xl font-light tracking-tight" style={{ fontFamily: 'Crimson Pro, serif' }}>
              出費
            </span>
          </div>
          <p className="text-[#2D2A26]/60 text-sm tracking-widest uppercase" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Daily Expense Tracker
          </p>
        </motion.header>

        {/* Today's Total Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#FEFDFB] rounded-sm border border-[#2D2A26]/10 shadow-[4px_4px_0_rgba(45,42,38,0.08)] mb-6"
        >
          <div className="p-5 md:p-6">
            <div className="flex items-center justify-between border-b border-dashed border-[#2D2A26]/20 pb-4 mb-4">
              <span className="text-[#2D2A26]/50 text-xs tracking-widest uppercase" style={{ fontFamily: 'Crimson Pro, serif' }}>
                Today's Total
              </span>
              <span className="text-[#2D2A26]/50 text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div className="text-center py-4">
              <span
                className="text-4xl md:text-5xl text-[#2D2A26] font-light"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                ${todayTotal.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-dashed border-[#2D2A26]/20 pt-4 flex justify-center">
              <div className="flex items-center gap-1 text-[#2D2A26]/40 text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                <span>•••••••••••••••••••••••••••</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Add Expense Button / Form */}
        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.button
              key="add-button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(true)}
              className="w-full bg-[#7B9E87] text-[#FEFDFB] py-4 px-6 rounded-sm border border-[#7B9E87] shadow-[3px_3px_0_rgba(123,158,135,0.3)] hover:shadow-[1px_1px_0_rgba(123,158,135,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 mb-6"
              style={{ fontFamily: 'Crimson Pro, serif' }}
            >
              <span className="text-lg tracking-wide">+ Add New Expense</span>
            </motion.button>
          ) : (
            <motion.form
              key="expense-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddExpense}
              className="bg-[#FEFDFB] rounded-sm border border-[#2D2A26]/10 shadow-[4px_4px_0_rgba(45,42,38,0.08)] mb-6 overflow-hidden"
            >
              <div className="p-5 md:p-6">
                <div className="flex items-center justify-between border-b border-dashed border-[#2D2A26]/20 pb-4 mb-5">
                  <span className="text-[#2D2A26]/50 text-xs tracking-widest uppercase" style={{ fontFamily: 'Crimson Pro, serif' }}>
                    New Entry
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-[#2D2A26]/40 hover:text-[#2D2A26] transition-colors text-lg"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-5">
                  {/* Description */}
                  <div>
                    <label className="block text-[#2D2A26]/60 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
                      Description
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What did you spend on?"
                      className="w-full bg-transparent border-b-2 border-[#2D2A26]/20 focus:border-[#7B9E87] outline-none py-3 text-[#2D2A26] placeholder-[#2D2A26]/30 transition-colors"
                      style={{ fontFamily: 'Crimson Pro, serif' }}
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-[#2D2A26]/60 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: 'Crimson Pro, serif' }}>
                      Amount
                    </label>
                    <div className="flex items-center">
                      <span className="text-[#2D2A26]/40 text-xl mr-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>$</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-transparent border-b-2 border-[#2D2A26]/20 focus:border-[#7B9E87] outline-none py-3 text-2xl text-[#2D2A26] placeholder-[#2D2A26]/30 transition-colors"
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="block text-[#2D2A26]/60 text-xs tracking-widest uppercase mb-3" style={{ fontFamily: 'Crimson Pro, serif' }}>
                      Category
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.name}
                          type="button"
                          onClick={() => setSelectedCategory(cat.name)}
                          className={`p-3 rounded-sm border-2 transition-all duration-150 ${
                            selectedCategory === cat.name
                              ? 'border-[#2D2A26] bg-[#2D2A26] text-[#FEFDFB]'
                              : 'border-[#2D2A26]/20 hover:border-[#2D2A26]/40'
                          }`}
                        >
                          <span className="block text-xl mb-1">{cat.icon}</span>
                          <span className="text-xs tracking-wide" style={{ fontFamily: 'Crimson Pro, serif' }}>{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full bg-[#7B9E87] text-[#FEFDFB] py-4 px-6 rounded-sm border border-[#7B9E87] shadow-[3px_3px_0_rgba(123,158,135,0.3)] hover:shadow-[1px_1px_0_rgba(123,158,135,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 mt-2"
                    style={{ fontFamily: 'Crimson Pro, serif' }}
                  >
                    <span className="text-lg tracking-wide">Record Expense</span>
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Expenses List */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#2D2A26]/60 text-xs tracking-widest uppercase" style={{ fontFamily: 'Crimson Pro, serif' }}>
              Recent Entries
            </h2>
            <span className="text-[#2D2A26]/40 text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {expenses.length} items
            </span>
          </div>

          <AnimatePresence>
            {expenses.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#FEFDFB] rounded-sm border border-[#2D2A26]/10 p-8 text-center"
              >
                <div className="text-4xl mb-3 opacity-30">空</div>
                <p className="text-[#2D2A26]/40 text-sm" style={{ fontFamily: 'Crimson Pro, serif' }}>
                  No expenses recorded yet
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {expenses.map((expense, index) => {
                  const catData = getCategoryData(expense.category);
                  return (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-[#FEFDFB] rounded-sm border border-[#2D2A26]/10 shadow-[2px_2px_0_rgba(45,42,38,0.05)] group"
                    >
                      <div className="p-4 flex items-center gap-4">
                        {/* Category Icon */}
                        <div
                          className="w-12 h-12 rounded-sm flex items-center justify-center text-[#FEFDFB] text-lg flex-shrink-0"
                          style={{ backgroundColor: catData.color }}
                        >
                          {catData.icon}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[#2D2A26] truncate" style={{ fontFamily: 'Crimson Pro, serif' }}>
                            {expense.description}
                          </p>
                          <p className="text-[#2D2A26]/40 text-xs mt-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                            {formatTime(expense.timestamp)} · {expense.category}
                          </p>
                        </div>

                        {/* Amount */}
                        <div className="text-right flex-shrink-0">
                          <p className="text-[#2D2A26] text-lg" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                            -${expense.amount.toFixed(2)}
                          </p>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="opacity-0 group-hover:opacity-100 text-[#E8927C] hover:text-[#d47a64] transition-all p-2 -mr-2"
                          aria-label="Delete expense"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 pt-6 border-t border-dashed border-[#2D2A26]/10 text-center"
        >
          <p className="text-[#2D2A26]/30 text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            Requested by @nkdcc · Built by @clonkbot
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;
