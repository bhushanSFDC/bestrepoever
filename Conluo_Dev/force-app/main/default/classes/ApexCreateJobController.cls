Global class ApexCreateJobController {
    
    /*@AuraEnabled
     Global static string saveJobs(string srId, List<Job_Details__c> jobList, Service_Items__c item, string itemRecordTypeName) 
    {        
        system.debug('@@@@ jobList: '+jobList);
        system.debug('@@@@ item: '+item);
        system.debug('@@@@ srId: '+srId);
        
        Service_Request__c sr = new Service_Request__c();
        if(srId != '' && srId != null ){
            sr.Id = Id.ValueOf(srId);
        }else{
            sr.Customer_Name__c = item.Customer__c;        
            insert sr;
        }
        
        system.debug('@@@SR: '+ sr);
        system.debug('@@@@map: '+Schema.SObjectType.Service_Items__c.getRecordTypeInfosByName());
        system.debug('@@@@itemRecordTypeName: '+itemRecordTypeName);
        item.RecordTypeId=Schema.SObjectType.Service_Items__c.getRecordTypeInfosByName().get(itemRecordTypeName).getRecordTypeId();
        //item.RecordTypeId = '0125g000001kgHr';        
        item.Service_Request__c = sr.Id;        
        insert item;
        system.debug('@@@lstSI: '+ item);
        
        for(Job_Details__c jd : jobList){
            jd.Service_Item__c = item.Id;
            jd.Service_Request__c = sr.Id;
            //jd.RecordTypeId = '0125g000001mlL4';
        }        
        insert jobList;        
        system.debug('@@@jobList: '+ jobList);
        
        return item.Id;
    } */
    @AuraEnabled
    Global static string saveJobs(List<Jobs__c> jobList, Service_Items__c item) 
    {        
        system.debug('@@@@ jobList: '+jobList);
        system.debug('@@@@ item: '+item);
        item.stage__c = 'Prospecting';
        RecordType rt = new RecordType();
        rt = [select id, name from recordtype where id =:jobList[0].RecordTypeId];
        item.Primary__c = (String)rt.name;
        insert item;
        system.debug('@@@lstSI: '+ item);
        
        for(Jobs__c jd : jobList){
            jd.Service_Items__c = item.Id;
            //jd.RecordTypeId = '0125g000001mlL4';
        }        
        insert jobList;        
        system.debug('@@@jobList: '+ jobList);
        
        return item.Id;
    }
}