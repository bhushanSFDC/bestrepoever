trigger JobDetails on Job_Details__c (before insert) {
   /* list<Service_Request__c> lstSR = new list<Service_Request__c>();
    list<Service_Items__c> lstSI = new list<Service_Items__c>();
    for(Job_Details__c jd : Trigger.new){
        Service_Request__c sr = new Service_Request__c();
        sr.Customer_Name__c = jd.Customer__c;
        lstSR.add(sr);
        
    }
    insert lstSR;
    for(Job_Details__c jd : Trigger.new){
        Service_Items__c si = new Service_Items__c();
        if(jd.RecordTypeId == '0125g000001mlL4'){
            si.RecordTypeId = '0125g000001kgHr';
        }else if(jd.RecordTypeId == '0125g000001mlOq'){
            si.RecordTypeId = '0125g000001kgI2';
        }
        si.Customer__c = jd.Customer__c;
        si.Service_Request__c = lstSR[0].Id;
        lstSI.add(si);
    }
    insert lstSI;
    for(Job_Details__c jd : Trigger.new){
        jd.Service_Item__c = lstSI[0].Id;
    }*/
}