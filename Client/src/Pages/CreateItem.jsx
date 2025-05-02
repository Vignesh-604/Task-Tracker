import React from 'react';

const CreateItemDialog = ({
    isOpen,
    onClose,
    title,
    itemData,
    setItemData,
    onSubmit,
    itemType
}) => {
    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItemData(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    // Reset and close dialog
    const handleCancel = () => {
        setItemData({ title: '', description: '' });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black text-black/85 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Create New {itemType}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor={`${itemType.toLowerCase()}Title`} className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            id={`${itemType.toLowerCase()}Title`}
                            name="title"
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={itemData.title}
                            onChange={handleChange}
                            placeholder={`${itemType} title`}
                        />
                    </div>
                    <div>
                        <label htmlFor={`${itemType.toLowerCase()}Description`} className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id={`${itemType.toLowerCase()}Description`}
                            name="description"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={itemData.description}
                            onChange={handleChange}
                            placeholder={`${itemType} description`}
                            rows="3"
                        />
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            disabled={!itemData.title}
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateItemDialog;