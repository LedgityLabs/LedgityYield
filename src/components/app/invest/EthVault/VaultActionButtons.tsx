import React from 'react';
import CustomTooltip from './Tooltip';

interface ActionButtonProps {
    label: string;
    primary?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    disabledReason?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, primary = false, disabled = false, onClick, disabledReason }) => {
    const buttonContent = (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${disabled
                    ? "bg-red-100 text-red-400 cursor-not-allowed hover:bg-red-200"
                    : primary
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                }
            `}
        >
            {label}
        </button>
    );

    if (disabled && disabledReason) {
        return (
            <CustomTooltip content={disabledReason}>
                {buttonContent}
            </CustomTooltip>
        );
    }

    return buttonContent;
};

interface VaultActionButtonsProps {
    isEpochOpen: boolean;
    onDeposit: () => void;
    onWithdraw: () => void;
    onClaimRewards: () => void;
    isWithdrawDisabled: boolean;
    isClaimRewardsDisabled: boolean;
    userInvestment: string;
}

const VaultActionButtons: React.FC<VaultActionButtonsProps> = ({
    isEpochOpen,
    onDeposit,
    onWithdraw,
    onClaimRewards,
    isWithdrawDisabled,
    isClaimRewardsDisabled,
    userInvestment,
}) => {
    const depositDisabledReason = !isEpochOpen ? 'Deposits are not allowed during a running epoch' : '';
    const withdrawDisabledReason = !isEpochOpen
        ? 'Withdrawals are not allowed during a running epoch'
        : isWithdrawDisabled
            ? 'You have no investment to withdraw'
            : '';
    const claimRewardsDisabledReason = isClaimRewardsDisabled ? 'No rewards available to claim at the moment' : '';

    return (
        <div className="flex justify-center space-x-4 mb-6">
            <ActionButton
                label="Deposit"
                primary={true}
                disabled={!isEpochOpen}
                onClick={onDeposit}
                disabledReason={depositDisabledReason} />
            <ActionButton
                label="Withdraw"
                primary={true}
                disabled={!isEpochOpen || isWithdrawDisabled}
                onClick={onWithdraw}
                disabledReason={withdrawDisabledReason}
            />
            <ActionButton
                label="Claim"
                primary={false}
                disabled={isClaimRewardsDisabled}
                onClick={onClaimRewards}
                disabledReason={claimRewardsDisabledReason}
            />
        </div>
    );
};

export default VaultActionButtons;