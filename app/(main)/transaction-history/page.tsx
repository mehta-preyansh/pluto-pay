import { BankDropdown } from "@/components/ui/BankDropdown";
import HeaderBox from "@/components/ui/HeaderBox";
import { Pagination } from "@/components/ui/Pagination";
import TransactionsTable from "@/components/ui/TransactionsTable";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { formatAmount } from "@/lib/utils";
import React from "react";

const TransactionHistory = async ({
  searchParams: { id, page },
}: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  const loggedInUser = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedInUser?.$id });
  if (!accounts) return null;
  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;
  const account = await getAccount({ appwriteItemId });
  const rowsPerPage = 10;
  const totalPages = Math.ceil(account?.transactions.length / rowsPerPage);
  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentTransactions = account?.transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  return (
    <div className="transactions custom-scrollbar">
      <div className="transactions-header">
        <HeaderBox
          heading="Transaction History"
          subHeading="See your bank details and transactions"
        />
        <BankDropdown accounts={accountsData} />
      </div>
      <div className="space-y-6">
        <div className="transactions-account">
          <div className="flex flex-col gap-2">
            <h2 className="text-18 font-bold text-white">
              {account?.data.name}
            </h2>
            <p className="text-14 text-blue-25">{account?.data.officialName}</p>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
            ●●●● ●●●● ●●●● <span className="text-16">{account?.data.mask}</span>
            </p>
          </div>
          <div className="transactions-account-balance">
            <p className="text-14">
              Current Balance
            </p>
            <p className="text-center text-24 font-bold">
              {formatAmount(account?.data.currentBalance)}
            </p>
          </div>
        </div>
        <section className="flex w-full flex-col gap-6">
          <TransactionsTable transactions={currentTransactions}/>
          {totalPages > 1 && (
              <div className="m-4 w-full">
                <Pagination totalPages={totalPages} page={currentPage} />
              </div>
            )}
        </section>
      </div>
    </div>
  );
};

export default TransactionHistory;
