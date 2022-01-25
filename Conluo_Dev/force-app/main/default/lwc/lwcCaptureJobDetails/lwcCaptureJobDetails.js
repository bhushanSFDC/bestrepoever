import { LightningElement, api, wire } from 'lwc';
import {getPicklistValuesByRecordType, getObjectInfo} from 'lightning/uiObjectInfoApi';
import job_details from '@salesforce/schema/Jobs__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const SPECIAL_REQUEST = 'Spesialrenhold';
const MAIN_REQUEST = 'Hovedrengjøring';
const BONING_REQUEST = 'Boning';
const FURNITURE_REQUEST = 'møbelrens';
const CARPET_REQUEST = 'Tepperens';
const WINDOW_REQUEST = 'Vinduspuss';

export default class LwcCaptureJobDetails extends LightningElement {
    @api jobRecordTypeId;
    @api jobRecordTypeName;
    @api jobDetails
    @api allValid=false
    @api get returnAllValid(){
        return this.jobRecordTypeName == SPECIAL_REQUEST?true:this.allValid;
    }
    @api listJobs=[
        {
            id:0,
            //Furniture_Type__c:'',
            Type__c:'',
            Units__c:0,
            Size__c:'',
            //Carpet_Type__c:'',
            RecordTypeId:this.jobRecordTypeId,
            size_1:'',
            size_2:'',
            Internal_Window__c:false,
            External_Window__c:false,
            Can_window_Open_Inwards__c:false


        }
    ]

    @api get returnJobsListToParent(){
        if (this.jobRecordTypeName == SPECIAL_REQUEST){
            return [{
                id:this.count,
                RecordTypeId:this.jobRecordTypeId
            }]
        } else
        return this.listJobs
    }
    //furnitureType
    //carpetType
    jobtype
    noJobsAdded=false
    isLoading=true;
    count=0
    @wire(getPicklistValuesByRecordType, {objectApiName:job_details, 
		recordTypeId:'$jobRecordTypeId'})
		picklistHandler({data, error}){
            console.log('within picklistvalue wire',data)
			if(data){
				console.log(data)
                console.log('data.picklistFieldValues.Type__c',data.picklistFieldValues.Type__c)
				//this.furnitureType = this.picklistGenerator(data.picklistFieldValues.Furniture_Type__c)
                //this.carpetType = this.picklistGenerator(data.picklistFieldValues.Carpet_Type__c)
                this.jobtype = this.picklistGenerator(data.picklistFieldValues.Type__c)
				this.isLoading = false
                console.log(this.jobtype)
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
        //return this.furnitureType;
        return this.jobtype;
    }

    /* get options(){
        return  [
            { label: 'Vet ikke', value: 'Vet ikke' },
            
        ]
    } */
    
    
    
    addFurnitureRecord(){
        this.noJobsAdded=false
        this.count=this.count+1
        this.listJobs=[...this.listJobs,{
            id:this.count,
            //Furniture_Type__c:'',
            Type__c:'',
            Units__c:0,
            RecordTypeId:this.jobRecordTypeId
        }]
        console.log('listJobs after adding new record: ',this.listJobs)
    }
    deleteFurnitureRecord(event){
        const name=event.target.dataset.name
        this.listJobs = this.listJobs.filter((furn)=>{
            if(furn.id != name)
            return furn
        })
        if(this.listJobs.length == 0){
            this.noJobsAdded=true
        }
        console.log('listJobs after Deleting  record: ',this.listJobs)
    }

    get handleMultipleJobs(){
        return this.jobRecordTypeId && (this.jobRecordTypeName == FURNITURE_REQUEST || this.jobRecordTypeName == MAIN_REQUEST) ?true:false
    }
    get handleOnlyType(){
        return this.jobRecordTypeId && (this.jobRecordTypeName == CARPET_REQUEST || this.jobRecordTypeName == BONING_REQUEST) ?true:false
    }
    get isFurniture(){
        return this.jobRecordTypeId && this.jobRecordTypeName == FURNITURE_REQUEST?true:false
    }
    get isCarpet(){
        return this.jobRecordTypeId && this.jobRecordTypeName == CARPET_REQUEST?true:false
    }
    get isBoning(){
        return this.jobRecordTypeId && this.jobRecordTypeName == BONING_REQUEST?true:false
    }
    get isWindow(){
        return this.jobRecordTypeId && this.jobRecordTypeName == WINDOW_REQUEST?true:false
    }
    get isMain(){
        return this.jobRecordTypeId && this.jobRecordTypeName == MAIN_REQUEST?true:false
    }
    get isSpecial(){
        return this.jobRecordTypeId && this.jobRecordTypeName == SPECIAL_REQUEST?true:false
    }

    get multiJobType(){
        console.log('get multiJobType: ',this.jobRecordTypeName)
        if(this.jobRecordTypeName == FURNITURE_REQUEST){
            console.log('retunring Furniture in multiJobType')
            return {lable:'Furniture', units:'Quantity'}
        }else if(this.jobRecordTypeName == MAIN_REQUEST){
            console.log('retunring Main in multiJobType')
            return {lable:'Type Lokaler', units:'Totalareal (kvm)'}
        }
    }

    get onlyTypeDetails(){
        console.log('get onlyTypeDetails: ',this.jobRecordTypeName)
        if(this.jobRecordTypeName == CARPET_REQUEST){
            console.log('retunring Carpet in onlyTypeDetails')
            return {lable:'Teppetype'}
        }else if(this.jobRecordTypeName == BONING_REQUEST){
            console.log('retunring Boning in onlyTypeDetails')
            return {lable:'Gulvtype'}
        }
    }

    handleChange(event){
            this.validateData()
            const {name, type} = event.target            
            const value = type == 'checkbox' || type == 'toggle'?event.target.checked:event.target.value
            this.listJobs.forEach((item)=>{
                if(event.target.dataset.name == item.id){
                    item[name]=value;
                    item.RecordTypeId=this.jobRecordTypeId
                }
            })
            console.log('this.listFunrniture on Change:  ', this.listJobs)    
}
validateData(){
    this.allValid = false
    this.allValid = [...this.template.querySelectorAll('.checkValid')]
    .reduce((validSoFar, inputFields) => {
        inputFields.reportValidity();
        return validSoFar && inputFields.checkValidity();
    }, true);

}

}