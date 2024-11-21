import { SmartInput } from "@/lib/smartInput";
import React from "react";
import TooltipCollapse from "../tooltip-collapse";
import { BsArrowsAngleContract } from "react-icons/bs";

interface Props {
    title: string,
    subtitle: string,
    itemId: string,
    textButton: string,
    smartInput: SmartInput,
    collapsedInitialValue: boolean,
    onClick: () => void
    onHandlePaste: (event: any) => Promise<void>,
}

export const TranslationSmartInput: React.FC<Props> = (props: Props) => {

    return (
        <>
            <section className={`w-full transition-all duration-300 ${props.collapsedInitialValue ? 'hidden' : ''} pt-6`}>
                <div className="flex flex-col space-y-1.5 gap-1"> 
                    <TooltipCollapse message="Click to collapse" visible={!props.collapsedInitialValue}>
                        <div className="flex flex-row cursor-pointer gap-4" 
                             onClick={props.onClick}>
                            <h2 className="text-xl font-semibold leading-none tracking-tight">
                                {props.title}
                            </h2>
                            <div className="flex items-center">
                                <BsArrowsAngleContract/>
                            </div>
                        </div>
                    </TooltipCollapse>
                    <p className="text-sm text-muted-foreground">{props.subtitle}</p>
                </div>
                <div className="flex w-full mt-2">
                            <button
                                type="button"
                                autoFocus
                                onClick={props.onHandlePaste}
                                className="flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-9 px-6 py-5 flex-grow w-full md:w-auto">
                                {props.textButton}
                            </button>
                </div>
                <div className="flex w-full h-full p-6 my-4 rounded-lg border card bg-card text-card-foreground shadow-sm">
                    <div className="flex flex-col w-full h-full gap-3">
                        <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="itemId">{props.itemId}</label>
                                <input readOnly
                                    id="itemId"
                                    value={props.smartInput.itemId}
                                    className="border rounded-sm p-1 w-full md:w-[250px]"/>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm" htmlFor="headline">Headline</label>
                            <textarea readOnly
                                rows={2}
                                id="headline"
                                value={props.smartInput.headline}
                                className="border rounded-sm p-2 min-h-[60px]" />
                        </div>

                        <div className="flex flex-col h-full gap-1">
                            <label className="text-sm" htmlFor="body">Body</label>
                            <textarea readOnly
                                rows={15}
                                id="body"
                                value={props.smartInput.body}
                                className="border rounded-sm p-2 h-full min-h-[200px]"></textarea>
                        </div>
                    </div>
                </div>
            </section>
            {props.collapsedInitialValue && (
                    <button
                        title="expand" 
                        className="border text-sm rounded-md p-1 h-full min-h-[100px] bg-purple-heart-800 text-primary-foreground focus-visible:ring-ring hover:bg-purple-heart-500" style={{ width: '90px' }}>
                    <h2 onClick={props.onClick}>{props.title}</h2>
                    </button>
        )}
        </>
    );
}

export default TranslationSmartInput