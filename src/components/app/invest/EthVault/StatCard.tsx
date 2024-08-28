import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => (
    <div className="bg-gray-100 p-4 rounded-lg text-center">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
);

export default StatCard;