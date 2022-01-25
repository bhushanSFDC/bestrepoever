import { LightningElement, wire, api } from "lwc";

import menuData from "@salesforce/apex/FM_MenuController.menuData";
// import FMHomeMenu from "./FMHomeMenu.js";

export default class FM_Menu extends LightningElement {
  @api menuMdtName = "FM_HomeMenu";
  /** @type {MenuJSON} */
  menuItems = [];
  /** @type {ConfigJSON} */
  configData = [];
  componentIsReady = false;
  menuBGColor = "#ffcc05";
  menuTextColor = "#c55a11";
  error;

  needsRenderUpdate = true;

  /**
   * @typedef ConfigJSON
   * @prop {string} MenuBGColorHex The hex code for Background Color, ie '#ffcc05'
   * @prop {string} MenuTextColorHex The hex code for Text Color, ie '#c55a11'
   *
   * @typedef MenuJSON
   * @prop {string} id "1"
   * @prop {string} linkText "Aging Notifs"
   * @prop {string} linkUrl ""
   * @prop {string} listView "All_Aging_Notifications"
   * @prop {string} staticFileName "Job_Package_Checklist.docx"
   * @prop {string} staticResourceName "FM_Form_Templates"
   * @prop {string} objectType "FM_Notification__c"
   * @prop {string} highlight "true"
   * @prop {string} style "button highlight" "calculated based on values or errors"
   * @prop {string} nestedLinks "[]"
   */

  renderedCallback() {
    if (this.configData) {
      const menuRoot = this.template.querySelector(".fm-menu-root");
      if (this.configData?.MenuBGColorHex) {
        menuRoot.style?.setProperty(
          "--MenuBGColorHex",
          this.configData?.MenuBGColorHex
        );
      }
      if (this.configData?.MenuTextColorHex) {
        menuRoot.style?.setProperty(
          "--MenuTextColorHex",
          this.configData?.MenuTextColorHex
        );
      }
      if (this.configData?.CardBorder) {
        menuRoot.style?.setProperty(
          "--CardBorder",
          this.configData?.CardBorder
        );
      }
      if (this.configData?.CardBG) {
        menuRoot.style?.setProperty("--CardBG", this.configData?.CardBG);
      }
    }
  }

  @wire(menuData, { menuName: "$menuMdtName" })
  wiredMenuData({ error, data }) {
    if (data) {
      if (data?.MenuJSON__c) {
        this.menuItems = this.hydrateMenuData(data.MenuJSON__c);
      }
      if (data?.ConfigJSON__c) {
        this.configData = this.hydrateConfigData(data.ConfigJSON__c);
      }
      console.log("menuMdtName: " + this.menuMdtName);
      console.dir(this.menuItems);

      this.error = undefined;
      this.componentIsReady = true;
    } else if (error) {
      this.error = error;
      this.menuItems = undefined;
    }
  }

  hydrateMenuData(incomingData) {
    let localData;
    try {
      localData = JSON.parse(incomingData);
    } catch (e) {
      console.error("Error parsing FM Menu Data as JSON");
      return "";
    }
    localData = cleanMenuData(localData);

    return localData;
  }

  hydrateConfigData(incomingData) {
    let localData;
    try {
      localData = JSON.parse(incomingData);
      this.needsRenderUpdate = true;
    } catch (e) {
      console.error("Error parsing FM Config Data as JSON");
      return "";
    }

    return localData;
  }
}

function cleanMenuData(menuList) {
  for (let menu of menuList) {
    if (menu.nestedLinks) {
      if (menu.nestedLinks.length === 0) {
        delete menu.nestedLinks; // delete the empty nestedLinks keys because the LWC templating doesn't like them
      } else {
        menu.nestedLinks = cleanMenuData(menu.nestedLinks); // recursively process further nested menu nodes
      }
    }
  }
  return menuList;
}