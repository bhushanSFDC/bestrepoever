import { LightningElement, wire,api } from 'lwc';
import saveJobs from '@salesforce/apex/ApexCreateJobController.saveJobs';
import {getObjectInfo} from 'lightning/uiObjectInfoApi';
import job_details from '@salesforce/schema/Jobs__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class LwcCreateRequestComp extends NavigationMixin(LightningElement) {
    
    
    isLoading=true;
    jobDetails=[];
    servItem=[];
    jobRecordTypeId=''
    jobRecordTypeName
    //itemRecordTypeName
    jobDetailsRecordTypeInfo=[];
    //@api recordId
    /* This method creates the map of record type name and id of Job Details Object */
    @wire(getObjectInfo, {objectApiName:job_details})
    objectInfoParsing({data,error}){
        if(data){
            console.log('data',data)
            this.jobDetailsRecordTypeInfo = Object.values(data.recordTypeInfos).map(item=>{
                return {
                    name:item.name,
                    recordTypeId: item.recordTypeId
                }
            })
            this.isLoading=false
        }else{
            console.log('error in Wire getObjectInfo of lwcCreateRequestComp',error)
        }
    }
    
    //On click of each block executed 
    handleClick(event){
        this.jobDetailsRecordTypeInfo.forEach(item=>{
            if(event.currentTarget.dataset.jobrtname == item.name){
                this.jobRecordTypeId = item.recordTypeId
                this.jobRecordTypeName = item.name
                //this.itemRecordTypeName = event.currentTarget.dataset.itemrtname
            }
        })       
    }
    
    /* This method is called when Submit button is clicked on c-lwc-capture-job-container component 
    event input would be:
    jobList : Array of Job_Details Object (has id parameter also, which is deleted inside)
    item: Service Item Object details*/

    submitRecord(event){
        console.log('event',event.detail)
        this.jobDetails=event.detail.jobList.map(item=>{
            delete item.id
            item.Size__c = item.size_1 && item.size_1 ? item.size_1+" X "+item.size_2: "Vet ikke"
            delete item.size_1
            delete item.size_2
            return item
        });
        this.servItem=event.detail.item;
        console.log('jobDetails',this.jobDetails)
        console.log('serviceItems',this.servItem)
        
        
        saveJobs({ srId: this.recordId, jobList: this.jobDetails, item: this.servItem, itemRecordTypeName: this.itemRecordTypeName})
        .then((result) => {
            console.log('Success')
            console.log('result',result)
            this.showNotification('','Service Request Created Successfully', 'success')
            this.backToSelection();
            //this.jobRecordTypeId=''
            this[NavigationMixin.Navigate]({ 
                type:'standard__recordPage',
                attributes:{ 
                    recordId:result,
                    objectApiName:'Service_Items__c',
                    actionName:'view'
                }
            })
            this.backToSelection();
        })
        .catch((error) => {
            this.error = error;
            this.showNotification('','There has been an error in saveJob of lwcCreateRequestComp', 'error')
            this.backToSelection();
        });
        
    }
    
    get toSpecificJob(){
        console.log('@@@ in toSpecificJob', this.jobRecordTypeId)
        return this.jobRecordTypeId
    }
    
    backToSelection(){
        this.jobRecordTypeId = ''
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