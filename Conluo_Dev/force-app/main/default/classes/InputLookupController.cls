/*
 * Author		: Sachin Chavan
 * Date			: March 2017
 * Description	: Apex controller for Input Lookup Component.
 */

Global with sharing class InputLookupController {
    @AuraEnabled
    public static List < sObject > fetchLookUpValues(String searchKeyWord, String ObjectName, String extendedFilter) {
        system.debug('ObjectName-->' + ObjectName);
        String searchKey = searchKeyWord + '%';
        System.debug('searchKeyWord  ='+ searchKeyWord );
        List < sObject > returnList = new List < sObject > ();
      
        // Create a Dynamic SOQL Query For Fetch Record List with LIMIT 5   
        //String sQuery =  'select id, Name from ' +ObjectName + ' where Name LIKE: searchKey order by createdDate DESC limit 5';
        String sQuery =  'select id, Name from ' +ObjectName;
        if(extendedFilter != ''){
            sQuery = sQuery + ' where '+extendedFilter;
            system.debug('@@@@ sQuery with Extended Filter: '+sQuery);
        }
        //String sQuery =  'select id, Name from ' +ObjectName + ' where Name LIKE: searchKey order by createdDate DESC limit 5';
        
        List < sObject > lstOfRecords = Database.query(sQuery);
        String fieldAPIName = 'Name';
        for (sObject obj: lstOfRecords) {
            // B1NB; Search encrypted Name Field -- START
            String sName = String.valueOf(obj.get(fieldAPIName));
            System.debug('sName =' + sName);
            if(sName.containsIgnoreCase(searchKeyWord)){             // sName.startsWithIgnoreCase(searchKeyWord)){
                returnList.add(obj);
            }
            //returnList.add(obj); //Commented
            // B1NB ;Search encrypted Name Field -- END
            
        }
        return returnList;
    }
    
    @AuraEnabled
    public static List<sObject> search(String objectName, List<String> fields, String searchTerm){
        String searchKeyword = searchTerm + '*';
        String returningQuery = '';
        returningQuery = objectName+' ( Id, '+String.join(fields,',')+')';
        String query = 'FIND :searchKeyword IN ALL FIELDS RETURNING '+returningQuery+' LIMIT 20';
        System.debug(' query '+query);
        List<List<sObject>> searchRecords = Search.Query(Query);
        return searchRecords.get(0);
    }
}