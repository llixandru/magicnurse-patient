/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your profile ViewModel code goes here
 */
define(['knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils', 'ojs/ojcontext', "ojs/ojinputtext", "ojs/ojlabel", "ojs/ojbutton", "ojs/ojformlayout", "ojs/ojbutton"],
    function(ko, app, moduleUtils, accUtils, Context) {

        function ProfileViewModel() {
            var self = this;

            // Wait until header show up to resolve
            var resolve = Context.getPageContext().getBusyContext().addBusyState({ description: "wait for header" });
            // Header Config
            self.headerConfig = ko.observable({ 'view': [], 'viewModel': null });
            moduleUtils.createView({ 'viewPath': 'views/header.html' }).then(function(view) {
                self.headerConfig({ 'view': view, 'viewModel': app.getHeaderModel() });
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
                accUtils.announce('Profile page loaded.', 'assertive');
                document.title = "Profile";
                self.ssn = ko.observable()
                self.firstName = ko.observable()
                self.lastName = ko.observable()
                self.address = ko.observable()
                self.age = ko.observable()
                self.careType = ko.observable()
                self.emergencyContactNo = ko.observable()
                self.emergencyContactName = ko.observable()
                self.emergencyContactRel = ko.observable()

                // Implement further logic if needed
                getPatientInfo = async() => {
                    let requestOptions = {
                        method: 'GET',
                        redirect: 'follow'
                    }
                    const response = await fetch("https://ml6qk3ro6t3gvrvdbsgwt6iivq.apigateway.eu-frankfurt-1.oci.customer-oci.com/magicnurse/patientinfo", requestOptions)
                        // waits until the request completes
                    return response.text()
                }
                refreshData = () => {
                    getPatientInfo().then(result => {
                        result = JSON.parse(result)
                        self.ssn(result.items[0].social_security_number)
                        self.firstName(result.items[0].first_name)
                        self.lastName(result.items[0].last_name)
                        self.address(result.items[0].address)
                        self.age(result.items[0].age)
                        self.careType(result.items[0].care_type)
                        self.emergencyContactNo(result.items[0].emergency_contact_number)
                        self.emergencyContactName(result.items[0].emergency_contact_name)
                        self.emergencyContactRel(result.items[0].emergency_contact_relationship)
                    })
                }
                self.update = async() => {
                    var myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    var raw = JSON.stringify({
                        "social_security_number": self.ssn(),
                        "first_name": self.firstName(),
                        "last_name": self.lastName(),
                        "address": self.address(),
                        "age": self.age(),
                        "care_type": self.careType(),
                        "phone_number": "555-23124",
                        "nurse_name": "James Marshal",
                        "nurse_contact": "555-00432",
                        "emergency_contact_name": self.emergencyContactName(),
                        "emergency_contact_number": self.emergencyContactNo(),
                        "emergency_contact_relationship": self.emergencyContactRel()
                    });

                    var requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        body: raw
                    };

                    const response = await fetch("https://ml6qk3ro6t3gvrvdbsgwt6iivq.apigateway.eu-frankfurt-1.oci.customer-oci.com/magicnurse/patientinfo", requestOptions)
                    refreshData()
                    return response
                }

                refreshData()
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
        return ProfileViewModel;
    }
);