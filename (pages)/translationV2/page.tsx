"use client"
import { Toaster } from "react-hot-toast";
import useTranslate from "./hooks/useTranslate";
import Tooltip from "@/app/components/tooltip";
import streamResponseText from "@/app/helpers/streamResponseText";
import Link from "next/link";

export default function TranslationPage() {
    const {
        username,
        prontoId,
        textAreaRefHeadline,
        textAreaRefBody,
        englishVersion,
        handleUsernameChange,
        handleProntoIdChange,
        handleHeadlineChange,
        handleBodyChange,
        handleTranslate,
        handleCopy,
        handlePaste,
        copyDisabled,
        headlineStream,
        bodyStream,
        isLoading
    } = useTranslate();

    return (
        <>
            <header className="flex flex-col w-full pt-4">
                <div className="flex items-start justify-between w-full">
                    <h1 className="[text-wrap:balance] text-4xl font-bold">
                        AP Initial Translation Assistant
                    </h1>
                    <Link
                        href="/translationV3"
                        className="ml-auto flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-9 px-6 py-2">
                        Go to Write Through Translation
                    </Link>
                </div>
                <p className="font-[300] text-muted-foreground text-xl [text-wrap:balance] mt-2">
                    Discover the power to translate faster and better, with every story.
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

                        {/* <label className="text-sm ml-2" htmlFor="usernameRememberMe">
                            <input type="checkbox" id="usernameRememberMe" /> Remember me
                        </label> */}
                    </div>
                </div>
            </div>

            <div className="flex flex-row gap-5 w-full mt-4">
                <section className="w-full">
                    <div className="flex flex-col space-y-1.5">
                        <h2 className="text-xl font-semibold leading-none tracking-tight">English</h2>
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
                        <form onSubmit={handleTranslate} className="flex flex-col w-full h-full gap-3">
                            <div className="flex flex-col gap-1">
                            <label className="text-sm" htmlFor="itemId">English item ID</label>
                                    <input readOnly
                                        id="itemId"
                                        value={englishVersion?.itemId}
                                        className="border rounded-sm p-1 w-full md:w-[250px]"/>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="headline">Headline</label>
                                <textarea readOnly
                                    id="headline"
                                    value={englishVersion?.headline}
                                    onChange={event => handleHeadlineChange(event.target.value)}
                                    className="border rounded-sm p-2 min-h-[60px]" />
                            </div>

                            <div className="flex flex-col h-full gap-1">
                                <label className="text-sm" htmlFor="body">Body</label>
                                <textarea readOnly
                                    id="body"
                                    value={englishVersion?.body}
                                    onChange={event => handleBodyChange(event.target.value)}
                                    className="border rounded-sm p-2 h-full min-h-[200px]"></textarea>
                            </div>

                            <div className="flex items-center gap-3">
                                    <button autoFocus
                                        disabled={isLoading}
                                        className="flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-9 px-5 py-6 flex-grow">
                                        Translate
                                    </button>
                            </div>
                        </form>
                    </div>
                </section>

                <section className="w-full">
                    <div className="flex flex-col space-y-1.5">
                        <h2 className="text-xl font-semibold leading-none tracking-tight">Spanish</h2>
                        <p className="text-sm text-muted-foreground">Your translated article.</p>

                        <span className="flex text-sm  transition-colors disabled:pointer-events-none disabled:opacity-50 bg-transparent shadow-none hover:bg-transparent h-9 px-6 py-5 flex-grow w-full md:w-auto"></span>
                    </div>

                    <div className="flex flex-col w-full h-full p-6 my-4 gap-3 rounded-lg border card bg-card text-card-foreground shadow-sm">
                        <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="prontoId">Spanish item ID</label>
                                <input
                                id="prontoId"
                                value={prontoId}
                                onChange={(event) => handleProntoIdChange(event.target.value)}
                                className="border rounded-sm p-1 w-[250px]"/>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm" htmlFor="translatedHeadline">Headline</label>
                            <textarea readOnly
                                id="translatedHeadline"
                                ref={textAreaRefHeadline}
                                value={headlineStream}
                                className="border rounded-sm p-2 min-h-[60px]" />
                        </div>

                        <div className="flex flex-col h-full gap-1">
                            <label className="text-sm" htmlFor="translatedBody">Body</label>
                            <textarea readOnly
                                id="translatedBody"
                                ref={textAreaRefBody}
                                value={bodyStream}
                                className="border rounded-sm p-2 h-full min-h-[200px]"></textarea>
                        </div>

                        <div className="flex w-full">
                            <Tooltip message="The 'Spanish item ID' field must not be empty." visible={!prontoId}>
                                <button
                                    type="button"
                                    autoFocus
                                    disabled={copyDisabled()}
                                    onClick={handleCopy}
                                    className="flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-9 px-6 py-6 flex-grow w-full md:w-auto">
                                    Copy
                                </button>
                            <Toaster position="top-right" toastOptions={{ duration: 800, style: { marginTop: 25 } }} />
                            </Tooltip>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );

}