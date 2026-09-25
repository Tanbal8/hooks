import PersianDate from 'tanbal-persian-date';
import { sum } from '@/utils/array';

const getTransactionsData = (
    transactions,
    categories,
    today,
) => {
    if (
        !transactions || transactions.length === 0 ||
        !categories || categories.length === 0
    ) return {};

    const expenses = transactions.filter(transaction => transaction.type === 'expense');
    const incomes = transactions.filter(transaction => transaction.type === 'income');

    const transactionsCount = transactions.length;

    const maxDate = PersianDate.parseDate(
      transactions.reduce((max, transaction) =>
        transaction.date > max ? transaction.date : max,
        transactions[0]?.date
      ) || today
    );

    const minDate = PersianDate.parseDate(
      transactions.reduce((min, transaction) =>
        transaction.date < min ? transaction.date : min,
        transactions[0]?.date
      ) || today
    );

    const lastTransaction = transactions
      .filter(transaction => transaction.date === maxDate.toDate('-'))
    .at(-1);
    const remaining = lastTransaction?.remaining || 0;

    const weekDays = today.getWeekDays();
    const monthDays = today.getMonthDays();

    const todayExpenses = expenses.filter(
      transaction => transaction.date === today.toDate()
    );

    const weekExpenses = expenses.filter(
      transaction => weekDays.some(
        day => transaction.date === day.toDate()
      )
    );

    const monthExpenses = expenses.filter(
      transaction => monthDays.some(
        day => transaction.date === day.toDate()
      )
    );
    const monthIncomes = incomes.filter(
      transaction => monthDays.some(
        day => transaction.date === day.toDate()
      )
    );

    const todayExpense = sum(todayExpenses, transaction => transaction.amount);
    const weekExpense = sum(weekExpenses, transaction => transaction.amount);
    const monthExpense = sum(monthExpenses, transaction => transaction.amount);
    const monthIncome = sum(monthIncomes, transaction => transaction.amount);
    
    const highestExpenseAmount = expenses.length > 0 ?
      Math.max(...expenses.map(transaction =>
        transaction.amount)
      ) : 0;
    const highestExpenseTitle = expenses.find(transaction => highestExpenseAmount > 0 && transaction.amount === highestExpenseAmount)?.title || '';

    const categoriesExpenses = categories.map(category => {
        const categoryTransactions = expenses.filter(transaction => transaction.categoryId === category.id);
        const categoryExpense = categoryTransactions.reduce((total, transaction) => total + transaction.amount, 0);
        return {
          title: category.title,
          expense: categoryExpense,
        };
    });
    const maxCategoryExpense = Math.max(...categoriesExpenses.map(category => category.expense));
    const topCategory = categoriesExpenses.find(category => maxCategoryExpense > 0 && category.expense === maxCategoryExpense)?.title || '';

    return {
      dates: {
        min: minDate,
        max: maxDate,
      },
      remaining,
      transactionsCount,
      today: {
        expense: todayExpense,
      },
      week: {
        expense: weekExpense,
      },
      month: {
        expense: monthExpense,
        income: monthIncome,
        net: monthIncome - monthExpense,
      },
      highestExpense: {
        title: highestExpenseTitle,
        amount: highestExpenseAmount,
      },
      categories: {
        top: topCategory,
        maxExpense: maxCategoryExpense,
      },
    };
}

export default getTransactionsData;