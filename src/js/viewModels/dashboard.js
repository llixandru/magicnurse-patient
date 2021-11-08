/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils', 'ojs/ojcontext', "ojs/ojarraydataprovider", "ojs/ojlistview", "ojs/ojavatar", "ojs/ojlistitemlayout"],
    function(ko, app, moduleUtils, accUtils, Context, ArrayListDataProvider) {

        function DashboardViewModel() {
            var self = this;

            // Wait until header show up to resolve
            var resolve = Context.getPageContext().getBusyContext().addBusyState({ description: "wait for header" });
            // Header Config
            self.headerConfig = ko.observable({ 'view': [], 'viewModel': null });
            moduleUtils.createView({ 'viewPath': 'views/header.html' }).then(function(view) {
                self.headerConfig({ 'view': view, 'viewModel': app.getHeaderModel() })
                resolve();
            })

            // Below are a set of the ViewModel methods invoked by the oj-module component.
            // Please reference the oj-module jsDoc for additional information.

            /**
             * Optional ViewModel method invoked after the View is inserted into the
             * document DOM.  The application can put logic that requires the DOM being
             * attached here.
             * This method might be called multiple times - after the View is created
             * and inserted into the DOM and after the View is reconnected
             * after being disconnected.
             */
            self.connected = function() {
                accUtils.announce('Dashboard page loaded.', 'assertive');
                document.title = "Dashboard";
                // Implement further logic if needed
                getPrescriptions = async() => {
                    let requestOptions = {
                        method: 'GET',
                        redirect: 'follow'
                    };

                    const response = await fetch("https://ml6qk3ro6t3gvrvdbsgwt6iivq.apigateway.eu-frankfurt-1.oci.customer-oci.com/magicnurse/prescriptions", requestOptions)
                    return response.text()
                }

                this.medicineData = new Array()
                this.dataProviderMedicine = ko.observable()

                getPrescriptions().then(result => {
                    result = JSON.parse(result)
                    result = result.items
                    let i = 1
                    result.forEach(element => {
                        this.medicineData.push({
                            id: 1,
                            name: element.medicine_name,
                            title: element.diagnosis,
                            schedule: element.schedule,
                            image: "../../css/images/capsule-2.png"
                        })
                        i = i + 1
                    })
                    self.dataProviderMedicine(new ArrayListDataProvider(this.medicineData, {
                        keyAttributes: "id",
                    }))
                })


                this.datatomorrow = [{
                        id: 1,
                        name: "Test 1",
                        title: "Schedule: 15/11/2021",
                        image: "../../css/images/test-tube-4.png"
                    },
                    {
                        id: 2,
                        name: "Test 2",
                        title: "Schedule: January 2022",
                        image: "../../css/images/blood-bank-3.png"
                    }
                ];
                this.dataProvidertomorrow = new ArrayListDataProvider(this.datatomorrow, {
                    keyAttributes: "id",
                });
            };

            /**
             * Optional ViewModel method invoked after the View is disconnected from the DOM.
             */
            self.disconnected = function() {
                // Implement if needed
            };

            /**
             * Optional ViewModel method invoked after transition to the new View is complete.
             * That includes any possible animation between the old and the new View.
             */
            self.transitionCompleted = function() {
                // Implement if needed
            };
        }

        /*
         * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
         * return a constructor for the ViewModel so that the ViewModel is constructed
         * each time the view is displayed.
         */
        return DashboardViewModel;
    }
);