import { LightningElement, api,wire } from 'lwc';
import generatePDF from '@salesforce/apex/pdfController.generatePDF'
import returnHTMLContent from '@salesforce/apex/pdfController.returnHTMLContent'
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class Fm_lwcCreatePDFbyEmailTemp extends NavigationMixin(LightningElement) {
    @api recordId
    @api templateName='FM_Proposal_Generation';
    isLoading = true
    htmltext=""
    /* siteURL;
    
    connectedCallback() {
        
        this.siteURL = '/apex/renderAsPDF?recId=' + this.recordId;

    }
 */


    @wire(returnHTMLContent, {htmlTemplate:'$templateName', 
    RecId:'$recordId'})
		loadTemplate({data, error}){
            console.log('templateName',this.templateName)
            console.log('recordId',this.recordId)
            console.log('data',data)
			if(data){
				console.log(data)
                this.htmltext = data
				this.isLoading = false
                console.log(this.jobtype)
			}
			if(error){
				console.error(error)
			}
		}

    pdfHandler(){
        /* let content = this.template.querySelector('.container')
        console.log(content.outerHTML) */
        generatePDF({ recordId:this.recordId, htmlData:this.templateName}).then(result=>{
            console.log("attachment id", result)
            this.showNotification('Quote Generated','Quote is attached to Service Request Successfully !!!', 'success')

                this[NavigationMixin.Navigate]({ 
                    type:'standard__recordPage',
                    attributes:{ 
                        recordId:this.recordId,
                        objectApiName:'Service_Items__c',
                        actionName:'view'
                    }
                })
            //window.open(`https://dcx5-dev-ed--c.documentforce.com/servlet/servlet.FileDownload?file=${result.Id}`)
        }).catch(error=>{
            console.error(error)
        })
    }

    showNotification(title,message, variant) {
        const evt = new ShowToastEvent({
            title,
            message,
            variant,
        });
        this.dispatchEvent(evt);

        
    }
}