public class TextVFPDFController {
    public Service_Request__c sr{get;set;}
    public TextVFPDFController(){
        Id srId = apexpages.currentpage().getparameters().get('id');
		sr = [select id,Name from Service_Request__c where id=: srId];
    }
    
    	@auraEnabled
    public static void savePDFOpportunity(string parentId){
        PageReference pdfPage = new PageReference('/apex/TestVFPDFGenerator');
		pdfPage.getParameters().put('Id', parentId);
        Blob pdfContent = pdfPage.getContent();
        
        Attachment attach1= new Attachment();
        attach1.ParentId = parentId;
        attach1.Name = 'Test Attachment for PDF';
        attach1.Body = pdfContent;
        attach1.contentType = 'application/pdf';
		insert attach1;
        
    }

}