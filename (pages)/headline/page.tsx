"use client"
import useHeadlines from "./hooks/useHeadline";
import { FaStar } from 'react-icons/fa';
import { Toaster } from "react-hot-toast";
import {OptionsScore } from "@/app/components/headlines/score/option-score";


export default function HeadlinePage() {

    const {
        username,
        itemId,
        body,
        headlineDirect,
        headlineDescriptive,
        headlineCuriosity,
        scoreHeadlineDirect,
        scoreHeadlineDescriptive,
        scoreHeadlineCuriosity,
        usefulOptions,
        notUsefulOptions,
        handleUsernameChange,
        handleItemIdChange,
        handleBodyChange,
        handleHeadlinesGenerate,
        handleHeadlineRegenerate,
        handleCopy,
        handlePaste,
        handleScoreDirectChange,
        handleScoreDescriptiveChange,
        handleScoreCuriosityChange,
        handleOptionScoreChange,
        copyDisabled,
        isLoading
    } = useHeadlines();

    return (
        <>
            <header className="flex flex-col w-full pt-4">
                <h1 className="[text-wrap:balance] text-4xl font-bold">
                    AP Headlines Assistant
                </h1>
                <p className="font-[300] text-muted-foreground text-xl [text-wrap:balance] mt-2">
                    Discover the power to craft headlines faster and better, with every story.
                </p>
            </header>

            <div className="flex flex-row gap-3 my-6">
                <div className="flex flex-col gap-1">
                    <label className="text-sm" htmlFor="username">Email address</label>
                    <input
                        id="username"
                        value={username}
                        onChange={(event) => handleUsernameChange(event.target.value)}
                        className="border rounded-sm p-1 w-[250px]" />
                </div>
            </div>

            <div className="flex flex-row gap-5 w-full mt-4">
                <section className="w-full">
                    <div className="flex flex-col space-y-1.5">
                        <h2 className="text-xl font-semibold leading-none tracking-tight">Article</h2>
                        <p className="text-sm text-muted-foreground">Right click in Pronto (Copy story to clipboard) and press &quot;Paste from Pronto&quot; button.</p>
                    </div>
                    <div className="flex w-full mt-2">
                            <button
                                type="button"
                                autoFocus
                                disabled={isLoading}
                                onClick={handlePaste}
                                className="flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-9 px-6 py-5 flex-grow w-full md:w-auto">
                                Clear all & Paste from Pronto
                            </button>
                    </div>
                    <div className="flex w-full h-full p-6 my-4 rounded-lg border card bg-card text-card-foreground shadow-sm">
                        <form className="flex flex-col w-full h-full gap-3">
                            <div className="flex flex-col gap-1">
                                    <label className="text-sm" htmlFor="itemId">Item ID</label>
                                    <input readOnly
                                        id="itemId"
                                        value={itemId}
                                        onChange={(event) => handleItemIdChange(event.target.value)}
                                        className="border rounded-sm p-1 w-full md:w-[250px]"/>
                            </div>
                            <div className="flex flex-col h-full gap-1">
                                    <label className="text-sm" htmlFor="body">Body</label>
                                    <textarea  readOnly
                                        id="body"
                                        value={body}
                                        onChange={event => handleBodyChange(event.target.value)}
                                        className="border rounded-sm p-2 h-full min-h-[200px]"></textarea>
                            </div>

                            <div className="flex items-center gap-3">
                                    <button autoFocus
                                        disabled={isLoading}
                                        onClick={handleHeadlinesGenerate}
                                        className="flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-9 px-5 py-6 flex-grow">
                                        Generate Headlines
                                    </button>
                            </div>
                        </form>
                    </div>
                </section>
                <section className="w-full">
                    <div className="flex flex-col space-y-1.5">
                        <h2 className="text-xl font-semibold leading-none tracking-tight">Headlines</h2>
                        <p className="text-sm text-muted-foreground">Your options for headlines.</p>
                    </div>
                    <div className="flex w-full mt-2">
                        <span className="flex text-sm  transition-colors disabled:pointer-events-none disabled:opacity-50 bg-transparent shadow-none hover:bg-transparent h-9 px-6 py-5 flex-grow w-full md:w-auto"></span>
                    </div>
                    <div className="flex w-full h-full p-6 my-4 rounded-lg border card bg-card text-card-foreground shadow-sm">
                        <div className="flex flex-col w-full h-full mt-2 gap-2">

                                {/* Section for Headline Direct and engaging */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold" htmlFor="headlineDirect">Direct and engaging</label>
                                    <textarea readOnly
                                        id="headlineDirect"
                                        rows={3}
                                        value={headlineDirect}
                                        //onChange={event => handleHeadlineDirectChange(event.target.value)}
                                        className="border rounded-sm p-2 min-h-[60px]" />
                                        <div className="flex flex-row justify-between gap-1">
                                                <div className="flex flex-col 2xl:flex-row 2xl:gap-4 gap-1">
                                                {headlineDirect && (
                                                            <>
                                                            <div>
                                                                <span className="text-sm">How would you score this headline?</span>
                                                                <div className="flex gap-1">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <FaStar
                                                                            key={star}
                                                                            onClick={() => handleScoreDirectChange(star)}
                                                                            className={`w-4 h-8 cursor-pointer ${star <= scoreHeadlineDirect ? 'text-yellow-500' : 'text-gray-400'}`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            {scoreHeadlineDirect > 0 &&(
                                                                <div>
                                                                    <OptionsScore 
                                                                        score={scoreHeadlineDirect}
                                                                        headlineId='direct'
                                                                        usefulOptions={usefulOptions}
                                                                        notUsefulOptions={notUsefulOptions}
                                                                        onOptionChange={handleOptionScoreChange} 
                                                                    />
                                                                </div>
                                                            )}
                                                            </>
                                                        )}
                                                </div>
                                                <div className="flex flex-row justify-end gap-4">
                                                    <div className="flex-col">
                                                        <button
                                                            type="button"
                                                            autoFocus
                                                            disabled={copyDisabled() || isLoading}
                                                            onClick={(event) =>handleHeadlineRegenerate(event, 'direct')}
                                                            className="flex items-center whitespace-nowrap rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-6 px-5 py-5">
                                                            Regenerate
                                                        </button>
                                                    </div>
                                                    <div className="flex-col">
                                                        <button
                                                            type="button"
                                                            autoFocus
                                                            disabled={copyDisabled()}
                                                            onClick={(event) => handleCopy(event, headlineDirect)}
                                                            className="flex items-center whitespace-nowrap rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-6 px-5 py-5">
                                                            Copy
                                                        </button>
                                                    </div>
                                                </div>
                                        </div>
                                </div>
                                {/* Section for Headline Descriptive and engaging */}
                                <div className="flex flex-col gap-2 mt-2">
                                    <label className="text-sm font-semibold" htmlFor="headlineDescriptive">Descriptive and engaging</label>
                                    <textarea readOnly
                                        id="headlineDescriptive"
                                        rows={3}
                                        value={headlineDescriptive}
                                       // onChange={event => handleHeadlineDescriptiveChange(event.target.value)}
                                        className="border rounded-sm p-2 min-h-[60px]" />
                                        <div className="flex flex-row justify-between mt-2">
                                                <div className="flex flex-col 2xl:flex-row 2xl:gap-4 gap-1">
                                                    {headlineDescriptive && (
                                                        <>
                                                            <div>
                                                                <span className="text-sm">How would you score this headline?</span>
                                                                <div className="flex gap-1">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                    <FaStar
                                                                    key={star}
                                                                    onClick={() => handleScoreDescriptiveChange(star)}
                                                                    className={`w-4 h-8 cursor-pointer ${star <= scoreHeadlineDescriptive ? 'text-yellow-500' : 'text-gray-400'}`}/>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        {scoreHeadlineDescriptive > 0 &&(
                                                            <div>
                                                                <OptionsScore 
                                                                    score={scoreHeadlineDescriptive}
                                                                    headlineId='descriptive'
                                                                    usefulOptions={usefulOptions}
                                                                    notUsefulOptions={notUsefulOptions}
                                                                    onOptionChange={handleOptionScoreChange} 
                                                                />
                                                            </div>
                                                        )}
                                                        </>
                                                    )}
                                                </div>
                                                <div className="flex flex-row justify-end gap-2">
                                                    <div className="flex-col">
                                                        <button
                                                            type="button"
                                                            autoFocus
                                                            disabled={copyDisabled() || isLoading}
                                                            onClick={(event) =>handleHeadlineRegenerate(event, 'descriptive')}
                                                            className="flex items-center whitespace-nowrap rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-6 px-5 py-5">
                                                            Regenerate
                                                        </button>
                                                    </div>
                                                    <div className="flex-col">
                                                        <button
                                                            type="button"
                                                            autoFocus
                                                            disabled={copyDisabled()}
                                                            onClick={(event) => handleCopy(event, headlineDescriptive)}
                                                            className="flex items-center whitespace-nowrap rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-6 px-5 py-5">
                                                            Copy 
                                                        </button>
                                                    </div>
                                                </div>
                                        </div>
                                </div>
                                {/* Section for Headline Curiosity gap */}
                                <div className="flex flex-col gap-2 mt-2">
                                    <label className="text-sm font-semibold" htmlFor="headlineCuriosity">Curiosity gap</label>
                                    <textarea readOnly
                                        id="headlineCuriosity"
                                        rows={3}
                                        value={headlineCuriosity}
                                       // onChange={event => handleHeadlineCuriosityChange(event.target.value)}
                                        className="border rounded-sm p-2 min-h-[60px]" />
                                        <div className="flex flex-row justify-between">
                                                <div className="flex flex-col 2xl:flex-row 2xl:gap-4 gap-1">
                                                    {headlineCuriosity && (
                                                        <>
                                                            <div>
                                                                <span className="text-sm">How would you score this headline?</span>
                                                                <div className="flex gap-1">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                    <FaStar
                                                                    key={star}
                                                                    onClick={() => handleScoreCuriosityChange(star)}
                                                                    className={`w-4 h-8 cursor-pointer ${star <= scoreHeadlineCuriosity ? 'text-yellow-500' : 'text-gray-400'}`}/>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        {scoreHeadlineCuriosity > 0 &&(
                                                            <div>
                                                                <OptionsScore 
                                                                    score={scoreHeadlineCuriosity}
                                                                    headlineId='curiosity'
                                                                    usefulOptions={usefulOptions}
                                                                    notUsefulOptions={notUsefulOptions}
                                                                    onOptionChange={handleOptionScoreChange} 
                                                                />
                                                            </div>
                                                        )}
                                                        </>
                                                    )}
                                                </div>
                                                <div className="flex flex-row justify-end gap-2">
                                                    <div className="flex-col">
                                                        <button
                                                            type="button"
                                                            autoFocus
                                                            disabled={copyDisabled() || isLoading}
                                                            onClick={(event) =>handleHeadlineRegenerate(event, 'curiosity')}
                                                            className="flex items-center whitespace-nowrap rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-6 px-5 py-5">
                                                            Regenerate
                                                        </button>
                                                    </div>
                                                    <div className="flex-col">
                                                        <button
                                                        type="button"
                                                        autoFocus
                                                        disabled={copyDisabled()}
                                                        onClick={(event) => handleCopy(event, headlineCuriosity)}
                                                        className="flex items-center whitespace-nowrap rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-6 px-5 py-5">
                                                        Copy
                                                        </button>
                                                    </div>
                                                </div>
                                        </div>
                                </div>
                        </div>
                    </div>
                </section>
                <Toaster position="top-right" toastOptions={{ duration: 1000, style: { marginTop: 25 } }} />
            </div>
        </>
    );
}