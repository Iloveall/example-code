(function () {
    'use strict';

    angular
        .module('app.components')
        .component('dashboardExpectedParcel', {
            templateUrl: 'app/components/dashboard-expected-parcel/dashboard-expected-parcel.html',
            controller: 'DashboardExpectedParcelController',
            controllerAs: 'vm',
            bindings: {}
        });
})();
