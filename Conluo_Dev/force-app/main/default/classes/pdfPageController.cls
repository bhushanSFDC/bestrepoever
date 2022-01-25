public with sharing class pdfPageController {
    public String pdfText{get;set;}
    public pdfPageController() {
        string emailTemplateName = ApexPages.currentPage().getParameters().get('pdfText');
        String recId = ApexPages.currentPage().getParameters().get('recordId');
        
        pdfText = String.escapeSingleQuotes(
            pdfController.returnHTMLContent(emailTemplateName, recId)
        ); 
    }
}