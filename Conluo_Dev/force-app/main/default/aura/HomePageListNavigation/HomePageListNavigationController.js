({
	callListView : function(component, event, helper) {
		console.log('I am clicked');
        var pageReference = {
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Account',
                actionName: 'list'
            },
            state: {
                filterName: "MyAccounts"
            }
        };
        var navService = component.find("navService");
        // Uses the pageReference definition in the init handler
        
        event.preventDefault();
        navService.navigate(pageReference);
	}
})