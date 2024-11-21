import api from "@/app/axios";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { showError, showMessage, showWarning } from "@/app/helpers/toast";
import extractData from "@/app/helpers/extractData";
import { AxiosResponse } from "axios";
import { OptionScore } from "@/lib/optionScore";


const pilotId = 'headline';

type HeadlineData ={
    headlineDescriptive:string,
    headlineDirect: string,
    headlineCuriosity: string
}

/**
 * Custom React hook for managing headlines.
 *
 * @returns An object containing the state variables and event handlers for managing headlines.
 */
export default function useHeadlines() {

    const [sessionId, setSessionId] = useState<string>('');
    const [username, setUsername] = useState<string>('');

    const [itemId, setItemId] = useState<string>('');
    const [body, setBody] = useState<string>();
    const [headline, setHeadline] = useState<string>();

    const [headlineDirect, setHeadlineDirect] = useState<string>('');
    const [headlineDescriptive, setHeadlineDescriptive] = useState<string>('');
    const [headlineCuriosity, setHeadlineCuriosity] = useState<string>('');

    const [scoreHeadlineDirect, setScoreHeadlineDirect] = useState<number>(0);
    const [scoreHeadlineDescriptive, setScoreHeadlineDescriptive] = useState<number>(0);
    const [scoreHeadlineCuriosity, setScoreHeadlineCuriosity] = useState<number>(0);

    const [isLoadingHeadlines, setIsLoading] = useState(false);

    const [usefulOptions, setUsefulOptions] = useState<OptionScore[]>([]);
    const [notUsefulOptions, setNotUsefulOptions] = useState<OptionScore[]>([]);


    /**
     * Function to handle the regeneration of a specific headline.
     * It obtains 3 headlines from the API but only sets the state for the requested headline.
     */
    const handleHeadlineRegenerate = async (event: any, headline: string) => {

        event.preventDefault();

        if (!body) return;

        if (body) {     
            //regeneration process is in progress
            setIsLoading(true);

            try {
                await sendMetric(`headline_${headline}_regenerate_started`, body);

                const response: AxiosResponse = await chatRequest(body);

                if(response.status === 200){

                    // Extract headline data 
                    const headlines: HeadlineData = response.data.result.data;

                    // Depending on the type of headline, update the corresponding states and send a completion metric
                    switch (headline) {
                        case 'direct':
                                setHeadlineDirect(headlines.headlineDirect);
                                setScoreHeadlineDirect(0);
                                await sendMetric(`headline_${headline}_regenerate_completed`, headlines.headlineDirect);
                                break;
                        case 'descriptive':
                                setHeadlineDescriptive(headlines.headlineDescriptive);
                                setScoreHeadlineDescriptive(0);
                                await sendMetric(`headline_${headline}_regenerate_completed`, headlines.headlineDescriptive);
                                break;
                        case 'curiosity':
                                setHeadlineCuriosity(headlines.headlineCuriosity);
                                setScoreHeadlineCuriosity(0);
                                await sendMetric(`headline_${headline}_regenerate_completed`, headlines.headlineCuriosity);
                                break;
                        default:
                            break;
                    }

                    
                }
                else{
                    showError(response.data.result.error);
                    sendMetric('headline_regenerated_error', response.data.result.error);
                }
            }
            catch (err: any) {
                showError(err.message || err);
                sendMetric('headline_regenerated_error', JSON.stringify(err));
            }
        }
        // Regeneration process has finished
        setIsLoading(false);
    
    };
    
    /**
     * Function to handle the generation of headlines.
     * It obtains 3 headlines from the API and sets the state for each corresponding headline.
    */
    const handleHeadlinesGenerate = async (event: any) => {
        
        event.preventDefault()

        if (!body) return;

        if (body) {    

            try {
                // Generate process has started
                setIsLoading(true);
                await sendMetric('headline_generate_started', body);

                const response = await chatRequest(body);

                if(response.status === 200){

                    setHeadlineDirect('');
                    setScoreHeadlineDirect(0);

                    setHeadlineDescriptive('');
                    setScoreHeadlineDescriptive(0);
                    
                    setHeadlineCuriosity('');
                    setScoreHeadlineCuriosity(0);

                    // Extract headline data 
                    const headlines: HeadlineData = response.data.result.data;

                    //update states and send a completion metric
                    setHeadlineDirect(headlines.headlineDirect);
                    setHeadlineDescriptive(headlines.headlineDescriptive);
                    setHeadlineCuriosity(headlines.headlineCuriosity);
                    
                    const separator = '\n\n___\n';
                    let headlinesContent = `${headlines.headlineDirect} ${separator} ${headlines.headlineDescriptive} ${separator} ${headlines.headlineCuriosity}`;

                    sendMetric('headline_generated_completed', headlinesContent);
                }
                else{
                    showError(response.data.result.error);
                    sendMetric('headline_generated_error', response.data.result.error);
                }
            }
            catch (err: any) {
                showError(err.message || err);
                sendMetric('headline_generated_error', JSON.stringify(err));
            }
        }
        // Generate process has finished
        setIsLoading(false);
    }

    const handleUsernameChange = (username: string) => {
        setUsername(username);
        localStorage.setItem('username', username);
    };

    const handleItemIdChange = (id: string) => {
        setItemId(id);
        sendMetric("item_id_changed", id);
    };

    const handleScoreDirectChange = (score: number) => {
        setScoreHeadlineDirect(score)
        sendMetric("headline_score_direct", score.toString());
    }

    const handleScoreDescriptiveChange = (score: number) => {
        setScoreHeadlineDescriptive(score);
        sendMetric("headline_score_descriptive", score.toString());
    }

    const handleScoreCuriosityChange = (score: number) => {
        setScoreHeadlineCuriosity(score);
        sendMetric("headline_score_curiosity", score.toString());
    }

    const handleBodyChange = (text: string) => {
        setBody(text);
    }

    const handleOptionScoreChange = (headlineId: string, score: number, feedback: string) => {
        const idEventMetric = `headline_score_${headlineId}`;
        sendMetric(idEventMetric, `${score.toString()} - ${feedback}`);
    }


    const handleCopy = async (event: any, idHeadline: string) => {
        event.preventDefault();

        let content = `${idHeadline}`

        try {
            await navigator.clipboard.writeText(content);
            showWarning('It´s already in your clipboard');

            await sendMetric('headline_copied', content);
        }
        catch (err: any) {
            showError(err.message);
        }
    };

    const handlePaste = async (event: any) => {

        event.preventDefault();

        try {

            const clipboardText = await navigator.clipboard.readText();

            const clear = confirm('Do you clean all for this news? Press OK to delete or Cancel to continue without clean.');

            if (clear) {

                clearAll();

                const data = extractData(clipboardText, pilotId);
                
                const newSession = await manageSession();
            
                if (data) {                    
                    showMessage('Read clipboard contents successfully!');
    
                    setItemId(data.itemId)
                    setHeadline(data.headline)
                    setBody(data.body)
    
                    const separator = '\n\n___\n';
                    let content = `${data.itemId} ${separator} ${data.headline} ${separator} ${data.body}`
                    
                    //Send Metric with new guid
                    await sendMetric('headline_smart_paste', content,newSession);
                }
                else {
                    showError('Invalid input format');
                }
            }
            else {
                return;
            }
           
        }
        catch (err) {
            console.error('Failed to read clipboard contents: ', err);
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

        //TODO: Refactor to reduce 
        setHeadlineCuriosity('');
        setHeadlineDescriptive('');
        setHeadlineDirect('');
        setScoreHeadlineDescriptive(0);
        setScoreHeadlineCuriosity(0);
        setScoreHeadlineDirect(0);
        setItemId('');
        setHeadline('');
        setBody('');
    }

    const copyDisabled = () => itemId.trim() === "" || !headlineDirect || !headlineDescriptive || !headlineCuriosity;

    useEffect(() => {
        setUsername(localStorage.getItem('username') || '');
    }, []);

    useEffect(() => {
                getOptions()
                .then(response => {

                    const { usefulOptions, notUsefulOptions } = response.data.result.data;
                    setUsefulOptions(usefulOptions);
                    setNotUsefulOptions(notUsefulOptions);
                })
                .catch(err => {
                    showError(err.message || err);
                });
    }, []);

    const getOptions  = () => {
        return api.get(`/headline/score-options`);
    }

    const chatRequest = (content: string) => {
        return api.post(`/headline/post?session_id=${sessionId}`, {
            content: content, 
        });
    }

    const sendMetric = (type: string, data: string, newSession?:string) => {
        return api.post('/metrics/headline', {
            session_id: newSession || sessionId,
            browser: navigator?.userAgent,
            username: username,
            pronto_id: itemId,
            event_type: type,
            pilot_id: pilotId,
            event_payload: data
        });
    };


    return {
        username,
        itemId,
        headline,
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
        handleScoreDirectChange,
        handleScoreDescriptiveChange,
        handleScoreCuriosityChange,
        handleOptionScoreChange,
        handleCopy,
        handlePaste,
        copyDisabled,
        isLoading:  isLoadingHeadlines,
    }
}
