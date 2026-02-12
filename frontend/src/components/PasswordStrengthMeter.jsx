import { useEffect, useState } from 'react';
import zxcvbn from 'zxcvbn';

const PasswordStrengthMeter = ({ password }) => {
    const [strength, setStrength] = useState(null);

    useEffect(() => {
        if (password) {
            const result = zxcvbn(password);
            setStrength(result);
        } else {
            setStrength(null);
        }
    }, [password]);

    if (!password || !strength) return null;

    const getStrengthLabel = (score) => {
        const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
        return labels[score];
    };

    const getStrengthColor = (score) => {
        const colors = [
            'bg-red-500',
            'bg-orange-500',
            'bg-yellow-500',
            'bg-blue-500',
            'bg-green-500'
        ];
        return colors[score];
    };

    const getTextColor = (score) => {
        const colors = [
            'text-red-600',
            'text-orange-600',
            'text-yellow-600',
            'text-blue-600',
            'text-green-600'
        ];
        return colors[score];
    };

    return (
        <div className="mt-2">
            <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-300 ${getStrengthColor(strength.score)}`}
                        style={{ width: `${((strength.score + 1) / 5) * 100}%` }}
                    />
                </div>
                <span className={`text-sm font-medium ${getTextColor(strength.score)}`}>
                    {getStrengthLabel(strength.score)}
                </span>
            </div>

            {/* Password requirements checklist */}
            <div className="mt-2 space-y-1">
                <RequirementItem
                    met={password.length >= 8}
                    text="At least 8 characters"
                />
                <RequirementItem
                    met={/[A-Z]/.test(password)}
                    text="One uppercase letter"
                />
                <RequirementItem
                    met={/[a-z]/.test(password)}
                    text="One lowercase letter"
                />
                <RequirementItem
                    met={/[0-9]/.test(password)}
                    text="One number"
                />
                <RequirementItem
                    met={/[!@#$%^&*(),.?":{}|<>]/.test(password)}
                    text="One special character"
                />
            </div>

            {/* Suggestions */}
            {strength.feedback.suggestions.length > 0 && (
                <div className="mt-2 text-xs text-gray-600">
                    <p className="font-medium">Suggestions:</p>
                    <ul className="list-disc list-inside">
                        {strength.feedback.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const RequirementItem = ({ met, text }) => {
    return (
        <div className="flex items-center gap-2 text-xs">
            {met ? (
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            ) : (
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            )}
            <span className={met ? 'text-green-600' : 'text-gray-500'}>{text}</span>
        </div>
    );
};

export default PasswordStrengthMeter;
