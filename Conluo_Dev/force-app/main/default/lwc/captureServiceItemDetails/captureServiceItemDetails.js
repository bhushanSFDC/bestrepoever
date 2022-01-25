import { LightningElement } from 'lwc';

export default class CaptureServiceItemDetails extends LightningElement {
    searchLookupfields = ["Name","Phone","Site"]
    displayLookupFields = 'Name, Phone'
    handleChange(event){
        console.log(event.target.value)
        const {name,value} = event.target
        const changedEvent = new CustomEvent('changed', { detail:{
            name, 
            value
        }} );

        // Dispatches the event.
        this.dispatchEvent(changedEvent);
        //this.servItem[name]=value
    }
   
    handleLookup(event){
        //this.servItem.Customer__c = event.detail.data.recordId

        const changedEvent = new CustomEvent('changed', { detail:{
            name:'Customer__c',
            value:event.detail.data.recordId
        }} );

        // Dispatches the event.
        this.dispatchEvent(changedEvent);
        //console.log(this.servItem.Customer__c)
    }
}