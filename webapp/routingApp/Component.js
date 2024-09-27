sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel"], function (UIComponent, JSONModel) {
    "use strict";

    return UIComponent.extend("sap.ui.core.sample.RoutingFullscreen.routingApp.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            // Appeler la fonction init du parent
            UIComponent.prototype.init.apply(this, arguments);

            // Créer un modèle principal pour les postes et le définir
            var oPostData = {
                posts: [] // Initialiser avec un tableau vide
            };
            var oMainModel = new JSONModel(oPostData);
            this.setModel(oMainModel); // Définir le modèle principal

            // Créer un modèle temporaire et le définir
            var oTempDataModel = new JSONModel();
            this.setModel(oTempDataModel, "TempDataModel");

            // Initialiser le routeur
            this.getRouter().initialize();
        }
    });
});
