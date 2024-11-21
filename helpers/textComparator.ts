import { diffWords } from "diff";

export default function textComparator(original: string, updated:string): string{

    const differences = diffWords(original, updated);
    
    let diffResult = '';

    differences.forEach((part) => {
    
       const color = part.added ? 'green' :
                   part.removed ? 'red' : 'grey';
    
       if (color === 'green' || color === 'red') {
        
         diffResult += ` <span style="color:${color}"><b>${part.value}</b></span>`;
       } 
       else {

         diffResult += ` <span style="color:${color}">${part.value}</span>`;
       }
    });

    return diffResult;
};


