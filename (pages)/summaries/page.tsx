"use client"
import { Toaster } from "react-hot-toast";
import useSummaries from "./hooks/useSummaries";
import Score from "@/app/components/summaries/score/score";

export default function SummariesPage() {
    const {
        article,
        scoreSummary,
        textAreaRefSummary,
        username,
        listScoreOptions,
        generateIsEnable,
        copyDisabled,
        handleUsernameChange,
        handleGenerateSummary,
        handleSummaryRegenerate,
        handleCopy,
        handlePaste,
        handleScoreSummaryChange,
        handleSendAdditionalFeedback,
        handleOptionScore,
        summaryStream,
        isLoading
    } = useSummaries();

    return (
        <>
            <header className="flex flex-col w-full pt-4">
                <div className="flex items-start justify-between w-full">
                    <h1 className="[text-wrap:balance] text-4xl font-bold">
                        AP Summaries Assistant
                    </h1>
                </div>
                <p className="font-[300] text-muted-foreground text-xl [text-wrap:balance] mt-2">
                    Discover the power to summarize faster and better, with every story.
                </p>
            </header>

            <div className="flex flex-row gap-3 my-6">
                <div className="flex flex-col gap-1">
                    <label className="text-sm" htmlFor="username">Email address</label>
                    <div className="flex flex-row items-center">
                        <input
                            id="username"
                            value={username}
                            onChange={(event) => handleUsernameChange(event.target.value)}
                            className="border rounded-sm p-1 w-[250px]" />
                    </div>
                </div>
            </div>

            <div className="flex flex-row gap-5 w-full mt-4">
                <section className="w-full">
                    <div className="flex flex-col space-y-1.5">
                        <h2 className="text-xl font-semibold leading-none tracking-tight">Article</h2>
                        <p className="text-sm text-muted-foreground">Right click in Pronto (Copy story to clipboard) and press &quot;Paste from Pronto&quot; button.</p>
                        <div className="flex w-full">
                            <button
                                type="button"
                                autoFocus
                                disabled={isLoading}
                                onClick={handlePaste}
                                className="flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-9 px-6 py-5 flex-grow w-full md:w-auto">
                                Clear all & Paste from Pronto
                            </button>
                        </div>
                                
                    </div>
                    <div className="flex w-full h-full p-6 my-4 rounded-lg border card bg-card text-card-foreground shadow-sm">
                        <form onSubmit={handleGenerateSummary} className="flex flex-col w-full h-full gap-3">
                            <div className="flex flex-col gap-1">
                            <label className="text-sm" htmlFor="itemId">Item ID</label>
                                    <input readOnly
                                        id="itemId"
                                        value={article?.itemId}
                                        className="border rounded-sm p-1 w-full md:w-[250px]"/>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="headline">Headline</label>
                                <textarea readOnly
                                    id="headline"
                                    value={article?.headline}
                                    className="border rounded-sm p-2 min-h-[60px]" />
                            </div>

                            <div className="flex flex-col h-full gap-1">
                                <label className="text-sm" htmlFor="body">Body</label>
                                <textarea readOnly
                                    id="body"
                                    value={article?.body}
                                    className="border rounded-sm p-2 h-full min-h-[200px]"></textarea>
                            </div>

                            <div className="flex items-center gap-3">
                                    <button autoFocus
                                        disabled={isLoading || !generateIsEnable}
                                        className="flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-9 px-5 py-6 flex-grow">
                                        Generate summary
                                    </button>
                            </div>
                        </form>
                    </div>
                </section>

                <section className="w-full">
                    <div className="flex flex-col space-y-1.5">
                        <h2 className="text-xl font-semibold leading-none tracking-tight">Summary</h2>
                        <p className="text-sm text-muted-foreground">Here you can find and copy your AI generated summary.</p>

                        <span className="flex text-sm  transition-colors disabled:pointer-events-none disabled:opacity-50 bg-transparent shadow-none hover:bg-transparent h-9 px-6 py-5 flex-grow w-full md:w-auto"></span>
                    </div>

                    <div className="flex flex-col w-full h-full p-6 my-4 gap-3 rounded-lg border card bg-card text-card-foreground shadow-sm">
                        <div className="flex flex-col h-full gap-1">
                            <label className="text-sm" htmlFor="summary">Summary</label>
                            <textarea readOnly
                                id="summary"
                                ref={textAreaRefSummary}
                                value={summaryStream}
                                className="border rounded-sm p-2 h-full min-h-[200px]"></textarea>
                        </div>
                        <div className="flex">
                                {summaryStream && !copyDisabled() && (
                                    <Score 
                                    ScoreOptions={listScoreOptions}
                                    scoreSummary={scoreSummary} 
                                    handleScoreSummaryChange={handleScoreSummaryChange}
                                    onOptionChange={handleOptionScore}
                                    onAdditionalFeedback={handleSendAdditionalFeedback} />
                                )}
                        </div>
                        <hr className="border-t border-gray-300 my-2" />
                        <div className="flex flex-row">
                            <div className="flex flex-col w-full ml-auto">
                                     <div className="flex flex-col xl:flex-row xl:space-x-4 gap-1">
                                        <div className="flex flex-col 2xl:w-1/2 sm:w-full">
                                            <button
                                                type="button"
                                                autoFocus
                                                disabled={copyDisabled() || isLoading}
                                                onClick={(event) =>handleSummaryRegenerate(event)}
                                                className="flex justify-center items-center text-center whitespace-nowrap rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-6 px-5 py-5">
                                                Regenerate Summary
                                            </button>
                                        </div>
                                        <div className="flex flex-col 2xl:w-1/2 sm:w-full">
                                                <button
                                                    type="button"
                                                    autoFocus
                                                    disabled={copyDisabled()}
                                                    onClick={(event) => handleCopy(event)}
                                                    className="flex justify-center items-center text-center whitespace-nowrap rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-6 px-10 py-5">
                                                    Copy Summary
                                                </button>
                                        </div>
                                    </div>
                            </div>
                        </div>
                        <Toaster position="top-right" toastOptions={{ duration: 800, style: { marginTop: 25 } }} />
                    </div>
                </section>
            </div>
        </>
    );

}

