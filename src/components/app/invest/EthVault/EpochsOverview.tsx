import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import CustomTooltip from './Tooltip';

interface EpochData {
    id: number;
    apr: string;
    invested: string;
    tvl: string;
    status: string;
}

interface EpochRowProps {
    epoch: EpochData;
    isClaimable: boolean;
}

const EpochRow: React.FC<EpochRowProps> = ({ epoch, isClaimable }) => {
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

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{epoch.id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{epoch.apr}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <CustomTooltip content={tooltipContent}>
                    <span className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${epoch.status === 'Running' ? 'bg-yellow-100 text-yellow-800' :
                        epoch.status === 'Open' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                        {epoch.status}
                        {(epoch.status === 'Open' || epoch.status === 'Running') && (
                            <Info size={16} className="inline-block ml-1 text-gray-400" />
                        )}
                    </span>
                </CustomTooltip>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parseFloat(epoch.invested).toFixed(4)} ETH</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parseFloat(epoch.tvl).toFixed(4)} ETH</td>
        </tr>
    );
};

interface EpochsOverviewProps {
    epochs: EpochData[];
    isClaimable: boolean;
}

const EpochsOverview: React.FC<EpochsOverviewProps> = ({ epochs, isClaimable }) => {
    const [showPastEpochs, setShowPastEpochs] = useState(false);

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Epoch</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APR</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invested</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TVL</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {epochs.slice(0, showPastEpochs ? undefined : 2).map((epoch) => (
                            <EpochRow
                                key={epoch.id}
                                epoch={epoch}
                                isClaimable={isClaimable}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-center">
                <button
                    onClick={() => setShowPastEpochs(!showPastEpochs)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {showPastEpochs ? (
                        <>
                            Hide Past Epochs <ChevronUp className="ml-2 h-5 w-5" />
                        </>
                    ) : (
                        <>
                            Show Past Epochs <ChevronDown className="ml-2 h-5 w-5" />
                        </>
                    )}
                </button>
            </div>
        </>
    );
};

export default EpochsOverview;