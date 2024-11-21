import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import api from "@/app/axios";
import { SmartInput } from "@/lib/smartInput";
import diffText from "@/app/helpers/textComparator";
import { showError } from "@/app/helpers/toast";
import extractData from "@/app/helpers/extractData";

const pilotId = 'translation_write_through';

const initialSmartInput: SmartInput = {
    itemId: '',
    headline: '',
    body: ''
};


export default function useTranslate() {
    
    const [sessionId, setSessionId] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [prontoId, setProntoId] = useState<string>('');

    const [headDiff, setHeadDiff] = useState<string>();
    const [bodyDiff, setBodyDiff] = useState<string>();

    const [translatedHeadline, setTranslatedHeadline] = useState<string>();
    const [translatedBody, setTranslatedBody] = useState<string>();

    const textAreaRefHeadline = useRef<HTMLTextAreaElement>(null);
    const textAreaRefBody = useRef<HTMLTextAreaElement>(null);

    const [englishVersion, setEnglishVersion] = useState<SmartInput>(initialSmartInput);
    const [spanishOriginalVersion, setSpanishOriginalVersion] = useState<SmartInput>(initialSmartInput);

    const [isEnglishVersionCollapsed, setIsEnglishVersionCollapsed] = useState(false);
    const [isSpanishVersionCollapsed, setIsSpanishVersionCollapsed] = useState(false);
    const [isUpdatedVersionCollapsed, setIsUpdatedVersionCollapsed] = useState(false);
    const [isEditedVersionCollapsed, setIsEditedVersionCollapsed] = useState(false);
  
    const [isLoadingHeadline, setIsLoadingHeadline] = useState(false);
    const [isLoadingBody, setIsLoadingBody] = useState(false);

    const handleEnglishVersionCollapsed = () => {
        setIsEnglishVersionCollapsed(!isEnglishVersionCollapsed);
    };

    const handleSpanishVersionCollapsed = () => {
        setIsSpanishVersionCollapsed(!isSpanishVersionCollapsed);
    };

    const handleUpdatedVersionCollapsed = () => {
        setIsUpdatedVersionCollapsed(!isUpdatedVersionCollapsed);
    };

    const handleEditedVersionCollapsed = () => {
        setIsEditedVersionCollapsed(!isEditedVersionCollapsed);
    };

    const handleEnglishVersionChange = (value: SmartInput) => {
        setEnglishVersion(value);
    }

    const handleSpanishOriginalVersion = (value: SmartInput) => {
        setSpanishOriginalVersion(value);
        setProntoId(value.itemId);
    }

    const handlePasteEnglish = async (event:any) => {

        event.preventDefault();

        try {
            const clear = confirm('Do you clean all for this news? Press OK to delete or Cancel to continue without clean.');

            if (clear){

                clearAll();
                
                await manageSession();
            
                const clipboardText = await navigator.clipboard.readText();
                const data = extractData(clipboardText);

                if (data) {
                    
                    handleEnglishVersionChange(data);
                    toast('Read clipboard contents successfully!');
                }
                else {
                    toast('Invalid input format');
                }
            }
        }
        catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    };

    const handlePasteSpanish = async (event:any) => {

        event.preventDefault();

        try {
            const clipboardText = await navigator.clipboard.readText();
            const data = extractData(clipboardText);

            if (data) {
                
                handleSpanishOriginalVersion(data);
                toast('Read clipboard contents successfully!');
            }
            else {
                toast('Invalid input format');
            }
        }
        catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    };

    const clearAll= () => {
        setEnglishVersion(initialSmartInput);
        setSpanishOriginalVersion(initialSmartInput);
        setTranslatedHeadline('');
        setTranslatedBody('');
        setHeadDiff('');
        setBodyDiff('');
        setProntoId('');
    }

    const manageSession = async () => {
        if (sessionId) {
            // CloseSession
            await sendMetric('session_finished', sessionId);
            setSessionId('');
        }
    
        const newSession = uuidv4();
        setSessionId(newSession);
        await sendMetric('session_started', newSession);
    
        return newSession;
    }

    const handleUsernameChange = (username: string) => {
        setUsername(username);
        localStorage.setItem('username', username);
    };

    const handleProntoIdChange = (id: string) => {
        setProntoId(id);
        sendMetric("pronto_id_changed", id);
    };

    const handleTranslate = async (event: any) => {
        event.preventDefault();

        if (!englishVersion || !spanishOriginalVersion)
            return;

        const separator = '/*****-----*****/';

        if (englishVersion.headline) {

            setIsLoadingHeadline(true);

            try {
                await sendMetric('translate_headline_started', englishVersion.headline);
            
                const content= spanishOriginalVersion.headline + separator + englishVersion.headline
                const response = await chatRequest(content,'headline');

                if(response.status === 200){    

                    const headlineUpdated = response.data.result.data;

                    setTranslatedHeadline(headlineUpdated);
                    setHeadDiff(diffText(spanishOriginalVersion?.headline!, headlineUpdated));
                    sendMetric('translate_headline_finished', headlineUpdated);
                }
                else{
                    showError(response.data.result.error);
                    sendMetric('translate_headline_error', response.data.result.error);
                }

            } catch (err: any) {
                 showError(err.message || err);
                 sendMetric('translate_headline_error', JSON.stringify(err));
            }
            setIsLoadingHeadline(false);
        }


        if (englishVersion.body) {

            setIsLoadingBody(true);

            try{
                await sendMetric('translate_body_started', englishVersion.body);

                const content = spanishOriginalVersion.body + separator + englishVersion.body
                const response = await chatRequest(content,'body');
        
                if(response.status === 200){

                    const bodyUpdated = response.data.result.data;

                    setTranslatedBody(bodyUpdated);
                    setBodyDiff(diffText(spanishOriginalVersion?.body!, bodyUpdated));
                    sendMetric('translate_body_finished', bodyUpdated);
                }
                else{
                    showError(response.data.result.error);
                    sendMetric('translate_body_error', response.data.result.error);
                }

            } catch (err: any) {

                 showError(err.message || err);
                 sendMetric('translate_body_error', JSON.stringify(err));
            }
            setIsLoadingBody(false);
        }
    }

    const handleCopy = async (event: any) => {
        event.preventDefault();

        const disclaimer = 'Esta historia fue traducida del inglés por un editor de AP con la ayuda de una herramienta de inteligencia artificial generativa.';
        const separator = '\n\n___\n';

        let content = `${translatedHeadline} ${separator} ${translatedBody} ${separator} ${disclaimer}`

        try {
            await navigator.clipboard.writeText(content);
            toast('It´s already in your clipboard');

            await sendMetric('translation_copied', content);
        }
        catch (e) {
            console.error('An error occurred while copying the translated text.');
        }
    };

    const copyDisabled = () => prontoId.trim() === "" || isLoadingBody || isLoadingHeadline;

    useEffect(() => {
        setUsername(localStorage.getItem('username') || '');
    }, []);

    useEffect(() => {
        if (textAreaRefHeadline.current) {
            textAreaRefHeadline.current.scrollTop = textAreaRefHeadline.current.scrollHeight;
        }
    }, [translatedHeadline]);

    useEffect(() => {
        if (textAreaRefBody.current) {
            textAreaRefBody.current.scrollTop = textAreaRefBody.current.scrollHeight;
        }
    }, [translatedBody]);

    const chatRequest = (content: string, componentName: string) => {
        return api.post(`/translation-diff/post?session_id=${sessionId}&component=${componentName}`, {
            content: content, 
        });
    };

    const sendMetric = (type: string, data: string) => {
        return api.post('/metrics/translation', {
            session_id: sessionId,
            browser: navigator?.userAgent,
            username: username,
            pronto_id: prontoId,
            event_type: type,
            pilot_id: pilotId,
            event_payload: data
        });
    };


    
    return {
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
        handleTranslateBodyChange: setTranslatedBody,
        handleTranslateHeadlineChange: setTranslatedHeadline,
        handleEnglishVersionCollapsed,
        handleSpanishVersionCollapsed,
        handleUpdatedVersionCollapsed,
        handleEditedVersionCollapsed,
        handlePasteEnglish,
        handlePasteSpanish,
        copyDisabled,
        isLoading: isLoadingHeadline || isLoadingBody
    }
}