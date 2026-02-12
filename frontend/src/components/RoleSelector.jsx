import { useState } from 'react';

const RoleSelector = ({ selectedRole, onRoleChange }) => {
    const roles = [
        {
            value: 'buyer',
            label: 'Buyer',
            description: 'Browse and purchase products',
            icon: '🛒',
            permissions: ['Browse products', 'Place orders', 'Track deliveries']
        },
        {
            value: 'seller',
            label: 'Seller',
            description: 'Sell your products on FreshKart',
            icon: '🏪',
            permissions: ['Manage products', 'View orders', 'Track sales analytics']
        }
    ];

    return (
        <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-3">
                I want to register as:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map((role) => (
                    <div
                        key={role.value}
                        onClick={() => onRoleChange(role.value)}
                        className={`
                            relative cursor-pointer rounded-lg border-2 p-4 transition-all
                            ${selectedRole === role.value
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-green-300 bg-white'
                            }
                        `}
                    >
                        {/* Radio button */}
                        <div className="absolute top-4 right-4">
                            <div className={`
                                w-5 h-5 rounded-full border-2 flex items-center justify-center
                                ${selectedRole === role.value
                                    ? 'border-green-500 bg-green-500'
                                    : 'border-gray-300'
                                }
                            `}>
                                {selectedRole === role.value && (
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                )}
                            </div>
                        </div>

                        {/* Role content */}
                        <div className="flex items-start gap-3">
                            <div className="text-3xl">{role.icon}</div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800 mb-1">{role.label}</h3>
                                <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                                <ul className="space-y-1">
                                    {role.permissions.map((permission, index) => (
                                        <li key={index} className="flex items-center gap-2 text-xs text-gray-500">
                                            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            {permission}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoleSelector;
