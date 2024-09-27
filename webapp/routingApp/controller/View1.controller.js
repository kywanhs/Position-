sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Select",
    "sap/m/Label",
    "sap/m/DatePicker",
    "sap/ui/core/Item",
    "sap/m/VBox"
], function (Controller, MessageToast, Dialog, Button, Select, Label, DatePicker, Item, VBox) {
    "use strict";

    return Controller.extend("sap.ui.core.sample.RoutingFullscreen.routingApp.controller.View1", {

        _postData: [], 

        onInit: function () {
            
            

            var oModel = new sap.ui.model.json.JSONModel({
                posts: this._postData
            });
            this.getView().setModel(oModel);

            var oTempModel = new sap.ui.model.json.JSONModel({});
            this.getOwnerComponent().setModel(oTempModel, "TempDataModel");
        },
        
        

        onOpenCreatePostDialog: function () {
            if (!this.oCreatePostDialog) {
                this.oCreatePostDialog = new Dialog({
                    title: "Créer une position",
                    contentWidth: "400px",
                    contentHeight: "300px",
                    resizable: true,
                    content: new VBox({
                        items: [
                            new Label({ text: "Nom de position" }),
                            new Select({
                                id: "createPostNameSelect",
                                width: "100%",
                                items: [
                                    new Item({ key: "post1", text: "Directeur" }),
                                    new Item({ key: "post2", text: "Vendeur" }),
                                    new Item({ key: "post3", text: "Responsable magasin" })
                                ]
                            }),
                            new Label({ text: "Coût annuel de position" }),
                            new Select({
                                id: "createCostSelect",
                                width: "100%",
                                items: [
                                    new Item({ key: "50000", text: "50 000 €" }),
                                    new Item({ key: "60000", text: "60 000 €" }),
                                    new Item({ key: "70000", text: "70 000 €" })
                                ]
                            }),
                            new Label({ text: "Magasin" }),
                            new Select({
                                id: "createStoreSelect",
                                width: "100%",
                                items: [
                                    new Item({ key: "paris", text: "Paris" }),
                                    new Item({ key: "reims", text: "Reims" }),
                                    new Item({ key: "lille", text: "Lille" }),
                                    new Item({ key: "lyon", text: "Lyon" })
                                ]
                            }),
                            new Label({ text: "Date de création" }),
                            new DatePicker({ id: "createCreationDate", width: "100%" })
                        ]
                    }),
                    beginButton: new Button({
                        text: "Créer",
                        type: "Emphasized",
                        press: this.onCreatePost.bind(this)
                    }),
                    endButton: new Button({
                        text: "Annuler",
                        press: function () {
                            this.oCreatePostDialog.close();
                        }.bind(this)
                    })
                });

                this.getView().addDependent(this.oCreatePostDialog);
            }

            this.oCreatePostDialog.open();
        },

        onCreatePost: function () {
            var aDialogContent = this.oCreatePostDialog.getContent()[0].getItems();
            var oPostNameSelect = aDialogContent[1];
            var oCostSelect = aDialogContent[3];
            var oStoreSelect = aDialogContent[5];
            var oCreationDate = aDialogContent[7];

            if (!oPostNameSelect || !oCostSelect || !oStoreSelect || !oCreationDate) {
                MessageToast.show("Erreur dans la récupération des éléments du formulaire.");
                return;
            }

            var sPostName = oPostNameSelect.getSelectedItem();
            var sCost = oCostSelect.getSelectedItem();
            var sStore = oStoreSelect.getSelectedItem();
            var sDate = oCreationDate.getDateValue();

            if (!sPostName || !sCost || !sStore || !sDate) {
                MessageToast.show("Veuillez remplir tous les champs.");
                return;
            }

            var oPostData = {
                name: sPostName.getText(),
                cost: parseInt(sCost.getKey(), 10),
                store: sStore.getText(),
                date: sDate.toLocaleDateString(),
                status: "En attente" // Nouveau champ pour le statut
            };

            if (this.oCreatePostDialog.iEditIndex !== undefined) {
                this._postData[this.oCreatePostDialog.iEditIndex] = oPostData;
                this.oCreatePostDialog.iEditIndex = undefined; // Réinitialiser l'index d'édition
                MessageToast.show("Position modifié avec succès !");
            } else {
                this._postData.push(oPostData);
                MessageToast.show("Position créé avec succès !");
            }

            var oModel = this.getView().getModel();
            oModel.setProperty("/posts", this._postData);

            this.oCreatePostDialog.close();
            this.oCreatePostDialog.getBeginButton().setText("Créer");
        },

        onDeletePost: function (oEvent) {
            var oSource = oEvent.getSource();
            var oContext = oSource.getBindingContext();
            var sPath = oContext.getPath();
            var iIndex = parseInt(sPath.split("/").pop());

            this._postData.splice(iIndex, 1);

            var oModel = this.getView().getModel();
            oModel.setProperty("/posts", this._postData);

            MessageToast.show("Position supprimé avec succès !");
        },

        onEditPost: function (oEvent) {
            var oSource = oEvent.getSource();
            var oContext = oSource.getBindingContext();
            var sPath = oContext.getPath();
            var iIndex = parseInt(sPath.split("/").pop());
            var oSelectedPost = this._postData[iIndex];

            if (!this.oCreatePostDialog) {
                this.onOpenCreatePostDialog();
            }

            var aDialogContent = this.oCreatePostDialog.getContent()[0].getItems();
            var oPostNameSelect = aDialogContent[1];
            var oCostSelect = aDialogContent[3];
            var oStoreSelect = aDialogContent[5];
            var oCreationDate = aDialogContent[7];

            oPostNameSelect.setSelectedKey(oSelectedPost.name);
            oCostSelect.setSelectedKey(oSelectedPost.cost.toString());
            oStoreSelect.setSelectedKey(oSelectedPost.store);
            oCreationDate.setDateValue(new Date(oSelectedPost.date));

            this.oCreatePostDialog.getBeginButton().setText("Sauvegarder");
            this.oCreatePostDialog.iEditIndex = iIndex;

            this.oCreatePostDialog.open();
        },

        onConfirmPost: function (oEvent) {
            var oSource = oEvent.getSource();
            var oContext = oSource.getBindingContext();
            var sPath = oContext.getPath();
            var iIndex = parseInt(sPath.split("/").pop());

           
            this._postData[iIndex].status = "Confirmé"; 

            var oModel = this.getView().getModel();
            oModel.setProperty("/posts", this._postData);

            MessageToast.show("Position confirmé avec succès !");
        },

        onToPage2: function (oEvent) {
            var oSource = oEvent.getSource();
            var oContext = oSource.getBindingContext();
            var oSelectedPost = oContext.getObject();

           
            var oTempDataModel = this.getOwnerComponent().getModel("TempDataModel");
            oTempDataModel.setProperty("/name", oSelectedPost.name);
            oTempDataModel.setProperty("/cost", oSelectedPost.cost);
            oTempDataModel.setProperty("/store", oSelectedPost.store);
            oTempDataModel.setProperty("/date", oSelectedPost.date);

            
            this.getOwnerComponent().getRouter().navTo("page2");
        }
    });
});