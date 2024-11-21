import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import api from "@/app/axios";
import extractData from "@/app/helpers/extractData";
import { SmartInput } from "@/lib/smartInput";
import { showError, showMessage } from "@/app/helpers/toast";

const pilotId = 'summary';
let reg_id_count = 0;
let generateIsEnable = true;

type ScoreOption = {
    id: number;
    title: string;
    options: string[];
} 

const initialSmartInput: SmartInput = {
    itemId: '',
    headline: '',
    body: ''
}

export default function useSummaries() {

    const [sessionId, setSessionId] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [summary, setSummary] = useState<string>();

    const textAreaRefSummary = useRef<HTMLTextAreaElement>(null);

    const [article, setArticle] = useState<SmartInput>(initialSmartInput);
    const [scoreSummary, setScoreSummary] = useState<number>(0);
    const [listScoreOptions, setListScoreOptions] = useState<ScoreOption[]>([]);
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);

    const handleUsernameChange = (username: string) => {
        setUsername(username);
        localStorage.setItem('username', username);
    };

    const handleArticleChange = (value: SmartInput) => {
        setArticle(value);
    }

    const handleScoreSummaryChange = (score: number) => {
        setScoreSummary(score);
        sendMetric("summary_score", score.toString());
    }

    const handleSendAdditionalFeedback = (additionalFeedback: string) => {
        sendMetric('summary_additional_feedback', additionalFeedback);
    }

    const handleOptionScore = (optionScore: string) => {
        
        const idEventMetric = `summary_score_option`;
        sendMetric(idEventMetric, `${scoreSummary.toString()} - ${optionScore}`);
    }

    const handleGenerateSummary = async (event: any) => {
        event.preventDefault()

        if (!article?.body)
            return;
        
        setIsLoadingSummary(true);
        try{

            setScoreSummary(0);
            setSummary('');

            await sendMetric('summary_generate_started', article.body);

            const response = await chatRequest(article.body);
    
            if(response.status === 200){
                setSummary(response.data.result.data);
                sendMetric('summary_generate_finished', response.data.result.data);
                generateIsEnable= false;
            }
            else{
                showError(response.data.result.error);
                sendMetric('summary_generate_error', response.data.result.error);
            }

        } catch (err: any) {
                showError(err.message || err);
                sendMetric('summary_generate_error', JSON.stringify(err));
        }

        setIsLoadingSummary(false);
    }

    const handleSummaryRegenerate = async (event:any) => {
        
        event.preventDefault()

        if (!article?.body)
            return;
        
        setIsLoadingSummary(true);
        reg_id_count++;

        try{

            await sendMetric('summary_regenerate_started', article.body);

            const response = await chatRequest(article.body);
    
            if(response.status === 200){
                setSummary(response.data.result.data);
                setScoreSummary(0);
                sendMetric('summary_regenerate_finished', response.data.result.data);
            }
            else{
                showError(response.data.result.error);
                sendMetric('summary_regenerate_error', response.data.result.error);
            }

        } catch (err: any) {

                showError(err.message || err);
                sendMetric('summary_regenerate_error', JSON.stringify(err));
        }
        setIsLoadingSummary(false);
    }

    const handleCopy = async (event: any) => {
        event.preventDefault(); 

        if(!summary) {
            return;
        }
        let content = `${summary}`

        try {
            await navigator.clipboard.writeText(content);

            showMessage('The summary is now on your clipboard');

            await sendMetric('summary_copied', content);
            
        }
        catch (err: any) {
            showError(err.message);
        }
    };

    const handlePaste = async (event:any) => {

        event.preventDefault();

        try {

            const clipboardText = await navigator.clipboard.readText();
            
            let continueClear = false;
            
            if(scoreSummary === 0 && summary !== ''){
                continueClear = confirm('You haven’t rated this article yet. Press OK to clear everything and start a new article, or Cancel to keep the current content and rate it.')
            }
            else{
                continueClear = confirm('All content will be cleared to start a new article. Press OK to proceed, or Cancel to keep the current content.');
            }

            if(continueClear){

                clearAll();

                const data = extractData(clipboardText);
                const newSession = await manageSession();

                if (data) {

                    showMessage('Read clipboard contents successfully!');

                    handleArticleChange(data);
    
                    const separator = '\n\n___\n';
                    let content = `${data.itemId} ${separator} ${data.headline} ${separator} ${data.body}`
                    
                    await sendMetric('summary_article_pasted', content, newSession);
    
                }
                else {
                    showError('Invalid input format');
                }
            }
        }
        catch (err: any) {
            showError(`Failed to read clipboard contents:  ${err.message}`);
        }
    };

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

    const clearAll = () => {
        reg_id_count = 0;
        generateIsEnable = true;
        setArticle({itemId: '', headline: '', body: ''});
        setSummary('');
        setScoreSummary(0);
    }

    const copyDisabled = () => isLoadingSummary || !summary;

    useEffect(() => {
        setUsername(localStorage.getItem('username') || '');
    }, []);

    useEffect(() => {
        getOptions()
        .then(response => {

            const { list_score_options} = response.data.result.data;
            setListScoreOptions(list_score_options);            
        })
        .catch(err => {
            showError(err.message || err);
        });
    }, []);
        

    useEffect(() => {
        if (textAreaRefSummary.current) {
            textAreaRefSummary.current.scrollTop = textAreaRefSummary.current.scrollHeight;
        }
    }, [summary]);

    useEffect(() => {
        const handleCopyEvent = async (event: any) => {
            if (textAreaRefSummary.current && textAreaRefSummary.current.contains(event.target)) {
                handleCopy(event);
            }
        };

        document.addEventListener('copy', handleCopyEvent);

        return () => {
            document.removeEventListener('copy', handleCopyEvent);
        };
    }, [summary]);

    const getOptions  = () => {
        return api.get(`/summaries/score-options`);
    }

    const chatRequest = (content: string) => {
        return api.post(`/summaries/post?session_id=${sessionId}`, {
            content: content, 
        });
    }

    const sendMetric = (type: string, data: string, newSessionId?: string) => {
        return api.post('metrics/summaries', {
            session_id: newSessionId? newSessionId : sessionId,
            browser: navigator?.userAgent,
            username: username,
            pronto_id: article?.itemId || '',
            event_type: type,
            pilot_id: pilotId,
            event_payload: data,
            reg_id_count: reg_id_count
        });
    };
    
    return {
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
        summaryStream: summary,
        isLoading: isLoadingSummary
    }
}


