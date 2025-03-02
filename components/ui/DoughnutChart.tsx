"use client"
import React from 'react'
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const DoughnutChart = ({accounts} : DoughnutChartProps) => {
  const accountNames = accounts.map(account => account.name)
  const balances = accounts.map(account => account.currentBalance)
  const data = {
    datasets: [
      {
        label: "Banks",
        data: balances,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
    labels: accountNames
  }
  return (
    <Doughnut data={data} options={{
      cutout: '60%',
      plugins: {
        legend:{
          display: false
        }
      }
    }}/>
  )
}

export default DoughnutChart