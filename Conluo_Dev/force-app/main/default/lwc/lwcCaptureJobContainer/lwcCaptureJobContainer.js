import { LightningElement, wire, api } from 'lwc';
/* import sampleVideo from '@salesforce/resourceUrl/sampleVideo'; */
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class LwcCleanFurnitureJob extends LightningElement {
    
    jobDetails=[]
    servItem={}
    //sampleVideo = sampleVideo;
    @api jobRecordTypeId;
    @api jobRecordTypeName;
    get title(){
        return `Create ${this.jobRecordTypeName} Request`
    } 
    /* 
    Called when: on click of Submit button
    Description: Fetches JobDetails, from listJobs (array of Object) AND servItem (present in this only)
    Make sure child component c-lwc-capture-job-details keeps listJobs uptodate
    This method fires event onselected, which invokes submitRecord method in Parent Component
     */
    
   submitRecord(){
        const getJobDetails = this.template.querySelector('c-lwc-capture-job-details');
        console.log('@@@@this.jobRecordTypeName',this.jobRecordTypeName)
        console.log('getJobDetails: ',getJobDetails)
        if(getJobDetails.returnAllValid){
            const selectedEvent = new CustomEvent('selected', { detail:{
                jobList: getJobDetails.returnJobsListToParent, 
                item: this.servItem
            }} );
    
            // Dispatches the event.
            this.dispatchEvent(selectedEvent);
        }else{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please fill in required fields.',
                    variant: 'error'
                })
             );
        }
        
        

    }

    handleServiceItems(event){
        console.log('event in handleServiceItems',event.detail)
        const {name,value}=event.detail
        console.log('name',name)
        console.log('value',value)
        this.servItem[name]=value
        console.log('this.servItem',this.servItem)
    }
    
    handleChange(event){
        console.log('INSIDE handleCHnage',event.target.value)
        const {name,value} = event.target
        console.log('name',name)
        console.log('value',value)
        this.servItem[name]=value
        console.log('this.servItem',this.servItem)
    }

    BackToSelection(){
                this.dispatchEvent(new CustomEvent('backtoselection'));//no caps in event name
            }
        


   
    
}