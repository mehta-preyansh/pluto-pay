import HeaderBox from '@/components/ui/HeaderBox'
import PaymentForm from '@/components/ui/PaymentForm'
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import React from 'react'

const PaymentTransfer = async () => {
  const loggedInUser = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedInUser?.$id });
  if (!accounts) return null;
  const accountsData = accounts?.data;
  return (
    <section className="payment-transfer">
      <HeaderBox heading='Payment transfer' subHeading='Please provide any specific details or notes related to the payment transfer'/>
      <section className="size-full pt-5">
        <PaymentForm accounts={accountsData}/>
      </section>
    </section>
  )
}

export default PaymentTransfer