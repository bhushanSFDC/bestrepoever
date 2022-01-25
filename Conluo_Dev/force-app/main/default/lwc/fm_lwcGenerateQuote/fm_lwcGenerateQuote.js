import { LightningElement,api } from 'lwc';

export default class Fm_lwcGenerateQuote extends LightningElement {
    @api recordId
    @api templateName = 'FM_Proposal_Generation';
    
}