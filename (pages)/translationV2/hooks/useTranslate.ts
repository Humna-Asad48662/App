import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import api from "@/app/axios";
import extractData from "@/app/helpers/extractData";
import { SmartInput } from "@/lib/smartInput";
import { showError } from "@/app/helpers/toast";

const pilotId = 'translation_smart_input';

const initialSmartInput: SmartInput = {
    itemId: '',
    headline: '',
    body: ''
};


export default function useTranslate() {

    const [sessionId, setSessionId] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [prontoId, setProntoId] = useState<string>('');

    const [headline, setHeadline] = useState<string>('');
    const [body, setBody] = useState<string>('');
    
    const [translatedHeadline, setTranslatedHeadline] = useState<string>();
    const [translatedBody, setTranslatedBody] = useState<string>();

    const textAreaRefHeadline = useRef<HTMLTextAreaElement>(null);
    const textAreaRefBody = useRef<HTMLTextAreaElement>(null);

    const [englishVersion, setEnglishVersion] = useState<SmartInput>(initialSmartInput);

    const [isLoadingHeadline, setIsLoadingHeadline] = useState(false);
    const [isLoadingBody, setIsLoadingBody] = useState(false);

    const handleEnglishVersionChange = (value: SmartInput) => {
        setEnglishVersion(value);
    }

    const handleUsernameChange = (username: string) => {
        setUsername(username);
        localStorage.setItem('username', username);
    };

    const handleProntoIdChange = (id: string) => {
        setProntoId(id);
        sendMetric("pronto_id_changed", id);
    };

    const handleHeadlineChange = (text: string) => {
        setHeadline(text);
    }

    const handleBodyChange = (text: string) => {
        setBody(text);
    }

    const handleTranslate = async (event: any) => {
        event.preventDefault()

        if (!headline && !body)
            return;

        if (headline) {

            setIsLoadingHeadline(true);

            try {

                await sendMetric('translate_headline_started', headline);
                
                const response = await chatRequest(headline,'headline');

                if(response.status === 200){

                    setTranslatedHeadline(response.data.result.data);
                    sendMetric('translate_headline_finished', response.data.result.data);
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

        if (body) {

            setIsLoadingBody(true);

            try{

                await sendMetric('translate_body_started', body);

                const response = await chatRequest(body,'body');
        
                if(response.status === 200){
                    setTranslatedBody(response.data.result.data);
                    sendMetric('translate_body_finished',response.data.result.data);
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
        catch (err: any) {
            showError(err.message || err);
            sendMetric('translation_copy_error', JSON.stringify(err))
            console.error('An error occurred while copying the translated text.');
        }
    };

    const handlePaste = async (event:any) => {
        event.preventDefault();

        try {
           
            const clipboardText = await navigator.clipboard.readText();
            
            const clear = confirm('Do you clean all for this news? Press OK to delete or Cancel to continue without clean.');
            
            if (clear) {

                clearAll();

                const data = extractData(clipboardText, pilotId);
                const newSession = await manageSession();
                if (data) {
                    handleEnglishVersionChange(data);
                    
                    setBody(data.body);
                    setHeadline(data.headline);
                    toast('Read clipboard contents successfully!');

                    //await sendMetric
              
                }
                else {
                    toast('Invalid input format');
                }
            }
        }
        catch (err: any) {
            showError(err.message || err);
            sendMetric('translation_paste_error', JSON.stringify(err))
            console.error('Failed to read clipboard contents: ', err);
        }
    };

    const clearAll = () => {
        setEnglishVersion(initialSmartInput);
        setTranslatedHeadline('');
        setTranslatedBody('');
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
        return api.post(`/translation/post?session_id=${sessionId}&component=${componentName}`, {
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
        headline,
        body,
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
        headlineStream: translatedHeadline,
        bodyStream: translatedBody,
        isLoading: isLoadingHeadline || isLoadingBody
    }
}

