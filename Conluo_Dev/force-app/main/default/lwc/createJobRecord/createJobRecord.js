import { LightningElement, api, wire, track } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import REVENUE_FIELD from '@salesforce/schema/Account.AnnualRevenue';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';

export default class CreateJobRecord extends LightningElement {
// ApI name for App Builder setup
    @api recordId;
    @api objectApiName;
    @api optionVal;

    @track objectInfo;
    @track recordTypeIdVal;
    @track openmodel = true;
 
    fields = [NAME_FIELD, REVENUE_FIELD, INDUSTRY_FIELD];
    @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
    objectInfo;
    get recordTypeId() {
     
    // Returns a map of record type Ids
     
       var recordtypeinfo = this.objectInfo.data.recordTypeInfos;
       var uiCombobox = [];
   
      console.log("recordtype" + recordtypeinfo);
      for(var eachRecordtype in  recordtypeinfo)//this is to match structure of lightning combo box
      {
        if(recordtypeinfo.hasOwnProperty(eachRecordtype))
        uiCombobox.push({ label: recordtypeinfo[eachRecordtype].name, value: recordtypeinfo[eachRecordtype].name })
      }
      //console.log('uiCombobox' + JSON.stringify(uiCombobox));
      return uiCombobox;
    }
    changeHandler(event){
        this.optionVal=event.target.value;
    }
    handleChange(event) {
         // Returns a map of record type Ids
         const rtis = this.objectInfo.data.recordTypeInfos;
         this.recordTypeIdVal=(Object.keys(rtis).find(rti => rtis[rti].name === this.optionVal));
         this.closeModal();
        }

        handleSuccess(event) {
            const evt = new ShowToastEvent({
                title: "Account created",
                message: "Record ID: " + event.detail.id,
                variant: "success"
            });
            this.dispatchEvent(evt);
        }
        openModal() {
            this.openmodel = true
        }
        closeModal() {
            this.openmodel = false
        }

    }