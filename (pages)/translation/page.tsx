"use client"
import { Toaster } from "react-hot-toast";
import useTranslate from "./hooks/useTranslate";
import Tooltip from "@/app/components/tooltip";

export default function TranlationPage() {

    const {
        username,
        prontoId,
        headline,
        body,
        textAreaRefHeadline,
        textAreaRefBody,
        handleUsernameChange,
        handleProntoIdChange,
        handleHeadlineChange,
        handleBodyChange,
        handleTranslate,
        handleCopy,
        copyDisabled,
        headlineStream,
        bodyStream,
        isLoading
    } = useTranslate();

    return (
        <>

            <header className="flex flex-col w-full pt-4">
                <h1 className="[text-wrap:balance] text-4xl font-bold">
                    AP Translation Assistant
                </h1>
                <p className="font-[300] text-muted-foreground text-xl [text-wrap:balance] mt-2">
                    Discover the power to translate faster and better, with every story.
                </p>
            </header>

            <div className="flex flex-row gap-3 my-6">
                <div className="flex flex-col gap-1">
                    <label className="text-sm" htmlFor="username">Username</label>
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

                <div className="flex flex-col gap-1">
                    <label className="text-sm" htmlFor="prontoId">Pronto ID</label>
                    <input
                        id="prontoId"
                        value={prontoId}
                        onChange={(event) => handleProntoIdChange(event.target.value)}
                        className="border rounded-sm p-1 w-[250px]" />
                </div>
            </div>

            <div className="flex flex-row gap-5 w-full mt-4">
                <section className="w-full">
                    <div className="flex flex-col space-y-1.5">
                        <h2 className="text-xl font-semibold leading-none tracking-tight">English</h2>
                        <p className="text-sm text-muted-foreground">Let`s copy & paste that article.</p>
                    </div>
                    <div className="flex w-full p-6 my-4 rounded-lg border card bg-card text-card-foreground shadow-sm">
                        <form onSubmit={handleTranslate} className="flex flex-col w-full h-full gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="headline">Headline</label>
                                <textarea
                                    id="headline"
                                    rows={2}
                                    value={headline}
                                    onChange={event => handleHeadlineChange(event.target.value)}
                                    className="border rounded-sm p-2" />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="body">Body</label>
                                <textarea
                                    id="body"
                                    rows={15}
                                    value={body}
                                    onChange={event => handleBodyChange(event.target.value)}
                                    className="border rounded-sm p-2"></textarea>
                            </div>

                            <button autoFocus
                                disabled={isLoading}
                                className="flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-9 px-5 py-6">
                                Translate
                            </button>
                        </form>
                    </div>
                </section>

                <section className="w-full">
                    <div className="flex flex-col space-y-1.5">
                        <h2 className="text-xl font-semibold leading-none tracking-tight">Spanish</h2>
                        <p className="text-sm text-muted-foreground">Your translated article.</p>
                    </div>

                    <div className="flex flex-col w-full p-6 my-4 gap-3 rounded-lg border card bg-card text-card-foreground shadow-sm">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm" htmlFor="translatedHeadline">Headline</label>
                            <textarea readOnly
                                id="translatedHeadline"
                                rows={2}
                                ref={textAreaRefHeadline}
                                value={headlineStream}
                                className="border rounded-sm p-2" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm" htmlFor="translatedBody">Body</label>
                            <textarea readOnly
                                id="translatedBody"
                                rows={15}
                                ref={textAreaRefBody}
                                value={bodyStream}
                                className="border rounded-sm p-2"></textarea>
                        </div>

                        <div className="flex gap-4 justify-end w-full">
                            {/* <button autoFocus
                                disabled={isLoading}
                                className="dark:bg-[#642bae] dark:text-white bg-none text-[#642bae] border-[#642bae] border min-w-36 h-10 p-2 rounded-full justify-center flex content-center gap-1">
                                <FaArrowsRotate className="my-auto max-w-3" />
                                Re-translate
                            </button>

                            <button autoFocus
                                disabled={true || isLoading}
                                className="dark:text-white bg-none disabled:text-gray-500 disabled:opacity-70 text-[#642bae] font-semibold min-w-36 h-10 p-2 rounded-full justify-center flex content-center gap-1">
                                <FaArrowsRotate className="my-auto max-w-3" />
                                Re-translate selection
                            </button> */}

                            <Tooltip message="The 'Pronto ID' field must not be empty." visible={!prontoId}>
                                <button autoFocus
                                    disabled={copyDisabled()}
                                    onClick={handleCopy}
                                    className="flex w-full items-center justify-center whitespace-nowrap rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-9 px-5 py-6">
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