/*
 * Author		: Sachin Chavan
 * Date			: March 2017
 * Description	: Test Class for Input Lookup Component.
 */
@isTest
private class InputLookupController_Test {

    @testSetup
    static void setupTestData() {
        List<Account> accountToBeInsertList = new List<Account>();
        for(Integer iIndex = 1; iIndex <= 100; iIndex++) {
            Account accountNew = new Account();
            accountNew.Name = 'Test Account - ' + iIndex;
            accountNew.Website = 'www.cognizant.com';
            accountNew.Phone = '9876543210';
            
            accountToBeInsertList.add(accountNew);
        }
        
        insert accountToBeInsertList;
    }
    
    @isTest
    static void inputLookupFunctionalityTest() {
        InputLookupController.fetchLookUpValues('Account', 'Test Account - 100','');
        /* List<Object> recordList = (List<Object>) JSON.deserializeUntyped(recordsJSONString);
        System.assertEquals(1, recordList.size()); */
    }
    
    
}