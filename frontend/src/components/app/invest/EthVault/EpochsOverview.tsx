import React from 'react';
import { Info } from 'lucide-react';
import Tooltip from './Tooltip';
import { formatEther } from 'viem';

interface EpochData {
    id: number;
    apr: string;
    tvl: string;
    status: string;
}

interface EpochRowProps {
    epoch: EpochData;
    isClaimable: boolean;
    investment: string;
}

const EpochRow: React.FC<EpochRowProps> = ({ epoch, isClaimable, investment }) => {
    let tooltipContent = '';

    if (epoch.status === 'Running') {
        tooltipContent = isClaimable
            ? "Investments are locked, rewards have been distributed"
            : "Investments are locked, waiting for rewards distribution";
    } else if (epoch.status === 'Open') {
        tooltipContent = "Investments can be sent and withdrawn";
    } else {
        tooltipContent = "Epoch has ended, rewards have been distributed";
    }

    const formatValue = (value: string) => {
        return parseFloat(value).toFixed(4);
    };

    return (
        <tr className="bg-custom-light-blue">
            <td className="pl-16 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{epoch.id}</td>
            <td className="px-6 py-4 pr-2 whitespace-nowrap text-sm text-gray-500">{epoch.apr}</td>
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                <Tooltip content={tooltipContent}>
                    <span className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${epoch.status === 'Running' ? 'bg-yellow-100 text-yellow-800' :
                        epoch.status === 'Open' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                        {epoch.status}
                        {(epoch.status === 'Open' || epoch.status === 'Running') && (
                            <Info size={16} className="inline-block ml-1 text-gray-400" />
                        )}
                    </span>
                </Tooltip>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatValue(epoch.tvl)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatValue(investment)}</td>
        </tr>
    );
};

interface EpochsOverviewProps {
    epochs: EpochData[];
    isClaimable: boolean;
    investmentPerEpoch: { [key: number]: string };
}

const EpochsOverview: React.FC<EpochsOverviewProps> = ({ epochs, isClaimable, investmentPerEpoch }) => {
    const sortedEpochs = [...epochs].sort((a, b) => b.id - a.id);

    return (
        <div className="bg-custom-light-blue">
            <div className="flex justify-between px-6 py-3">
                {['Epoch', 'APR', 'Status', 'TVL', 'Invested'].map((title) => (
                    <div
                        key={title}
                        className="px-4 py-1 bg-gray-100 text-sm font-medium text-gray-700 uppercase tracking-wider border border-gray-200 rounded-md shadow-sm"
                    >
                        {title}
                    </div>
                ))}
            </div>
            <div className="overflow-x-auto">
                <div className="overflow-y-auto max-h-[300px]">
                    <table className="min-w-full" >
                        <tbody>
                            {sortedEpochs.map((epoch) => {
                                const rawInvestment = investmentPerEpoch[epoch.id] || "0";
                                const formattedInvestment = formatEther(BigInt(rawInvestment));
                                return (
                                    <EpochRow
                                        key={epoch.id}
                                        epoch={epoch}
                                        isClaimable={isClaimable}
                                        investment={formattedInvestment}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EpochsOverview;