import type { User } from "firebase/auth";
import "./App.css";
import { BudgetSection } from "../components/BudgetSection";
import { Header } from "../components/Header";
import { MonthlySummary } from "../components/MonthlySummary";
import { SalaryCard } from "../components/SalaryCard";
import { StatsOverview } from "../components/StatsOverview";
import { TransactionForm } from "../components/TransactionForm";
import { TransactionsTable } from "../components/TransactionsTable";
import { useBudgets } from "../hooks/useBudgets";
import { useMonthlySalary } from "../hooks/useMonthlySalary";
import { useMonthSelection } from "../hooks/useMonthSelection";
import { useTransactionForm } from "../hooks/useTransactionForm";
import { useTransactions } from "../hooks/useTransactions";
import { EXPENSE_CATEGORY_GROUPS } from "../lib/categories";

type DashboardPageProps = {
  user: User;
  authError: string | null;
  onSignIn: () => void;
  onSignOut: () => void;
};

export default function App({ user, authError, onSignIn, onSignOut }: DashboardPageProps) {
  const { month, setMonth, date, setDate } = useMonthSelection();
  const {
    categoryGroup,
    setCategoryGroup,
    amount,
    setAmount,
    type,
    setType,
    category,
    setCategory,
    note,
    setNote,
    resetAfterSave,
  } = useTransactionForm();
  const { monthTxs, totals, byCategory, daily, addTransaction, removeTransaction, error: txError } =
    useTransactions(user, month);
  const { salary, salaryInput, setSalaryInput, saveSalary, error: salaryError } = useMonthlySalary(user, month);
  const {
    budgets,
    categoryGroup: budgetCategoryGroup,
    setCategoryGroup: setBudgetCategoryGroup,
    categoryInput,
    setCategoryInput,
    amountInput,
    setAmountInput,
    saveBudget,
    error: budgetError,
  } = useBudgets(user, month);

  const error = authError ?? txError ?? salaryError ?? budgetError;
  const available = salary === null ? null : salary + totals.incomes - totals.expenses;

  async function handleAdd() {
    const amountValue = Number(amount);
    const saved = await addTransaction({
      date,
      amount: amountValue,
      type,
      category,
      note,
      createdAt: Date.now(),
    });
    if (saved) {
      resetAfterSave();
    }
  }

  async function handleSaveSalary() {
    await saveSalary();
  }

  async function handleSaveBudget() {
    await saveBudget();
  }

  async function handleDelete(id: string) {
    await removeTransaction(id);
  }

  return (
    <div className="app">
      <Header user={user} onSignIn={onSignIn} onSignOut={onSignOut} />

      <main className="main">
        {error && <div className="alert">{error}</div>}

        <section className="grid grid--full">
          <SalaryCard
            month={month}
            salary={salary}
            salaryInput={salaryInput}
            onSalaryInputChange={setSalaryInput}
            onSaveSalary={handleSaveSalary}
          />
        </section>

        <section className="grid">
          <StatsOverview salary={salary} totals={totals} available={available} />
          <TransactionForm
            categoryGroups={EXPENSE_CATEGORY_GROUPS}
            categoryGroup={categoryGroup}
            onCategoryGroupChange={setCategoryGroup}
            month={month}
            onMonthChange={setMonth}
            date={date}
            onDateChange={setDate}
            amount={amount}
            onAmountChange={setAmount}
            type={type}
            onTypeChange={setType}
            category={category}
            onCategoryChange={setCategory}
            note={note}
            onNoteChange={setNote}
            onSave={handleAdd}
          />
        </section>

        <MonthlySummary month={month} byCategory={byCategory} daily={daily} />

        <BudgetSection
          month={month}
          budgets={budgets}
          spentByCategory={byCategory}
          categoryGroups={EXPENSE_CATEGORY_GROUPS}
          categoryGroup={budgetCategoryGroup}
          onCategoryGroupChange={setBudgetCategoryGroup}
          categoryInput={categoryInput}
          onCategoryChange={setCategoryInput}
          amountInput={amountInput}
          onAmountChange={setAmountInput}
          onSaveBudget={handleSaveBudget}
        />

        <TransactionsTable rows={monthTxs} onDelete={handleDelete} />
      </main>

      <footer className="footer">
        <span className="muted">
          Consejo: en Firebase Console puedes desplegar reglas para que solo tu usuario acceda a sus datos.
        </span>
      </footer>
    </div>
  );
}
