import React from 'react';

const DeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-md max-w-sm w-full shadow-xl">
                <h2 className="text-zinc-100 text-lg font-semibold mb-2">Delete {itemName}?</h2>
                <p className="text-zinc-400 text-sm mb-6">This action cannot be undone. All associated data will be lost.</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-md">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
