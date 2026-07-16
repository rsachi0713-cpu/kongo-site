"use client";

import { deleteProduct } from './actions';

export default function DeleteButton({ id }: { id: string }) {
  return (
    <form action={deleteProduct} className="inline">
      <input type="hidden" name="id" value={id} />
      <button 
        type="submit" 
        className="text-gray-400 hover:text-red-600 transition-colors"
        title="Delete Product"
        onClick={(e) => {
          if (!confirm('Are you sure you want to delete this product?')) {
            e.preventDefault();
          }
        }}
      >
        <span className="material-symbols-outlined text-[20px]">delete</span>
      </button>
    </form>
  );
}
