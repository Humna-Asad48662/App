/**
 * Extracts data from clipboard text.
 * @param clipboardText - The text from the clipboard.
 * @param pilotId - Optional id for the smart copy component case, each pilot page should send its id
 * @returns The extracted data as a SmartInput object, or null if extraction fails.
 */
import { SmartInput } from "@/lib/smartInput";


export default function extractData(clipboardText: string, pilotId?: string): SmartInput | null {

    const itemIdMatch = clipboardText.match(/ITEMID:\s*(.*)/);
    const headlineMatch = clipboardText.match(/HEADLINE:\s*(.*)/);
    const bodyMatch = clipboardText.match(/BODY:\s*([\s\S]*?)___/);
    //const bodyMatch = clipboardText.match(/BODY:\s*([\s\S]*?)___\s*PUBLISH SETTINGS:/);

    if (!itemIdMatch || !bodyMatch || (!headlineMatch && pilotId !== 'headline') ) {
        return null;
    }
    else {
        return {
            itemId: itemIdMatch ? itemIdMatch[1].trim() : '',
            headline: headlineMatch ? headlineMatch[1].trim() : '',
            body: bodyMatch ? bodyMatch[1].trim() : ''
        };
    }
}