import React, { useState } from 'react';
import { Transaction, BankAccount, WithdrawalRecord, AppLanguage, UserProfile } from '../types';
import {
  Wallet,
  ArrowDownLeft,
  Building2,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  Star,
  Check,
  X,
  History,
  ShieldCheck,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export const MALAYSIAN_BANKS = [
  'Maybank',
  'CIMB Bank',
  'Public Bank',
  'RHB Bank',
  'Bank Islam',
  'Hong Leong Bank',
  'AmBank',
  'Bank Rakyat',
  'BSN',
  'Affin Bank',
  'Alliance Bank',
  'Bank Muamalat',
  'Agrobank',
  'Other Malaysian banks'
];

interface SellerEarningsViewProps {
  language: AppLanguage;
  availableBalance: number;
  pendingBalance: number;
  totalWithdrawn: number;
  completedSales: Transaction[];
  bankAccounts: BankAccount[];
  withdrawalHistory: WithdrawalRecord[];
  onAddBankAccount: (bank: Omit<BankAccount, 'id'>) => void;
  onEditBankAccount: (id: string, updated: Partial<BankAccount>) => void;
  onDeleteBankAccount: (id: string) => void;
  onSetDefaultBankAccount: (id: string) => void;
  onExecuteWithdrawal: (record: Omit<WithdrawalRecord, 'id'>) => void;
  userProfile?: UserProfile;
}

export const SellerEarningsView: React.FC<SellerEarningsViewProps> = ({
  language,
  availableBalance,
  pendingBalance,
  totalWithdrawn,
  completedSales,
  bankAccounts,
  withdrawalHistory,
  onAddBankAccount,
  onEditBankAccount,
  onDeleteBankAccount,
  onSetDefaultBankAccount,
  onExecuteWithdrawal,
  userProfile
}) => {
  const isBm = language === 'bm';

  // Withdrawal Wizard Modal State (Steps 1 to 5)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [withdrawAmount, setWithdrawAmount] = useState<number | string>(availableBalance > 0 ? availableBalance : 50);
  const [selectedBankId, setSelectedBankId] = useState<string>(() => {
    const defaultAcc = bankAccounts.find((b) => b.isDefault);
    return defaultAcc?.id || bankAccounts[0]?.id || '';
  });
  const [activeWithdrawalStatus, setActiveWithdrawalStatus] = useState<'Pending' | 'Processing' | 'Completed' | 'Failed'>('Processing');
  const [lastTxId, setLastTxId] = useState<string>('');

  // Bank Account Form Modal State
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [editingBankId, setEditingBankId] = useState<string | null>(null);
  const [holderName, setHolderName] = useState(userProfile?.name || 'Aqil Bin Roslan');
  const [bankName, setBankName] = useState('Maybank');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState<'Akaun Simpanan (Savings)' | 'Akaun Semasa (Current)'>('Akaun Simpanan (Savings)');
  const [isDefaultAccount, setIsDefaultAccount] = useState(false);

  // Selected bank for withdrawal
  const chosenBank = bankAccounts.find((b) => b.id === selectedBankId) || bankAccounts[0];

  // Open add bank modal
  const handleOpenAddBank = () => {
    setEditingBankId(null);
    setHolderName(userProfile?.name || '');
    setBankName('Maybank');
    setAccountNumber('');
    setAccountType('Akaun Simpanan (Savings)');
    setIsDefaultAccount(bankAccounts.length === 0);
    setIsBankModalOpen(true);
  };

  // Open edit bank modal
  const handleOpenEditBank = (bank: BankAccount) => {
    setEditingBankId(bank.id);
    setHolderName(bank.accountHolderName);
    setBankName(bank.bankName);
    setAccountNumber(bank.accountNumber);
    setAccountType(bank.accountType);
    setIsDefaultAccount(bank.isDefault);
    setIsBankModalOpen(true);
  };

  // Save bank account
  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber.trim()) return;

    if (editingBankId) {
      onEditBankAccount(editingBankId, {
        accountHolderName: holderName,
        bankName,
        accountNumber,
        accountType,
        isDefault: isDefaultAccount
      });
    } else {
      onAddBankAccount({
        accountHolderName: holderName,
        bankName,
        accountNumber,
        accountType,
        isDefault: isDefaultAccount || bankAccounts.length === 0
      });
    }
    setIsBankModalOpen(false);
  };

  // Start withdrawal wizard
  const handleStartWithdraw = () => {
    if (availableBalance <= 0) return;
    setWithdrawAmount(availableBalance);
    const defaultAcc = bankAccounts.find((b) => b.isDefault) || bankAccounts[0];
    if (defaultAcc) setSelectedBankId(defaultAcc.id);
    setWithdrawStep(1);
    setIsWithdrawOpen(true);
  };

  // Confirm withdrawal execution (Steps 4 & 5)
  const handleConfirmWithdrawal = () => {
    const numAmount = typeof withdrawAmount === 'string' ? parseFloat(withdrawAmount) || 0 : withdrawAmount;
    if (numAmount <= 0 || numAmount > availableBalance || !chosenBank) return;

    const txId = `WD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
    setLastTxId(txId);
    setWithdrawStep(5);
    setActiveWithdrawalStatus('Processing');

    // Simulate instant status progression to Completed
    setTimeout(() => {
      setActiveWithdrawalStatus('Completed');
      onExecuteWithdrawal({
        date: 'Hari ini',
        amount: numAmount,
        bankName: chosenBank.bankName,
        accountNumber: chosenBank.accountNumber,
        accountHolderName: chosenBank.accountHolderName,
        status: 'Completed',
        processingNote: isBm ? 'Pindahan DuitNow berjaya dikreditkan.' : 'DuitNow transfer credited successfully.'
      });
    }, 1500);
  };

  const withdrawAmountNum = typeof withdrawAmount === 'string' ? parseFloat(withdrawAmount) || 0 : withdrawAmount;
  const isAmountValid = withdrawAmountNum >= 5 && withdrawAmountNum <= availableBalance;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      {/* Title & Banner */}
      <div className="pt-1">
        <h1 className="font-display font-black text-2xl sm:text-3xl text-[#1e3f33]">
          {isBm ? 'Pendapatan Jualan Sebenar' : 'Actual Sales Earnings'}
        </h1>
        <p className="text-xs sm:text-sm text-[#52796F] mt-0.5">
          {isBm
            ? 'Pendapatan yang dijana secara sah daripada pesanan jualan yang telah disahkan dan selesai.'
            : 'Real earnings generated from completed, verified buyer sales.'}
        </p>
      </div>

      {/* Main Wallet Card */}
      <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-7 shadow-xs border border-[#e5dfd7] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#234e3f] uppercase tracking-wider">
              <Wallet className="w-4 h-4 text-[#234e3f]" />
              <span>{isBm ? 'Baki Boleh Dikeluarkan' : 'Available Balance'}</span>
            </div>
            <div className="font-display font-black text-4xl sm:text-5xl text-[#1e3f33] mt-1 tracking-tight">
              RM{availableBalance.toFixed(2)}
            </div>
            <p className="text-[11px] text-[#52796F] font-semibold mt-1">
              {isBm ? 'Baki daripada jualan barangan yang siap dibayar' : 'Earnings from completed buyer sales ready for bank withdrawal'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleStartWithdraw}
            disabled={availableBalance <= 0}
            className={`font-black text-sm py-3 px-5 rounded-2xl shadow-xs transition flex items-center gap-2 cursor-pointer touch-target ${
              availableBalance > 0
                ? 'bg-lime-400 hover:bg-lime-500 text-[#1e3f33] active:scale-[0.98]'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <ArrowDownLeft className="w-5 h-5 text-[#1e3f33]" />
            <span>{isBm ? 'Keluarkan Wang' : 'Withdraw Earnings'}</span>
          </button>
        </div>

        {/* 2 Core Sub-Metrics (Pending & Total Withdrawn - NO ESTIMATES) */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#e5dfd7]">
          <div className="bg-white p-3.5 rounded-2xl border border-[#e5dfd7] space-y-0.5">
            <div className="flex items-center gap-1.5 text-[11px] text-[#52796F] font-bold">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{isBm ? 'Baki Dalam Proses' : 'Pending Balance'}</span>
            </div>
            <span className="font-display font-black text-lg sm:text-xl text-amber-700 block">
              RM{pendingBalance.toFixed(2)}
            </span>
            <span className="text-[10px] text-[#52796F]">
              {isBm ? 'Pesanan dalam penghantaran' : 'Orders in transit'}
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-[#e5dfd7] space-y-0.5">
            <div className="flex items-center gap-1.5 text-[11px] text-[#52796F] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isBm ? 'Jumlah Dikeluarkan' : 'Total Withdrawn'}</span>
            </div>
            <span className="font-display font-black text-lg sm:text-xl text-[#1e3f33] block">
              RM{totalWithdrawn.toFixed(2)}
            </span>
            <span className="text-[10px] text-[#52796F]">
              {isBm ? 'Telah dipindahkan ke bank' : 'Transferred to bank'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BANK ACCOUNT MANAGEMENT SECTION */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 border border-[#e5dfd7] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="font-display font-black text-lg text-[#1e3f33] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#234e3f]" />
              <span>{isBm ? 'Akaun Bank Malaysia' : 'Malaysian Bank Account'}</span>
            </h2>
            <p className="text-xs text-[#52796F]">
              {isBm
                ? 'Daftar akaun bank tempatan untuk pemindahan wang hasil jualan.'
                : 'Register your local Malaysian bank account for earnings payout.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddBank}
            className="bg-[#234e3f] hover:bg-[#18392e] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer touch-target"
          >
            <Plus className="w-4 h-4" />
            <span>{isBm ? 'Tambah Akaun Bank' : 'Add Bank Account'}</span>
          </button>
        </div>

        {/* Bank Accounts List */}
        <div className="space-y-2.5">
          {bankAccounts.length === 0 ? (
            <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-[#e5dfd7] text-center space-y-2">
              <CreditCard className="w-8 h-8 text-[#52796F] mx-auto opacity-60" />
              <p className="text-xs font-bold text-[#1e3f33]">
                {isBm ? 'Tiada akaun bank didaftarkan' : 'No bank accounts registered'}
              </p>
              <p className="text-[11px] text-[#52796F]">
                {isBm
                  ? 'Sila tambah akaun Maybank, CIMB, BSN atau bank tempatan anda.'
                  : 'Add your Maybank, CIMB, BSN, or other Malaysian bank account.'}
              </p>
            </div>
          ) : (
            bankAccounts.map((account) => (
              <div
                key={account.id}
                className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                  account.isDefault
                    ? 'bg-[#eef5f1] border-[#234e3f] ring-1 ring-[#234e3f]/40'
                    : 'bg-[#FAF8F5] border-[#e5dfd7] hover:border-[#234e3f]/40'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#1e3f33]">
                      {account.bankName}
                    </span>
                    {account.isDefault && (
                      <span className="bg-[#234e3f] text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>{isBm ? 'Akaun Utama (Default)' : 'Default'}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono font-bold text-[#234e3f]">
                    {account.accountNumber}
                  </p>
                  <p className="text-[11px] text-[#52796F]">
                    {account.accountHolderName} · {account.accountType}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {!account.isDefault && (
                    <button
                      type="button"
                      onClick={() => onSetDefaultBankAccount(account.id)}
                      className="p-2 text-stone-500 hover:text-[#234e3f] hover:bg-white rounded-lg transition text-xs font-bold flex items-center gap-1 cursor-pointer"
                      title={isBm ? 'Jadikan Utama' : 'Set Default'}
                    >
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className="hidden sm:inline">{isBm ? 'Utama' : 'Default'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleOpenEditBank(account)}
                    className="p-2 text-stone-500 hover:text-[#234e3f] hover:bg-white rounded-lg transition cursor-pointer"
                    title={isBm ? 'Sunting' : 'Edit'}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteBankAccount(account.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title={isBm ? 'Padam' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COMPLETED SALES HISTORY (ACTUAL EARNINGS) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 border border-[#e5dfd7] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-black text-lg text-[#1e3f33] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-700" />
            <span>{isBm ? 'Jualan Selesai (Hasil Sebenar)' : 'Completed Sales (Actual Earnings)'}</span>
          </h2>
          <span className="text-xs font-bold text-[#234e3f] bg-[#eef5f1] px-2.5 py-0.5 rounded-full">
            {completedSales.length} {isBm ? 'transaksi' : 'transactions'}
          </span>
        </div>

        <div className="space-y-2">
          {completedSales.length === 0 ? (
            <p className="text-xs text-[#52796F] p-4 text-center">
              {isBm ? 'Tiada jualan selesai lagi.' : 'No completed sales recorded yet.'}
            </p>
          ) : (
            completedSales.map((sale) => (
              <div
                key={sale.id}
                className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#e5dfd7] flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <p className="font-extrabold text-[#1e3f33]">{sale.title}</p>
                  <p className="text-[11px] text-[#52796F]">
                    {sale.date} · {isBm ? 'Pembeli:' : 'Buyer:'} <span className="text-[#234e3f] font-bold">{sale.recipientOrSource}</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-black text-sm text-emerald-700 block">
                    + RM{sale.amount.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {isBm ? 'Selesai' : 'Completed'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* WITHDRAWAL HISTORY */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 border border-[#e5dfd7] shadow-xs space-y-3">
        <h2 className="font-display font-black text-lg text-[#1e3f33] flex items-center gap-2">
          <History className="w-5 h-5 text-[#234e3f]" />
          <span>{isBm ? 'Sejarah Pengeluaran Wang' : 'Withdrawal History'}</span>
        </h2>

        <div className="space-y-2">
          {withdrawalHistory.length === 0 ? (
            <p className="text-xs text-[#52796F] p-4 text-center">
              {isBm ? 'Tiada sejarah pengeluaran lagi.' : 'No withdrawals made yet.'}
            </p>
          ) : (
            withdrawalHistory.map((rec) => {
              const statusColors = {
                Pending: 'bg-amber-100 text-amber-900 border-amber-300',
                Processing: 'bg-sky-100 text-sky-900 border-sky-300',
                Completed: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                Failed: 'bg-rose-100 text-rose-900 border-rose-300'
              };

              return (
                <div
                  key={rec.id}
                  className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#e5dfd7] flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[#1e3f33]">{rec.bankName}</span>
                      <span className="font-mono text-[11px] text-[#52796F]">({rec.accountNumber})</span>
                    </div>
                    <p className="text-[11px] text-[#52796F]">
                      {rec.date} · ID: <span className="font-mono font-bold text-[#234e3f]">{rec.id}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm text-[#1e3f33]">
                      RM{rec.amount.toFixed(2)}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-black border ${
                        statusColors[rec.status] || 'bg-stone-100 text-stone-800'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5-STEP WITHDRAWAL WIZARD MODAL */}
      {/* ========================================================================= */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-[#e5dfd7] shadow-2xl my-6">
            {/* Modal Header & Progress */}
            <div className="space-y-2 border-b border-[#f0eae1] pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center font-black text-sm">
                    {withdrawStep}
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg text-[#1e3f33]">
                      {isBm ? 'Keluarkan Wang ke Bank' : 'Withdraw Earnings'}
                    </h3>
                    <p className="text-[11px] text-[#52796F]">
                      {isBm ? `Langkah ${withdrawStep} daripada 5` : `Step ${withdrawStep} of 5`}
                    </p>
                  </div>
                </div>

                {withdrawStep < 5 && (
                  <button
                    type="button"
                    onClick={() => setIsWithdrawOpen(false)}
                    className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#234e3f] h-full transition-all duration-300"
                  style={{ width: `${(withdrawStep / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* STEP 1: Enter Withdrawal Amount */}
            {withdrawStep === 1 && (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-[#eef5f1] rounded-2xl border border-[#234e3f]/20">
                  <span className="text-[11px] text-[#52796F] font-bold block">
                    {isBm ? 'Baki Boleh Dikeluarkan Semasa:' : 'Current Available Balance:'}
                  </span>
                  <span className="font-display font-black text-2xl text-[#1e3f33]">
                    RM{availableBalance.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#1e3f33] block">
                    {isBm ? 'Jumlah Pengeluaran (RM)' : 'Withdrawal Amount (RM)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-stone-400 text-sm">
                      RM
                    </span>
                    <input
                      type="number"
                      step="1"
                      min="5"
                      max={availableBalance}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full bg-[#FAF8F5] pl-10 pr-4 py-3 rounded-xl border border-[#e5dfd7] font-black text-lg text-[#1e3f33] focus:outline-hidden focus:ring-2 focus:ring-[#234e3f]"
                    />
                  </div>
                  <p className="text-[11px] text-[#52796F]">
                    {isBm ? 'Pengeluaran minimum RM5.00' : 'Minimum withdrawal RM5.00'}
                  </p>
                </div>

                {/* Quick amount pills */}
                <div className="flex gap-2">
                  {[20, 50, 100, availableBalance].map((val, idx) => {
                    if (val > availableBalance && idx < 3) return null;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setWithdrawAmount(val)}
                        className="flex-1 py-1.5 px-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs font-bold text-[#1e3f33] cursor-pointer"
                      >
                        {idx === 3 ? (isBm ? 'Semua' : 'All') : `RM${val}`}
                      </button>
                    );
                  })}
                </div>

                {!isAmountValid && (
                  <p className="text-rose-600 text-[11px] font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>
                      {withdrawAmountNum > availableBalance
                        ? (isBm ? 'Jumlah tidak boleh melebihi baki boleh dikeluarkan.' : 'Cannot exceed available balance.')
                        : (isBm ? 'Jumlah minimum ialah RM5.00' : 'Minimum amount is RM5.00')}
                    </span>
                  </p>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    disabled={!isAmountValid}
                    onClick={() => setWithdrawStep(2)}
                    className="w-full bg-[#234e3f] hover:bg-[#1a3b30] disabled:bg-stone-300 text-white font-extrabold py-3 px-4 rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{isBm ? 'Seterusnya: Pilih Bank' : 'Next: Select Bank'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Select Registered Bank Account */}
            {withdrawStep === 2 && (
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#1e3f33] block">
                    {isBm ? 'Pilih Akaun Bank Penerima:' : 'Select Receiving Bank Account:'}
                  </label>
                  <p className="text-[11px] text-[#52796F]">
                    {isBm ? 'Wang akan dipindahkan melalui DuitNow / Instant Transfer.' : 'Funds will be transferred via DuitNow / Instant Transfer.'}
                  </p>
                </div>

                <div className="space-y-2">
                  {bankAccounts.map((acc) => (
                    <label
                      key={acc.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                        selectedBankId === acc.id
                          ? 'bg-[#eef5f1] border-[#234e3f] ring-1 ring-[#234e3f]'
                          : 'bg-[#FAF8F5] border-[#e5dfd7]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="selected_bank"
                          checked={selectedBankId === acc.id}
                          onChange={() => setSelectedBankId(acc.id)}
                          className="accent-[#234e3f] w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-[#1e3f33]">{acc.bankName}</span>
                            {acc.isDefault && (
                              <span className="text-[10px] bg-[#234e3f] text-white px-1.5 rounded-md font-bold">
                                Utama
                              </span>
                            )}
                          </div>
                          <p className="font-mono text-xs text-[#234e3f]">{acc.accountNumber}</p>
                          <p className="text-[11px] text-[#52796F]">{acc.accountHolderName}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddBank}
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[#234e3f]/40 hover:bg-[#eef5f1] font-bold text-[#234e3f] text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isBm ? 'Daftar Akaun Bank Baharu' : 'Register New Bank Account'}</span>
                </button>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawStep(1)}
                    className="px-4 py-2.5 rounded-xl border border-[#e5dfd7] font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
                  >
                    {isBm ? 'Kembali' : 'Back'}
                  </button>
                  <button
                    type="button"
                    disabled={!chosenBank}
                    onClick={() => setWithdrawStep(3)}
                    className="bg-[#234e3f] hover:bg-[#1a3b30] text-white font-extrabold py-2.5 px-5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{isBm ? 'Semak Butiran' : 'Review Details'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Review Withdrawal Details */}
            {withdrawStep === 3 && chosenBank && (
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-[#1e3f33]">
                    {isBm ? 'Semak Butiran Pengeluaran' : 'Review Withdrawal Details'}
                  </h4>
                  <p className="text-[#52796F]">
                    {isBm ? 'Sila pastikan maklumat bank anda adalah tepat.' : 'Please ensure all bank details are correct.'}
                  </p>
                </div>

                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#e5dfd7] space-y-3">
                  <div className="flex justify-between py-1 border-b border-[#f0eae1]">
                    <span className="text-[#52796F]">{isBm ? 'Jumlah Dikeluarkan' : 'Amount'}:</span>
                    <span className="font-black text-base text-[#1e3f33]">RM{withdrawAmountNum.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#f0eae1]">
                    <span className="text-[#52796F]">{isBm ? 'Bank Penerima' : 'Bank'}:</span>
                    <span className="font-extrabold text-[#1e3f33]">{chosenBank.bankName}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#f0eae1]">
                    <span className="text-[#52796F]">{isBm ? 'Nombor Akaun' : 'Account No'}:</span>
                    <span className="font-mono font-bold text-[#234e3f]">{chosenBank.accountNumber}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#f0eae1]">
                    <span className="text-[#52796F]">{isBm ? 'Pemegang Akaun' : 'Account Holder'}:</span>
                    <span className="font-extrabold text-[#1e3f33]">{chosenBank.accountHolderName}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#f0eae1]">
                    <span className="text-[#52796F]">{isBm ? 'Caj Pemprosesan' : 'Fee'}:</span>
                    <span className="font-bold text-emerald-700">RM0.00 ({isBm ? 'Percuma' : 'Free'})</span>
                  </div>

                  <div className="flex justify-between pt-1 font-black text-sm text-[#1e3f33]">
                    <span>{isBm ? 'Jumlah Dikreditkan' : 'Net Payout'}:</span>
                    <span className="text-lg text-emerald-800">RM{withdrawAmountNum.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawStep(2)}
                    className="px-4 py-2.5 rounded-xl border border-[#e5dfd7] font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
                  >
                    {isBm ? 'Kembali' : 'Back'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawStep(4)}
                    className="bg-[#234e3f] hover:bg-[#1a3b30] text-white font-extrabold py-2.5 px-5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{isBm ? 'Sahkan Pengeluaran' : 'Proceed to Confirm'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Confirm Withdrawal */}
            {withdrawStep === 4 && chosenBank && (
              <div className="space-y-4 text-xs text-center py-2">
                <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h4 className="font-display font-black text-lg text-[#1e3f33]">
                    {isBm ? 'Sahkan Pindahan Wang' : 'Confirm Payout Transfer'}
                  </h4>
                  <p className="text-xs text-[#52796F] max-w-xs mx-auto">
                    {isBm
                      ? `Anda pasti ingin memindahkan RM${withdrawAmountNum.toFixed(2)} ke akaun ${chosenBank.bankName} (${chosenBank.accountNumber})?`
                      : `Are you sure you want to transfer RM${withdrawAmountNum.toFixed(2)} to ${chosenBank.bankName} (${chosenBank.accountNumber})?`}
                  </p>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={handleConfirmWithdrawal}
                    className="w-full bg-lime-400 hover:bg-lime-500 text-[#1e3f33] font-black py-3 px-4 rounded-xl transition cursor-pointer shadow-xs"
                  >
                    {isBm ? 'Ya, Sahkan & Pindahkan Sekarang' : 'Yes, Confirm & Transfer Now'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawStep(3)}
                    className="w-full py-2.5 px-4 font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
                  >
                    {isBm ? 'Semak Semula' : 'Review Again'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: Show Withdrawal Status */}
            {withdrawStep === 5 && (
              <div className="space-y-5 text-xs text-center py-3">
                {activeWithdrawalStatus === 'Processing' ? (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="w-16 h-16 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <Clock className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display font-black text-lg text-[#1e3f33]">
                        {isBm ? 'Pindahan Sedang Diproses...' : 'Transfer Processing...'}
                      </h4>
                      <p className="text-xs text-[#52796F]">
                        {isBm ? 'Menghubungkan ke gerbang DuitNow bank anda.' : 'Connecting to DuitNow banking gateway.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 animate-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display font-black text-xl text-[#1e3f33]">
                        {isBm ? 'Pindahan Wang Selesai (Completed)' : 'Withdrawal Completed!'}
                      </h4>
                      <p className="text-xs text-[#52796F]">
                        {isBm
                          ? `RM${withdrawAmountNum.toFixed(2)} telah berjaya dipindahkan ke akaun ${chosenBank?.bankName}.`
                          : `RM${withdrawAmountNum.toFixed(2)} transferred successfully to your ${chosenBank?.bankName} account.`}
                      </p>
                    </div>

                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#e5dfd7] text-left text-[11px] space-y-1">
                      <p><span className="text-[#52796F]">ID Transaksi:</span> <span className="font-mono font-bold text-[#1e3f33]">{lastTxId}</span></p>
                      <p><span className="text-[#52796F]">Status:</span> <span className="font-bold text-emerald-700">Completed (Selesai)</span></p>
                      <p><span className="text-[#52796F]">Penerima:</span> <span className="font-bold text-[#1e3f33]">{chosenBank?.accountHolderName}</span></p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsWithdrawOpen(false)}
                      className="w-full bg-[#234e3f] hover:bg-[#1a3b30] text-white font-extrabold py-3 px-4 rounded-xl transition cursor-pointer"
                    >
                      {isBm ? 'Selesai & Tutup' : 'Done & Close'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BANK ACCOUNT MODAL (ADD / EDIT) */}
      {/* ========================================================================= */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-[#e5dfd7] shadow-2xl my-6">
            <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#234e3f]" />
                <h3 className="font-display font-black text-lg text-[#1e3f33]">
                  {editingBankId
                    ? (isBm ? 'Sunting Akaun Bank' : 'Edit Bank Account')
                    : (isBm ? 'Tambah Akaun Bank Malaysia' : 'Add Bank Account')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBankModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBank} className="space-y-4 text-xs">
              {/* Account Holder Name */}
              <div className="space-y-1">
                <label className="font-bold text-[#1e3f33] block">
                  {isBm ? 'Nama Pemegang Akaun' : 'Account Holder Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  placeholder="cth: Aqil Bin Roslan"
                  className="w-full bg-[#FAF8F5] px-3.5 py-2.5 rounded-xl border border-[#e5dfd7] font-semibold text-[#1e3f33] focus:outline-hidden focus:ring-2 focus:ring-[#234e3f]"
                />
              </div>

              {/* Bank Name Dropdown */}
              <div className="space-y-1">
                <label className="font-bold text-[#1e3f33] block">
                  {isBm ? 'Nama Bank' : 'Bank Name'} *
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-[#FAF8F5] px-3.5 py-2.5 rounded-xl border border-[#e5dfd7] font-bold text-[#1e3f33] focus:outline-hidden focus:ring-2 focus:ring-[#234e3f]"
                >
                  {MALAYSIAN_BANKS.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bank Account Number */}
              <div className="space-y-1">
                <label className="font-bold text-[#1e3f33] block">
                  {isBm ? 'Nombor Akaun Bank' : 'Bank Account Number'} *
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9-]/g, ''))}
                  placeholder="cth: 1410-0293-8812"
                  className="w-full bg-[#FAF8F5] px-3.5 py-2.5 rounded-xl border border-[#e5dfd7] font-mono font-bold text-[#1e3f33] focus:outline-hidden focus:ring-2 focus:ring-[#234e3f]"
                />
              </div>

              {/* Account Type */}
              <div className="space-y-1">
                <label className="font-bold text-[#1e3f33] block">
                  {isBm ? 'Jenis Akaun' : 'Account Type'} *
                </label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value as any)}
                  className="w-full bg-[#FAF8F5] px-3.5 py-2.5 rounded-xl border border-[#e5dfd7] font-semibold text-[#1e3f33] focus:outline-hidden focus:ring-2 focus:ring-[#234e3f]"
                >
                  <option value="Akaun Simpanan (Savings)">{isBm ? 'Akaun Simpanan (Savings)' : 'Savings Account'}</option>
                  <option value="Akaun Semasa (Current)">{isBm ? 'Akaun Semasa (Current)' : 'Current Account'}</option>
                </select>
              </div>

              {/* Set as default checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isDefaultAccount}
                  onChange={(e) => setIsDefaultAccount(e.target.checked)}
                  className="w-4 h-4 accent-[#234e3f]"
                />
                <span className="font-bold text-[#1e3f33]">
                  {isBm ? 'Jadikan sebagai akaun bank utama (Default)' : 'Set as default bank account'}
                </span>
              </label>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#f0eae1]">
                <button
                  type="button"
                  onClick={() => setIsBankModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#e5dfd7] font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  {isBm ? 'Batal' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="bg-[#234e3f] hover:bg-[#1a3b30] text-white font-extrabold px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
                >
                  {isBm ? 'Simpan Akaun Bank' : 'Save Bank Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
