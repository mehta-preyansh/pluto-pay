import HeaderBox from "@/components/ui/HeaderBox";
import RecentTransactions from "@/components/ui/RecentTransactions";
import RightSidebar from "@/components/ui/RightSidebar";
import TotalBalanceBox from "@/components/ui/TotalBalanceBox";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import React from "react";

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  const loggedInUser = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedInUser?.$id });
  if (!accounts) return null;
  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;
  const account = await getAccount({ appwriteItemId });
  // console.log("Logged in user: ", loggedInUser);
  // console.log("Accounts: ", accounts);
  // console.log("First account: ", account);
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            subHeading="Access all your accounts and transactions seamlessly"
            heading="Welcome"
            type="greeting"
            user={loggedInUser.firstName || "Guest"}
          />
          <TotalBalanceBox
            accounts={accountsData}
            totalBanksCount={accounts.totalBanks}
            totalBalance={accounts.totalCurrentBalance}
          />
        </header>
        <RecentTransactions
          accounts={accountsData}
          transactions={account?.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
      </div>

      <RightSidebar
        user={loggedInUser}
        transactions={account?.transactions}
        banks={accountsData?.slice(0, 2)}
      />
    </section>
  );
};

export default Home;
