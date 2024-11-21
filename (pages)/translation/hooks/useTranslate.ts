import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import api from "@/app/axios";
import { showError } from "@/app/helpers/toast";

const pilotId = 'translation_basic';

export default function useTranslate() {
    
    const [sessionId, setSessionId] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [prontoId, setProntoId] = useState<string>('');

    const [headline, setHeadline] = useState<string>();
    const [body, setBody] = useState<string>();

    const [translatedHeadline, setTranslatedHeadline] = useState<string>();
    const [translatedBody, setTranslatedBody] = useState<string>();

    const textAreaRefHeadline = useRef<HTMLTextAreaElement>(null);
    const textAreaRefBody = useRef<HTMLTextAreaElement>(null);

    const [isLoadingHeadline, setIsLoadingHeadline] = useState(false);
    const [isLoadingBody, setIsLoadingBody] = useState(false);

    const initSession = async () => {
        setUsername(localStorage.getItem('username') || '');

        if (!sessionId) {
            const guid = uuidv4();
            setSessionId(guid);

            await sendMetric('session_started', guid);
        }
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

            const closeSession = confirm('Have you finished the work session for this news? Press OK to start a new session or Cancel to continue editing.');

            if (closeSession) {
                await sendMetric('session_finished', sessionId);
                setSessionId('');
                location.reload();
            }
        }
        catch (e) {
            console.error('An error occurred while copying the translated text.');
        }
    };

    const copyDisabled = () => prontoId.trim() === "" || isLoadingBody || isLoadingHeadline;

    useEffect(() => {
        initSession();
    }, []);

    useEffect(() => {
        if (textAreaRefHeadline.current) {
            textAreaRefHeadline.current.scrollTop = textAreaRefHeadline.current.scrollHeight;
        }
    }, [textAreaRefHeadline]);

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
        handleUsernameChange,
        handleProntoIdChange,
        handleHeadlineChange,
        handleBodyChange,
        handleTranslate,
        handleCopy,
        copyDisabled,
        headlineStream: translatedHeadline,
        bodyStream: translatedBody,
        isLoading: isLoadingHeadline || isLoadingBody
    }
}