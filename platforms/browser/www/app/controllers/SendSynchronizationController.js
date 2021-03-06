(function() {
    'use strict';

    angular
        .module('brfPhoneGapApp')
        .controller('SendSynchronizationController', SendSynchronizationController);

    SendSynchronizationController.$inject = ['$scope', 'Survey', '$location', '$q', 'Question', 'Customer', 'Database', '$rootScope', '$routeParams'];

    function SendSynchronizationController($scope, Survey, $location, $q, Question, Customer, Database, $rootScope, $routeParams) {
        var vm = this;

        $scope.syncSurveys = 0;
        $scope.syncNoBrf = 0;
        $scope.syncQuestions = 0;

        $scope.leftCoaching = $rootScope.leftCoaching;
        console.log("eeee");
        console.log($scope.leftCoaching);
        console.log("AAA");
        activate();

        function activate() {

            Survey.getClosedSurveys().then(function(surveys) {

                    $scope.syncSurveys = 1;

                    var deferred = $q.defer();
                    var promises = [];

                    angular.forEach(surveys, function(value, key) {

                        Customer.getPdvById(value.pdvId).then(function(customer) {
                            promises.push(
                                Survey.informSurvey(
                                    JSON.stringify({
                                        "data": {
                                            "main": {
                                                "id_user": value.userId,
                                                "survey": value.survey,
                                                "token": "560a100abad225d5afdf4fc6e5334917"
                                            },
                                            "config": {
                                                "id_channel": value.channelId,
                                                "id_type_pdv": value.pdvId,
                                                "id_seller": value.sellerId
                                            },
                                            "details": {
                                                "name": customer.companyName,
                                                "address": customer.address,
                                                "notes": "Test Notes"
                                            }
                                        }
                                    })
                                ).then(function() {
                                    deferred.resolve();
                                })
                                .catch(function(error) {
                                    deferred.reject(error);
                                })
                            );
                        });

                        $q.all(promises).then(function() {
                            $scope.syncSurveys = 2;
                            deferred.resolve();
                        })
                    });

                    return deferred.promise;
                })
                .then(function() {

                    $scope.syncNoBrf = 1;
                    var deferred = $q.defer();


                    Survey.getClosedSurveysNoBrf().then(function(noBrfSurveys) {

                        if (noBrfSurveys.length > 0) {
                            var promises = [];

                            angular.forEach(noBrfSurveys, function(value, key) {
                                promises.push(
                                    Survey.informNoBrfSurvey(
                                        JSON.stringify({
                                            "data": {
                                                "token": "560a100abad225d5afdf4fc6e5334917",
                                                "id_user": value.userId,
                                                "survey": value.survey
                                            }
                                        })
                                    )
                                )
                            });

                            $q.all(promises).then(function() {
                                $scope.syncNoBrf = 2;
                                deferred.resolve();
                            });
                        } else {
                            $scope.syncNoBrf = 2;
                            deferred.resolve();
                        }

                    });

                    return deferred.promise;
                })
                .then(function() {

                    $scope.syncQuestions = 1;

                    var deferred = $q.defer();
                    var promises = new Array();

                    Survey.getClosedSurveys().then(function(surveys) {
                        console.log ("surveys");
                        console.log(surveys);

                        angular.forEach(surveys, function(value, key) {
                            Question.getQuestionsBySurveyId(value.id).then(function(questions) {

                                //console.log(questions);

                                promises.push(Survey.informSurveyQuestions(
                                    JSON.stringify({
                                        "data": {
                                            "main": {
                                                "survey": value.survey,
                                                "token": "560a100abad225d5afdf4fc6e5334917"
                                            },
                                            "results": {
                                                "questions": questions
                                            }
                                        }
                                    })
                                ));
                            });
                            console.log ("value.id");
                            console.log (value.id);
                            Survey.deleteSurveyNoBrfResults(value.id);
                            Survey.deleteSurveyObservationResults(value.id);
                            Survey.deleteSurveyQuestionsResults(value.id);
                            Survey.deleteSurvey(value.id);
                        });
                    });
                    console.log("EXIT");
                    $q.all(promises).then(function() {
                        $scope.syncQuestions = 2;
                        deferred.resolve();
                    });

                    return deferred.promise;
                })
                /*.then(function(){

                  var deferred = $q.defer();

                  Database.dropAll().then(function(){
                    deferred.resolve();
                  });

                  return deferred.promise;
                })*/
                .then(function() {
                    //$rootScope.$emit('sendSyncFinished');
                    //$location.path('/SyncOk/2');
                    // Clean  Up surveys
                    
                })
                .catch(function(error) {
                    console.log(error);
                    $location.path('/SyncNok');
                });
        }
    }
})();