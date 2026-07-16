"use client";

import { useTransition } from 'react';
import { updateOrderStatus } from './actions';

export default function StatusDropdown({ 
  orderId, 
  currentStatus 
}: { 
  orderId: string; 
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, newStatus);
      } catch (err: any) {
        alert(`Failed to update status: ${err.message}`);
      }
    });
  };

  return (
    <div className="relative inline-block text-left">
      <select 
        value={currentStatus}
        onChange={handleStatusChange}
        disabled={isPending}
        className={`font-inter text-xs font-semibold rounded px-2.5 py-1 bg-white text-black border focus:outline-none focus:ring-1 focus:ring-black cursor-pointer transition-colors ${
          currentStatus === 'Completed' || currentStatus === 'Delivered' 
            ? 'border-green-300 text-green-800 focus:border-green-500' 
            : currentStatus === 'Processing' 
            ? 'border-blue-300 text-blue-800 focus:border-blue-500' 
            : currentStatus === 'Shipped' 
            ? 'border-purple-300 text-purple-800 focus:border-purple-500' 
            : currentStatus === 'Cancelled' 
            ? 'border-red-300 text-red-800 focus:border-red-500' 
            : 'border-yellow-300 text-yellow-800 focus:border-yellow-500'
        } disabled:opacity-50`}
      >
        <option value="Pending">Pending</option>
        <option value="Processing">Processing</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      {isPending && (
        <span className="absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
      )}
    </div>
  );
}
