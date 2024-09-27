sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/viz/ui5/data/Dataset",
    "sap/viz/ui5/controls/common/feeds/FeedItem",
    "sap/suite/ui/commons/TimelineItem"
], function (Controller, History, MessageToast, JSONModel, Dataset, FeedItem, TimelineItem) {
    "use strict";

    return Controller.extend("sap.ui.core.sample.RoutingFullscreen.routingApp.controller.View2", {
        onInit: function () {
          
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("page2").attachPatternMatched(this._onObjectMatched, this);
        },
        _clearTimeline: function () {
    var oTimeline = this.getView().byId("actionTimeline");
    oTimeline.removeAllContent(); 
},

        _addTimelineEntry: function (sTitle, sText) {
           
            var oTimeline = this.getView().byId("actionTimeline");

            
            var oTimelineItem = new TimelineItem({
                title: sTitle,
                text: sText,
                dateTime: new Date().toISOString() // Date actuelle pour l'entrée
            });

            
            oTimeline.addContent(oTimelineItem);
        },

        _onObjectMatched: function () {
    var oTempDataModel = this.getOwnerComponent().getModel("TempDataModel");

    
    var sPostName = oTempDataModel.getProperty("/name");
    var sCost = oTempDataModel.getProperty("/cost") + " €";
    var sStore = oTempDataModel.getProperty("/store");
    var sDate = oTempDataModel.getProperty("/date");

    
    this.getView().byId("postNameText").setText(sPostName);
    this.getView().byId("costText").setText(sCost);
    this.getView().byId("storeText").setText(sStore);
    this.getView().byId("dateText").setText(sDate);

    
    this._clearTimeline();


    var sTitle = "Création de position";
    var sText = `La position ${sPostName} a été créé avec un coût de ${sCost} dans le magasin ${sStore}.`;
    this._addTimelineEntry(sTitle, sText);

   
    this._createChart();
},

      _createChart: function () {
    var oVizFrame = this.getView().byId("vizFrame");

    
    if (!oVizFrame) {
        MessageToast.show("Erreur : VizFrame introuvable.");
        return; 
    }

    
    var sCostText = this.getView().byId("costText").getText();

  
    var sCost = parseFloat(sCostText.replace(" €", "").replace(/\s/g, ''));

 
    if (isNaN(sCost)) {
        MessageToast.show("Erreur : le coût n'est pas défini ou invalide.");
        return; 
    }

 
    oVizFrame.setModel(null); 
    oVizFrame.setDataset(null); 
    oVizFrame.removeAllFeeds(); 

  
    var aData = {
        data: [
            { year: "1ère année", cost: sCost * 1 },
            { year: "2ème année", cost: sCost * 2 },
            { year: "3ème année", cost: sCost * 3 },
            { year: "4ème année", cost: sCost * 4 },
            { year: "5ème année", cost: sCost * 5 }
        ]
    };

    
    var oModel = new sap.ui.model.json.JSONModel(aData);
    oVizFrame.setModel(oModel);

    
    var oDataset = new sap.viz.ui5.data.FlattenedDataset({
        dimensions: [{
            name: 'Année',
            value: "{year}"
        }],
        measures: [{
            name: 'Coût',
            value: '{cost}'
        }],
        data: {
            path: "/data"
        }
    });
    oVizFrame.setDataset(oDataset);

   
    oVizFrame.setVizType("column");

    
    var oFeedValue = new sap.viz.ui5.controls.common.feeds.FeedItem({
        uid: "valueAxis",
        type: "Measure",
        values: ["Coût"]
    });
    var oFeedCategory = new sap.viz.ui5.controls.common.feeds.FeedItem({
        uid: "categoryAxis",
        type: "Dimension",
        values: ["Année"]
    });

    
    oVizFrame.addFeed(oFeedValue);
    oVizFrame.addFeed(oFeedCategory);
}
,

        onBack: function () {
            
            var sPreviousHash = History.getInstance().getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1); 
            } else {
                this.getOwnerComponent().getRouter().navTo("page1", null, true); 
            }
        },

        onConfirmPost: function () {
            
            var oTempDataModel = this.getOwnerComponent().getModel("TempDataModel");
            if (!oTempDataModel) {
                MessageToast.show("Erreur : le modèle temporaire n'est pas défini.");
                return;
            }
            var sPostName = oTempDataModel.getProperty("/name");

            
            var oView1Model = this.getOwnerComponent().getModel();
            if (!oView1Model) {
                MessageToast.show("Erreur : le modèle principal n'est pas défini.");
                return;
            }

            
            var aPosts = oView1Model.getProperty("/posts");
            for (var i = 0; i < aPosts.length; i++) {
                if (aPosts[i].name === sPostName) {
                    aPosts[i].status = "Confirmé";
                    break;
                }
            }

            
            oView1Model.setProperty("/posts", aPosts);

            
            MessageToast.show("Poste confirmé avec succès !");
        }
    });
});