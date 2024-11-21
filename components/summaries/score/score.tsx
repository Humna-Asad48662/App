
import { useEffect, useRef, useState } from "react";
import { FaInfoCircle, FaStar } from "react-icons/fa";
import Tooltip from "../tooltip-summaries";

type ScoreOption = {
    id: number;
    title: string;
    options: string[];
} 
interface ScoreProps {
    ScoreOptions: ScoreOption[];
    scoreSummary: number;
    handleScoreSummaryChange: (score: number) => void;
    onOptionChange: (option: string) => void;
    onAdditionalFeedback: (additionalFeedback: string) => void;
}

export default function Score({ ScoreOptions, scoreSummary, handleScoreSummaryChange, onOptionChange, onAdditionalFeedback }: ScoreProps) {
    
    const [additionalFeedback, setAdditionalFeedback] = useState<string>('');
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    //useRef is used to store the previous value of selectedOptions without causing a re-render of the component.
    const prevSelectedOptionsRef = useRef<string[]>([]);
    const listScoreOptions = ScoreOptions;
    
    const [tooltipVisible, setTooltipVisible] = useState(false);

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const option = event.target.value;
        const isChecked = event.target.checked;

        setSelectedOptions(prevSelectedOptions => {
            let updatedOptions;

            if (isChecked) {
                updatedOptions = prevSelectedOptions.includes(option) ? prevSelectedOptions : [...prevSelectedOptions, option];
            } else {
                updatedOptions = prevSelectedOptions.filter(opt => opt !== option);
            }

            const concatenatedOptions = updatedOptions.join(' - ');

            // if updateOptions is different from prevSelectedOptions emmit onOptionChange
            if (JSON.stringify(updatedOptions) !== JSON.stringify(prevSelectedOptionsRef.current)) {
                onOptionChange(concatenatedOptions);
            }

            prevSelectedOptionsRef.current = updatedOptions;

            return updatedOptions;
        });

    };

    const handleAdditionalFeedbackChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAdditionalFeedback(event.target.value);
    }

    const sendAdditionalFeedback = () => {
        
        if(additionalFeedback === ''){
            return;
        }
        onAdditionalFeedback(additionalFeedback);
        setAdditionalFeedback('');
    }

    const selectedList=   listScoreOptions.find(list => list.id === scoreSummary);

    // If there are no options, use title as default option
    if (selectedList && selectedList.options.length === 0) {
        selectedList.options = [selectedList.title];
    }
    
    //Reset selected option when score changes
    useEffect(() => {
        setSelectedOptions([]);
        setAdditionalFeedback('');
    }, [scoreSummary]);
    
    useEffect(() => {
        // Automatically select the option when scoreSummary is 3, 4, or 5 because they don't have options- simulate event click
        if (scoreSummary === 3 || scoreSummary === 4 || scoreSummary === 5) {

            const clickCheckEvent = {
                target: {
                    value: selectedList!.options[0],
                    checked: true,
                }
            } as React.ChangeEvent<HTMLInputElement>;

            handleOptionChange(clickCheckEvent);
        }
    }, [scoreSummary]);

    
    return (
        <>  
        <div className="flex flex-row justify-between w-full m-1 h-full">
            <div className="flex flex-col w-1/2">
                    <span className="text-sm">How would you score this summary?</span>
                    <div className="flex flex-row">
                        <div className="flex flex-col">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                key={star}
                                onClick={() => handleScoreSummaryChange(star)}
                                className={`w-4 h-8 cursor-pointer ${star <= scoreSummary ? 'text-yellow-500' : 'text-gray-400'}`}/>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col justify-center px-2">
                        <Tooltip
                            message={listScoreOptions.map((list, index) => `${(index + 1)} - ${list.title}`).join('<br/>')}
                            visible={tooltipVisible}>
                            <FaInfoCircle
                                className="rounded-full transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gray-500 text-primary-foreground shadow hover:bg-purple-heart-500"
                                onMouseEnter={() => setTooltipVisible(true)}
                                onMouseLeave={() => setTooltipVisible(false)}
                            />
                        </Tooltip>
                    </div>
                    </div>
                    
                    <div className="flex-col mt-2">
                        <h2 className="text-sm font-semibold">{selectedList?.title}</h2>
                    <div>
                        {selectedList &&  selectedList.options.length > 1 &&(
                            <>
                                <div className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                    {selectedList.options.map((options, index) => (
                                    
                                        <div className="text-sm" key={index}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name={`option-${scoreSummary}`}
                                                    value={options}
                                                    //if there is only one option(is title option), disable the checkbox.
                                                    disabled={selectedList.options.length === 1? true : false}
                                                    checked={selectedOptions.includes(options)}
                                                    onChange={(ev) => handleOptionChange(ev)}
                                                />
                                                <span className="ml-1">{options}</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            
                            </>
                        )}
                    </div>
                
                    </div>
            </div>
           
            <div className="flex flex-col gap-2 w-1/2">
                <textarea
                        id="summary"
                        className="border rounded-sm p-2 h-full "
                        disabled={scoreSummary === 0}
                        placeholder="Additional feedback"
                        value={additionalFeedback}
                        onChange={(ev) => handleAdditionalFeedbackChange(ev)}>
                </textarea>
                <div className="flex justify-end">
                    <button
                        // onClick={() => console.log('Send feedback', scoreSummary, selectedOptions, additionalFeedback)} 
                        disabled={scoreSummary === 0 || additionalFeedback === ''}
                        onClick={() => sendAdditionalFeedback()}
                        className="flex justify-center text-center items-center rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-auto w-1/3 py-1">
                            Send
                    </button>
                </div>
                
            </div>
        </div>
       </>
    );

}