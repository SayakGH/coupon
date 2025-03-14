import React from 'react';

interface StatusMessageProps {
  type: 'success' | 'error' | 'info';
  message: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ type, message }) => {
  const bgColor = type === 'success' ? 'bg-green-50' : 
                 type === 'error' ? 'bg-red-50' : 'bg-blue-50';
  
  const textColor = type === 'success' ? 'text-green-800' : 
                   type === 'error' ? 'text-red-800' : 'text-blue-800';
  
  const borderColor = type === 'success' ? 'border-green-400' : 
                     type === 'error' ? 'border-red-400' : 'border-blue-400';

  return (
    <div className={`${bgColor} ${textColor} p-4 mb-4 rounded-md border ${borderColor}`}>
      {message}
    </div>
  );
};

export default StatusMessage;