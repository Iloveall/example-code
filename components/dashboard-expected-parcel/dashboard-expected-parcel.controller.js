(function () {
    'use strict';

    angular
        .module('app.components')
        .controller('DashboardExpectedParcelController', DashboardExpectedParcelController);

    DashboardExpectedParcelController.$inject = ['$scope', '$state', 'warehouse', 'order', 'payment'];

    /* @ngInject */
    function DashboardExpectedParcelController($scope, $state, warehouse, order, payment) {
        var vm = this;

        vm.orders = {
            isFirstLoad: true,
            isLoading: false,
            params: {
                size: 10,
                sort: 'createdAt,desc',
                state: 0
            },
            data: [],
            selected: []
        };

        vm.insure = {
            isFirstLoad: true,
            isLoading: false,
            params: {},
            model: {}
        };

        $scope.$watch('vm.selected', function (data, oldData) {
            if (data) {
                getInsureById(data.id);
                warehouse.setSelectedWarehouse(data.warehouse);
            }
        }, true);

        vm.change = change;
        vm.setInsureById = setInsureById;

        ////

        activate();

        function activate() {
            // vm.orders.params.warehouseId = warehouse.getSelectedWarehouse().id;
            getList();
        }

        function getList() {
            // if (!vm.orders.params.warehouseId || !vm.orders.params.sort) return;
            vm.orders.isLoading = true;
            order.get(vm.orders.params)
                .then(function (response) {
                    vm.orders.isFirstLoad = false;
                    vm.orders.isLoading = false;

                    if (response._embedded) {
                        vm.orders.data = response._embedded['orders'];
                        vm.orders.links = response._links;
                        vm.orders.page = response.page;
                        return;
                    }

                    vm.orders.data = [];
                }, function () {
                    vm.orders.isFirstLoad = false;
                    vm.orders.isLoading = false;
                });
        }

        function getInsureById(id) {
            order.getInsureById({id: id})
                .then(function (response) {
                    console.log('getInsureById', response);
                    vm.insure.model = response;
                }, function () {
                    vm.insure.model = null;
                });
        }

        function setInsureById(id) {
            if (vm.insure.model) {
                getServiceForms(vm.insure.model.id);
                return;
            }

            order.setInsureById({id: id})
                .then(function (response) {
                    console.log('setInsureById', response);
                    vm.insure.model = response;
                    getServiceForms(vm.insure.model.id);
                });
        }

        function getServiceForms(ids) {
            var arr = [];
            if (ids.length) {
                arr = ids.split(',');
            } else {
                arr.push(ids);
            }

            vm.isLoading = true;
            payment.getForms({}, {
                'servicesSelection': {ids: arr},
                'warehouse': {id: warehouse.getSelectedWarehouseId()}
            }).then(function (response) {
                vm.isLoading = false;
                vm.form = response;
                goPaymentPage(response.token);
            });
        }

        function goPaymentPage(token) {
            $state.go('cabinet.payment.token', {token: token});
        }

        function change(item) {
            if (item !== vm.selected) {
                vm.selected = item;
                return;
            }
            vm.selected = undefined;
        }
    }
})();
