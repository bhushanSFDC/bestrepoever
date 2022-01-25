public with sharing class FM_MenuController {
    @AuraEnabled(cacheable=true)
    public static FM_Menu__mdt menuData(String menuName) {
        // Current known list of Menus for example:
        // FM_MenuHome
        FM_Menu__mdt menuInstance = FM_Menu__mdt.getInstance(menuName); // Limited to 255 characters for fields so we just get the Id
        if (menuInstance != null) {
            Id menuId = menuInstance?.Id;
            FM_Menu__mdt menuRecord = [Select Id, MenuJSON__c, ConfigJSON__c from FM_Menu__mdt where Id =: menuId WITH SECURITY_ENFORCED];
            menuRecord.MenuJSON__c = hydrateMenuData(menuRecord?.MenuJSON__c);
            return menuRecord;
        }
        else {
            return null; // Failed to find valid CMDT but still return a JSON parsable Array of nothing as a result and other code will try to respect a "nothing" result
        }
    }

    private static String hydrateMenuData(String menuJSONString) {
        List<MenuItem> menuList = (List<MenuItem>) JSON.deserialize(menuJSONString, List<MenuItem>.class);
        menuList = calculateMenuData(menuList);
        String returnJSON = JSON.serializePretty(menuList, true); // suppressApexObjectNulls
        // System.debug('*** returnJSON: ' + returnJSON);
        return returnJSON;
    }

    private static List<MenuItem> calculateMenuData(List<MenuItem> menuList) {
        // create the lookup map that will hold values we'll need for bulk SOQL statements
        Map<String, Map<String,Object>> menuLookupMap = createMenuLookupMap(menuList);
        // pass in the data classes and the lookup map that will be called recursively and mutated in place to maintain state
        menuList = loopMenuDataToBuildListViewMap(menuList, menuLookupMap);
        // update/query data steps into the menuLookupMap variable
        menuLookupMap = updateListViewUrls(menuLookupMap);
        // loop back through the menuList Object/JSON setup to apply new data from the menuLookupMap, ie final urls
        menuList = loopMenuDataToFinalizeUrlsAndStyle(menuList, menuLookupMap);
        // System.debug('*** menuList: ' + menuList);
        return menuList;
    }

    private static Map<String, Map<String,Object>> updateListViewUrls(Map<String, Map<String,Object>> menuLookupMap) {
        Map<String,Object> listViewMap = menuLookupMap.get('listView');
        Set<String> setViewAPINames = listViewMap.keySet();
        // System.debug('*** setViewAPINames: ' + setViewAPINames);
        List<ListView> listViewResults = [Select Id, Name, DeveloperName, SobjectType from ListView where DeveloperName IN: setViewAPINames WITH SECURITY_ENFORCED];
        for (ListView listViewResult : listViewResults) {
            listViewMap.put(listViewResult.DeveloperName, listViewResult);
        }
        menuLookupMap.put('listView', listViewMap);
        // System.debug('*** listViewResults: ' + listViewResults);
        return menuLookupMap;
    }

    private static List<MenuItem> loopMenuDataToBuildListViewMap(List<MenuItem> menuList, Map<String, Map<String,Object>> menuLookupMap) {
        Map<String,Object> listViewMap = menuLookupMap.get('listView');
        for (MenuItem item : menuList) {
            // listView url lookup feature
            // handle any updates that need to happen to URLs for dynamic Id or lookups like listViews, or staticResource file urls
            if (item.listView != null) {
                // Add a placeholder for the DeveloperAPIName to look up later
                listViewMap.put(item.listView, null);
            }
            // Finally if there are nested nodes recursively process them too
            if (item.nestedLinks != null && !item.nestedLinks.isEmpty()) {
                item.nestedLinks = loopMenuDataToBuildListViewMap(item.nestedLinks, menuLookupMap);
            }
        }
        menuLookupMap.put('listView', listViewMap);

        return menuList;
    }

    private static List<MenuItem> loopMenuDataToFinalizeUrlsAndStyle(List<MenuItem> menuList, Map<String, Map<String,Object>> menuLookupMap) {
        Map<String,Object> listViewMap = menuLookupMap.get('listView');
        for (MenuItem item : menuList) {
            item = processMenuNode(item, listViewMap);
            // Finally if there are nested nodes recursively process them too
            if (item.nestedLinks != null && !item.nestedLinks.isEmpty()) {
                item.nestedLinks = loopMenuDataToFinalizeUrlsAndStyle(item.nestedLinks, menuLookupMap);
            }
        }

        return menuList;
    }

    private static MenuItem processMenuNode(MenuItem item, Map<String,Object> listViewMap) {
        if (item.listView != null) {
            // listView url lookup feature
            // handle any updates that need to happen to URLs for dynamic Id or lookups like listViews, or staticResource file urls
            if (listViewMap.get(item.listView) != null) {
                item.linkUrl = buildListViewURL((ListView)listViewMap.get(item.listView));
                // System.debug('*** buildListViewURL item.linkUrl: ' + item.linkUrl);
            }
        }
        if (item.staticResourceName != null && String.isEmpty(item.linkUrl)) {
            item.linkUrl = buildStaticResourceURL(item);
            // System.debug('*** buildStaticResourceURL item.linkUrl: ' + item.linkUrl);
        }
        // Style section
        if(String.isEmpty(item.linkUrl)) {
            item.style = String.isEmpty(item.style) ? 'urlMissing' : item.style + ' urlMissing';
        }
        if(item.highlight != null && item.highlight.contains('true')) {
            item.style = String.isEmpty(item.style) ? 'highlight' : item.style + ' highlight';
        }

        return item;
    }

    private static String buildListViewURL(ListView listViewResultObj) {
        String templateString = '/lightning/o/{0}/list?filterName={1}';
        List<String> templateParams = new List<String>();
        templateParams.add(String.valueOf(listViewResultObj.SobjectType) );
        templateParams.add(String.valueOf(listViewResultObj.Id) );
        String resultURL = String.format(templateString, templateParams);
        // example resultURL
        // /lightning/o/JF_Notification__c/list?filterName=00BB0000004G9rIMAS
        return resultURL;
    }

    private static String buildStaticResourceURL(MenuItem menuItem) {
        String staticResourceUrl = '';
        String resultURL = '';
         // return a fast no SOQL result for the StaticResourceName
        staticResourceUrl = PageReference.forResource(menuItem.staticResourceName).getUrl();
        // clean the URL to be like:
        // /resource/1635959525000/JF_Form_Templates
        if(staticResourceUrl.contains('resource')) {
            if(staticResourceUrl.indexOf('?') != -1){
                // The staticResourceUrl result can be messy, like this:
                // /resource/1635959525000/JF_Form_Templates?_=1635959844814&anonymousBody=String+staticResourceUrl+%3D...
                staticResourceUrl = staticResourceUrl.subString(0, staticResourceUrl.indexOf('?'));
            }
            // calculate the file base path by removing a leading '/' if one is defined
            String fileName = menuItem.staticFileName.startsWith('/') ? menuItem.staticFileName.substringAfter('/') : menuItem.staticFileName;
            // add the file path to the base path, including a '/' so it is always there
            resultURL = staticResourceUrl + '/' + fileName;
            // example resultURL
            // /resource/1635959525000/JF_Form_Templates/Job_Package_Checklist.docx
        }
        return resultURL;
    }

    private static Map<String, Map<String,Object>> createMenuLookupMap(List<MenuItem> menuList) {
        Map<String, Map<String,Object>> menuLookupMap = new Map<String, Map<String,Object>>();
        // Map<'feature', Map<'developer_api_name','Object'>
        // Example
        // Map<'listView', Map<'All_Aging_Notifications','ListView:{resultObj}'>
        menuLookupMap.put('listView', new Map<String,Object>());
        return menuLookupMap;
    }

    public class MenuItem
    {
        public String linkUrl; // being blank after all calculations will be marked in 'Red' with the 'urlMissing' css class, use '#' for a link that doesn't go anywhere but is valid
        public String linkText;

        public String listView; // string, DeveloperName of the listView used to build the final linkUrl
        public String objectType; // optional, if listView DeveloperName name is not unique the SobjectType here can be used to limit results

        public String staticFileName; // string, of file name inside the StaticResource zip
        public String staticResourceName; // string, name of staticResource metadata item name

        public String highlight; // string true/false for if the buttons will be highlighted in a large size
        public String style; // example css style classes "button highlight" calculated based on values or errors
        public String target; // how links in HTML will open, null/blank/_self is default link behavior, "_blank" or "true" will force a new window
        public List<MenuItem> nestedLinks; // same data type is nested but we still only expect one level of nesting in the UI, avoiding extra types
    }
}