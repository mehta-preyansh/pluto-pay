import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import React from 'react'

const HeaderBox = ({type, heading, user, subHeading} : HeaderBoxProps) => {
  
  return (
    <div className="header-box">
      <h1 className="header-box-heading">
        {heading}
        {type === 'greeting' && <span className='text-bankGradient'>&nbsp;{user}</span>}
      </h1>
      <p className="header-box-subheading">
        {subHeading}
      </p>
    </div>
  )
}

export default HeaderBox