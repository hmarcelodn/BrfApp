brfPhoneGapApp.controller('pdvController', function($scope, $route, $location, $routeParams, customerService){
	
	customerService.getCustomerTypes().then(function(customerTypes){
		$scope.customerTypes = customerTypes;
		$scope.selectedCustomerType = $scope.customerTypes[0];
	});

	$scope.companyName;
	$scope.identifier;
	$scope.address;

	$scope.addPdv = function(event){	
		customerService.setCustomer(0, $scope.companyName, $scope.identifier, $scope.address, $scope.selectedCustomerType.id).then(function(){
			$location.path('Channel/' + $routeParams.channelId + '/Pdv/0/Seller');
		});
	};
});