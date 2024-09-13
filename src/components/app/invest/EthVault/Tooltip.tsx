import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isVisible && triggerRef.current && tooltipRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();

            setPosition({
                top: triggerRect.top - tooltipRect.height - 10,
                left: triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2)
            });
        }
    }, [isVisible]);

    return (
        <>
            <div
                ref={triggerRef}
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
            >
                {children}
            </div>
            {isVisible && createPortal(
                <div
                    ref={tooltipRef}
                    className="fixed z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700"
                    style={{
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                        whiteSpace: 'nowrap'
                    }}
                >
                    {content}
                </div>,
                document.body
            )}
        </>
    );
};

export default Tooltip;