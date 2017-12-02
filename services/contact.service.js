(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('contact', contact);

    contact.$inject = ['CONFIG', '$resource', '$rootScope', '$http', 'Upload', 'FileSaver'];

    function contact(CONFIG, $resource, $rootScope, $http, Upload, FileSaver) {
        var API_URL = CONFIG.APIHost + '/contact';

        var resource = $resource(API_URL,
            {},
            {
                get: {
                    method: 'GET',
                    url: API_URL
                },
                getById: {
                    method: 'GET',
                    url: API_URL + '/:id'
                },
                create: {
                    method: 'POST',
                    url: API_URL
                },
                update: {
                    method: 'PUT',
                    url: API_URL + '/:id',
                    params: {
                        id: '@id'
                    }
                },
                destroy: {
                    method: 'POST',
                    url: API_URL + '/delete'
                },
                getArchive: {
                    method: 'GET',
                    url: API_URL + '/archive'
                },
                restoreArchive: {
                    method: 'POST',
                    url: API_URL + '/archive/restore'
                },
                getByGroup: {
                    method: 'GET',
                    url: API_URL + '/contacts-by-group'
                },
                exportContacts: {
                    method: 'GET',
                    url: API_URL + '/export'
                },
                find: {
                    method: 'POST',
                    url: API_URL + '/find'
                }
            }
        );

        function get(params, data) {
            return resource.get(params, data).$promise;
        }

        function getById(params, data) {
            return resource.getById(params, data).$promise
                .then(function (response) {

                });
        }

        function create(params, data) {
            return resource.create(params, data).$promise
                .then(function (response) {
                    $rootScope.$broadcast('contact:create:success');
                });
        }

        function update(params, data) {
            return resource.update(params, data).$promise
                .then(function (response) {
                    $rootScope.$broadcast('contact:update:success');
                });
        }

        function destroy(params, data) {
            return resource.destroy(params, data).$promise
                .then(function (response) {
                    $rootScope.$broadcast('contact:destroy:success');
                });
        }

        function getArchive(params, data) {
            return resource.getArchive(params, data).$promise;
        }

        function restoreArchive(params, data) {
            return resource.restoreArchive(params, data).$promise
                .then(function (response) {
                    $rootScope.$broadcast('contact:sync');
                    return response;
                });
        }

        function getByGroup(params, data) {
            return resource.getByGroup(params, data).$promise;
        }

        function find(params, data) {
            return resource.find(params, data).$promise;
        }

        function uploadContacts(params, data) {
            var upload = Upload.upload({
                url: API_URL + '/import',
                data: data
            });

            return upload.then(function (response) {
                $rootScope.$broadcast('contact:create:success');
                return response;
            });
        }

        function exportContacts() {
            return $http.get(API_URL + '/export').then(function (response) {
                console.log('FileSaver', response.data);
                var data = new Blob([response.data], {type: 'text/x-vcard'});
                FileSaver.saveAs(data, 'contacts.vcf');
            });
        }

        function sync() {
            $rootScope.$broadcast('contact:sync');
        }

        return {
            get: get,
            getById: getById,
            create: create,
            update: update,
            destroy: destroy,
            getArchive: getArchive,
            restoreArchive: restoreArchive,
            getByGroup: getByGroup,
            uploadContacts: uploadContacts,
            exportContacts: exportContacts,
            sync: sync,
            find: find
        }
    }

})();