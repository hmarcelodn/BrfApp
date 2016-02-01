brfPhoneGapApp.controller('executionController', function($scope, $route, questionService, moduleService, surveyService){
	
	moduleService.getModuleByName('Ejecución PDV').then(function(module){
		surveyService.getPendingSurvey().then(function(pendingSurvey){
			questionService.getQuestions(module, pendingSurvey).then(function(questions){
				$scope.questions = questions;
			});
		});
	});	

});