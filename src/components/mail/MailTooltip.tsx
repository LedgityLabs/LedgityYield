'use client'

import React, { useState } from 'react';
import { useAccount } from 'wagmi';

const MailTooltip = () => {
    const [isVisible, setIsVisible] = useState(true);
    const { address, isConnected } = useAccount();

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 bg-blue-500 text-white px-3 py-2 rounded-md shadow-md flex items-center">
            <span><a href="/mail">Web3mail with: {address ? `${address.slice(0, 6)}...` : 'Unknown'}</a></span>
            <button
                onClick={() => setIsVisible(false)}
                className="ml-2 text-white hover:text-gray-200 focus:outline-none"
                aria-label="Close"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
};

export default MailTooltip;

// 'use client'

// import React, { useState, useEffect } from 'react';
// import { useAccount } from 'wagmi';

// const MailTooltip: React.FC = () => {
//     const [isVisible, setIsVisible] = useState(true);
//     const { address, isConnected } = useAccount();

//     useEffect(() => {
//         const tooltipHidden = localStorage.getItem('tooltipHidden');
//         if (tooltipHidden) {
//             setIsVisible(false);
//         }
//     }, []);

//     const hideTooltip = () => {
//         setIsVisible(false);
//         localStorage.setItem('tooltipHidden', 'true');
//     };

//     if (!isVisible || !isConnected) return null;

//     return (
//         <div className="fixed bottom-4 left-4 bg-blue-500 text-white px-3 py-2 rounded-md shadow-md flex items-center">
//             <span>Connected: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Unknown'}</span>
//             <button
//                 onClick={hideTooltip}
//                 className="ml-2 text-white hover:text-gray-200 focus:outline-none"
//                 aria-label="Close"
//             >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//             </button>
//         </div>
//     );
// };

// export default MailTooltip;