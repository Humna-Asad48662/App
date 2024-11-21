import React, { useEffect, useState } from 'react';
import { OptionScore } from '@/lib/optionScore';

interface OptionScoreProps {
    score: number;
    headlineId: string;
    usefulOptions: OptionScore[];
    notUsefulOptions: OptionScore[];
    onOptionChange:  ( headlineId: string, score: number, feedback: string) => void;
}

export const OptionsScore: React.FC<OptionScoreProps> = ({ score, headlineId, usefulOptions, notUsefulOptions ,onOptionChange }) => {
    
    const isUseful = score >= 3;
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        // Reset selected option when score changes
        setSelectedOption('');
    }, [score]);
    

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSelectedOption(value);
        if (event.target.checked) {
            onOptionChange(headlineId, score, value);
        }
    };

    return (
        <div className="flex-col">
            <span className="text-sm font-semibold">{isUseful ? 'Useful' : 'Not useful'}</span>
            {(isUseful ? usefulOptions : notUsefulOptions).map((option, index) => (
                <div className="text-sm" key={index}>
                     <label>
                        <input 
                            type="checkbox" 
                            name={`option-${headlineId}`} 
                            value={option.value} 
                            checked={selectedOption === option.value}
                            onChange={handleChange} 
                        />
                        <span className="ml-1">{option.value}</span>
                    </label>
                </div>
            ))}
        </div>
    );
};
