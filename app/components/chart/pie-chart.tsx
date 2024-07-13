import { TDataHour } from '@/app/lib/types';
import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend } from 'recharts';


const COLORS = ['#ADD8E6', '#D8BFD8'];


const calculateDHAverageTP = (datahour: any[]): number => {
    if (datahour.length === 0) return 0;

    let total: number = 0;

    for (let i = 0; i < datahour.length; i++) {
        const eachMeanPresssureTP = parseFloat(datahour[i].mean_pressure_tp);
        total += eachMeanPresssureTP;
    }
    const average = total / datahour.length;
    return parseFloat(average.toFixed(2));
};

const calculateDHAverageAZP = (datahour: any[]): number => {
    if (datahour.length === 0) return 0;

    let total = 0;

    for (let i = 0; i < datahour.length; i++) {
        const eachMeanPresssureAZP = parseFloat(datahour[i].mean_pressure_azp);
        total = total + eachMeanPresssureAZP;
    }

    const average = total / datahour.length;
    return parseFloat(average.toFixed(2));
};


export function DashPieChart({ datahour }: {
    datahour: TDataHour[]
}) {
    const averageTP = calculateDHAverageTP(datahour);
    const averageAZP = calculateDHAverageAZP(datahour);

    const data: any[] = [
        { name: 'Average Total Point', value: averageTP },
        { name: 'Average Zone Point', value: averageAZP },
    ];

    return (

        <ResponsiveContainer width={'100%'} height={300}>
            <PieChart>
                <Legend
                    layout='horizontal'
                    verticalAlign='bottom'
                    align='left'
                    iconType='circle'
                    content={({ payload }: any) => {
                        return (
                            <ul className='flex flex-col space-y-2'>
                                {payload.map((entry: any, index: number) => {
                                    return (
                                        <li key={`item-${index}`} className='flex items-center space-x-2'>
                                            <span className="size-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <div className='space-x-1'>
                                                <span className='text-sm text-muted-foreground'>
                                                    {entry.value}
                                                </span>
                                                <span className='text-sm'>
                                                    {entry.payload.percent * 100}
                                                </span>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        )
                    }}
                />
                <Pie
                    data={data}
                    cx={'50%'}
                    cy={'50%'}
                    outerRadius={90}
                    innerRadius={60}
                    paddingAngle={2}
                    fill='8884d8'
                    dataKey={'value'}
                    labelLine={false}>

                    {
                        data.map((eachData, index) => {
                            return (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            )
                        })
                    }

                </Pie>
            </PieChart>
        </ResponsiveContainer>
    )
}