import { LightningElement, wire, api } from 'lwc';
import sampleVideo from '@salesforce/resourceUrl/sampleVideo';
import {getPicklistValuesByRecordType, getObjectInfo} from 'lightning/uiObjectInfoApi';
import job_details from '@salesforce/schema/Job_Details__c';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//const jobRecordTypeName = 'Furniture';

export default class LwcCleanFurnitureJob extends LightningElement {
    
    /* count=0
    furnitureType
    nofurniture=false */
    
    jobDetails=[]
    servItem={}
    sampleVideo = sampleVideo;
    @api jobRecordTypeId;
    @api jobRecordTypeName;
    
    /*@wire(getObjectInfo, {objectApiName:job_details})
    objectInfoParsing({data,error}){
        if(data){
            console.log('data',data)
            Object.values(data.recordTypeInfos).forEach(item=>{
                if(item.name == this.jobRecordTypeName){
                    this.jobRecordTypeId = item.recordTypeId
                }

            })
            console.log('recordType: ',this.jobRecordTypeId)
            //this.jobRecordTypeId = getRecordTypeId()
        }else{
            console.log('error',error)
        }
    }*/



    /* @wire(getPicklistValuesByRecordType, {objectApiName:job_details, 
		recordTypeId:'$jobRecordTypeId'})
		picklistHandler({data, error}){
            console.log('within picklistvalue wire',data)
			if(data){
				console.log(data)
				this.furnitureType = this.picklistGenerator(data.picklistFieldValues.Furniture_Type__c)
				this.isLoading = false
                console.log(this.furnitureType)
			}
			if(error){
				console.error(error)
			}
		}

	picklistGenerator(data){
		return data.values.map(item=>({"label":item.label, "value":item.value}))
	}

    

    get furnitureOptions() {
        //console.log('objectInfo',this.objectInfo)
        return this.furnitureType;
    }
    
    listFurniture=[
        {
            id:0,
            type:'',
            quantity:0
        }
    ]
    
    addRecord(){
        this.nofurniture=false
        this.count=this.count+1
        this.listFurniture=[...this.listFurniture,{
            id:this.count,
            type:'',
            quantity:0,
            recordTypeId:this.jobRecordTypeId
        }]
    }
    deleteRecord(event){
        const name=event.target.dataset.name
        this.listFurniture = this.listFurniture.filter((furn)=>{
            if(furn.id != name)
            return furn
        })
        if(this.listFurniture.length == 0){
            this.nofurniture=true
        }
    } */
    
    
    
    submitRecord(){
        const getJobDetails = this.template.querySelector('c-lwc-capture-job-details');
        console.log('getJobDetails: ',getJobDetails)
        if(getJobDetails.allValid){
            const selectedEvent = new CustomEvent('selected', { detail:{
                jobList: getJobDetails.listFurniture, 
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
        
        /* const allValid = [...this.template.querySelectorAll('.checkValid')]
            .reduce((validSoFar, inputFields) => {
                inputFields.reportValidity();
                return validSoFar && inputFields.checkValidity();
            }, true);
            if (allValid) {
        let elem = this.template.querySelectorAll('.singleFurniture')
        Array.from(elem).forEach(item=>{
            this.jobDetails = [...this.jobDetails,{
                Furniture_Type__c: item.querySelector(".furnitureType").value,
                Units__c: item.querySelector(".furnitureQty").value,
                RecordTypeId:this.jobRecordTypeId,
            }]
        })
        console.log('jobDetails',this.jobDetails)
        console.log('serviceItems',this.servItem)
        
        // Creates the event with the contact ID data.
        const selectedEvent = new CustomEvent('selected', { detail:{
            jobList: this.jobDetails, 
            item: this.servItem
        }} );

        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }else {
        // The form is not valid
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: 'Please fill in required fields.',
                variant: 'error'
            })
         );
    } */

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