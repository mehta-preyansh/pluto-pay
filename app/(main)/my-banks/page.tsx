import BankCard from "@/components/ui/BankCard";
import HeaderBox from "@/components/ui/HeaderBox";
import { getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import React from "react";

const MyBanks = async () => {
  const loggedInUser = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedInUser?.$id });
  return (
    <section className="flex">
      <div className="my-banks">
        <HeaderBox
          heading="My bank accounts"
          subHeading="Manage your bank accounts on Pluto pay"
        />
        <div className="space-y-4">
          <h2 className="header-2">Your cards</h2>
          <div className="flex flex-wrap gap-6">
            {accounts &&
              accounts.data.map((account: Account) => (
                <BankCard
                  key={accounts.id}
                  account={account}
                  userName={loggedInUser?.firstName}
                  showBalance
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyBanks;
