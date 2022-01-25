({
	searchHelper : function(component,event,getInputkeyWord) {
	  // call the apex class method 
     var action = component.get("c.fetchLookUpValues");
        var extFilter = component.get("v.extendedFilter");
        console.log('extFilter in Helper of Lookup: '+extFilter);
      // set param to method  
        action.setParams({
            'searchKeyWord': getInputkeyWord,
            'extendedFilter': component.get("v.extendedFilter"),//B1NB Added for extended filter while looking up data
            'ObjectName' : component.get("v.objectAPIName")
          });
      // set a callBack    
        action.setCallback(this, function(response) {
          $A.util.removeClass(component.find("mySpinner"), "slds-show");
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
              // if storeResponse size is equal 0 ,display No Result Found... message on screen.                }
                if (storeResponse.length == 0) {
                    component.set("v.Message", 'No Result Found...');
                } else {
                    component.set("v.Message", '');
                }
                // set searchResult list with return value from server.
                component.set("v.listOfSearchRecords", storeResponse);
            }
 
        });
      // enqueue the Action  
        $A.enqueueAction(action);
    
	},
})