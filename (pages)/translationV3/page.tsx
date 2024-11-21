"use client"
import { Toaster } from "react-hot-toast";
import useTranslate from "./hooks/useTranslate";
import Tooltip from "@/app/components/tooltip";
import TranslationSmartInput from "@/app/components/translation-smart-input/TranslationSmartInput";
import Link from "next/link";
import {BsArrowsAngleContract } from "react-icons/bs";
import TooltipCollapse from "@/app/components/tooltip-collapse";


export default function TranslationPage() {

    const {
        username,
        prontoId,
        bodyDiff,
        headDiff,
        textAreaRefHeadline,
        textAreaRefBody,
        translatedBody,
        translatedHeadline,
        isEnglishVersionCollapsed,
        isSpanishVersionCollapsed,
        isUpdatedVersionCollapsed,
        isEditedVersionCollapsed,
        englishVersion,
        spanishOriginalVersion,
        handleUsernameChange,
        handleProntoIdChange,
        handleTranslate,
        handleCopy,
        handleTranslateBodyChange,
        handleTranslateHeadlineChange,
        handleEnglishVersionCollapsed,
        handleSpanishVersionCollapsed,
        handleUpdatedVersionCollapsed,
        handleEditedVersionCollapsed,
        handlePasteEnglish,
        handlePasteSpanish,
        copyDisabled,
        isLoading
    } = useTranslate();

    return (
        <>

            <header className="flex flex-col w-full pt-4">
                <div className="flex items-start justify-between w-full">
                    <h1 className="[text-wrap:balance] text-4xl font-bold">
                        AP Write Through Translation Assistant
                    </h1>
                    <Link
                        href="/translationV2"
                        className="ml-auto flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-9 px-6 py-2">
                        Go to Initial Translation
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
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-full pt-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div style={{ position: isEnglishVersionCollapsed ? 'absolute' : 'relative', 
                                    top: isEnglishVersionCollapsed ? 250: 0, 
                                    right: 0, 
                                    width: isEnglishVersionCollapsed ? '5%' : '100%' }}
                    >
                        <TranslationSmartInput
                            title="English Updated Version"
                            subtitle='Right click in Pronto (Copy story to clipboard) and press "Paste from Pronto" button.'
                            itemId="English item ID"
                            textButton="Clear all & Paste from Pronto"
                            smartInput={englishVersion!}
                            collapsedInitialValue={isEnglishVersionCollapsed}
                            onHandlePaste={handlePasteEnglish}
                            onClick={handleEnglishVersionCollapsed}>
                        </TranslationSmartInput>
                    </div>
                   
                    <div style={{ position: isSpanishVersionCollapsed ? 'absolute' : 'relative', 
                                 top: isSpanishVersionCollapsed ? 350: 0, 
                                 right: 0, 
                                 width: isSpanishVersionCollapsed ? '5%' : '100%' }}
                    >
                        <TranslationSmartInput
                            title="Most Recent Translation"
                            subtitle='Right click in Pronto (Copy story to clipboard) and press "Paste from Pronto" button.'
                            itemId="Spanish item ID"
                            textButton="Paste from Pronto"
                            smartInput={spanishOriginalVersion!}
                            onHandlePaste={handlePasteSpanish}
                            collapsedInitialValue={isSpanishVersionCollapsed}
                            onClick={handleSpanishVersionCollapsed}>
                        </TranslationSmartInput>
                    </div>

                    <div style={{ position: isUpdatedVersionCollapsed ? 'absolute' : 'relative', 
                                top: isUpdatedVersionCollapsed ? '450px': '0px', 
                                right: 0, 
                                width: isUpdatedVersionCollapsed ? '5%' : '100%' }}
                    >
                        <section className={`w-full transition-all duration-300 ${isUpdatedVersionCollapsed ? 'hidden' : ''} pt-6`}>
                            <div className="flex flex-col space-y-1.5 gap-1">
                                    <TooltipCollapse message="Click to collapse" visible={!isUpdatedVersionCollapsed}>
                                        <div className="flex flex-row cursor-pointer gap-4"
                                             onClick={handleUpdatedVersionCollapsed}>
                                            <h2 className="text-xl font-semibold leading-none tracking-tight">
                                                Spanish Updated Translation
                                            </h2>
                                            <div className="flex items-center">
                                                <BsArrowsAngleContract/>
                                            </div>
                                        </div>
                                    </TooltipCollapse>
                                <div className="text-sm text-muted-foreground">&nbsp;</div>
                                <div className="text-sm text-muted-foreground">&nbsp;</div>
                            </div>
                            <div className="flex flex-col gap-1">
                                        <button autoFocus
                                            disabled={isLoading}
                                            onClick={handleTranslate}
                                            className="flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-9 px-6 py-5 flex-grow w-full md:w-auto">
                                            Translate
                                        </button>
                                    </div>
                            <div className="flex w-full p-6 my-4 rounded-lg border card bg-card text-card-foreground shadow-sm">
                                <div className="flex flex-col w-full h-full gap-3">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm">&nbsp;</label>
                                        <span className="p-1 w-full md:w-[250px]">&nbsp;</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm" htmlFor="headline">Headline</label>
                                        <div 
                                            id="headline" 
                                            className="border border-gray-400 rounded-sm p-2 bg-white dark:bg-gray-900 dark:border-gray-700"
                                            style={{ minHeight: "calc(2 * 1.5em + 1rem)" }} // equivalent to rows={2}
                                            dangerouslySetInnerHTML={{ __html: headDiff || "" }} 
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm" htmlFor="body">Body</label>
                                        <div 
                                            id="body" 
                                            className="border border-gray-400 rounded-sm p-2 bg-white dark:bg-gray-900 dark:border-gray-700"
                                            style={{ minHeight: "calc(15 * 1.5em + 1rem)" }} // equivalent to rows={15}
                                            dangerouslySetInnerHTML={{ __html: bodyDiff || "" }} 
                                        />
                                    </div>                               
                                </div>
                            </div>
                        </section>
                        {isUpdatedVersionCollapsed && (
                                <button className="border text-sm rounded-md p-1 h-full min-h-[100px] bg-purple-heart-800 text-primary-foreground focus-visible:ring-ring hover:bg-purple-heart-500" style={{ width: '90px' }}>
                                    <h2 onClick={handleUpdatedVersionCollapsed}>Spanish Updated Translation</h2>
                                </button>
                        )}
                    </div>
                
                    <div style={{ position: isEditedVersionCollapsed ? 'absolute' : 'relative', 
                                top: isEditedVersionCollapsed ? 550: 0, 
                                right: 0, 
                                width: isEditedVersionCollapsed ? '5%' : '100%' }}
                    >
                        <section className={`w-full transition-all duration-300 ${isEditedVersionCollapsed ? 'hidden' : ''}  pt-6`}>
                            <div className="flex flex-col space-y-1.5">
                                <TooltipCollapse message="Click to collapse" visible={!isEditedVersionCollapsed}>
                                    <div className="flex flex-row items-center cursor-pointer gap-4"
                                         onClick={handleEditedVersionCollapsed} >
                                            <h2 className="text-xl font-semibold leading-none tracking-tight">
                                                Spanish Editable Translation
                                            </h2>
                                            <div className="flex items-center">
                                                <BsArrowsAngleContract/>
                                            </div>
                                    </div>
                                </TooltipCollapse>
                                <p className="text-sm text-muted-foreground">&nbsp;</p>
                                <div className="text-sm text-muted-foreground">&nbsp;</div>
                                <span className="flex text-sm  transition-colors disabled:pointer-events-none disabled:opacity-50 bg-transparent shadow-none hover:bg-transparent h-9 px-6 py-5 flex-grow w-full md:w-auto"></span>
                            </div>

                            <div className="flex flex-col w-full p-6 my-4 gap-3 rounded-lg border card bg-card text-card-foreground shadow-sm">
                                <div className="flex flex-col gap-1">
                                        <label className="text-sm" htmlFor="prontoId">Spanish item ID</label>
                                        <input readOnly
                                            id="prontoId"
                                            value={prontoId}
                                            onChange={(event) => handleProntoIdChange(event.target.value)}
                                            className="border rounded-sm p-1 w-full md:w-[250px]"/>
                                </div>
                                
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm" htmlFor="translatedHeadline">Headline</label>
                                    <textarea
                                        id="translatedHeadline"
                                        rows={2}
                                        ref={textAreaRefHeadline}
                                        value={translatedHeadline}
                                        onChange={(event) => handleTranslateHeadlineChange(event.target.value)}
                                        className="border rounded-sm p-2" />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-sm" htmlFor="translatedBody">Body</label>
                                    <textarea 
                                        id="translatedBody"
                                        rows={15}
                                        ref={textAreaRefBody}
                                        value={translatedBody}
                                        onChange={(event) => handleTranslateBodyChange(event.target.value)}
                                        className="border rounded-sm p-2"></textarea>
                                </div>
                                <div className="flex flex-col md:flex-row items-center gap-3 flex-wrap w-full">
                                        <Tooltip message="The 'Spanish item ID' field must not be empty." visible={!prontoId}>
                                            <button autoFocus
                                                disabled={copyDisabled()}
                                                onClick={handleCopy}
                                                className="flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-9 px-6 py-5 flex-grow w-full md:w-auto">
                                                Copy
                                            </button>
                                            <Toaster position="top-right" toastOptions={{ duration: 800, style: { marginTop: 25 } }} />
                                        </Tooltip>
                                    </div>
                                <div className="flex flex-col md:flex-row items-center gap-3 flex-wrap w-full">
                                    
                                </div>
                            </div>
                        </section>
                        {isEditedVersionCollapsed && (
                                <button className="border text-sm rounded-md p-1 h-full min-h-[100px] bg-purple-heart-800 text-primary-foreground focus-visible:ring-ring hover:bg-purple-heart-500" style={{ width: '90px' }}>
                                    <h2 onClick={handleEditedVersionCollapsed}>Spanish Editable Translation</h2>
                                </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}