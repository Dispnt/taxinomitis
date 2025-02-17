(function () {

    angular
        .module('app')
        .controller('DatasetsController', DatasetsController);

        DatasetsController.$inject = [
            'authService',
            'projectsService',
            'datasetsService',
            'loggerService',
            'trainingService',
            'storageService',
            'browserStorageService',
            '$state', '$translate', '$mdDialog', '$q'
        ];


    function DatasetsController(authService, projectsService, datasetsService, loggerService, trainingService, storageService, browserStorageService, $state, $translate, $mdDialog, $q) {

        var vm = this;
        vm.authService = authService;

        vm.creating = false;
        vm.loading = true;

        var alertId = 1;
        vm.errors = [];
        vm.warnings = [];
        vm.dismissAlert = function (type, errIdx) {
            vm[type].splice(errIdx, 1);
        };

        let localStorageSupported = false;

        function displayAlert(type, status, errObj) {
            if (!errObj) {
                errObj = {};
            }

            vm[type].push({
                alertid : alertId++,
                message : errObj.message || errObj.error || 'Unknown error',
                status : status
            });
        }

        vm.datasets = [];

        authService.getProfileDeferred()
            .then(function (profile) {
                vm.profile = profile;

                $translate([
                    'DATASETS.DATA.TITANIC.TITLE', 'DATASETS.DATA.TITANIC.SUMMARY', 'DATASETS.DATA.TITANIC.DESCRIPTION', 'DATASETS.DATA.TITANIC.DETAILS',
                    'DATASETS.DATA.UKNEWSPAPERS.TITLE', 'DATASETS.DATA.UKNEWSPAPERS.SUMMARY', 'DATASETS.DATA.UKNEWSPAPERS.DESCRIPTION', 'DATASETS.DATA.UKNEWSPAPERS.DETAILS',
                    'DATASETS.DATA.CATSANDDOGS.TITLE', 'DATASETS.DATA.CATSANDDOGS.SUMMARY', 'DATASETS.DATA.CATSANDDOGS.DESCRIPTION', 'DATASETS.DATA.CATSANDDOGS.DETAILS',
                    'DATASETS.DATA.ORGANICWASTE.TITLE', 'DATASETS.DATA.ORGANICWASTE.SUMMARY', 'DATASETS.DATA.ORGANICWASTE.DESCRIPTION', 'DATASETS.DATA.ORGANICWASTE.DETAILS',
                    'DATASETS.DATA.PHISHING.TITLE', 'DATASETS.DATA.PHISHING.SUMMARY', 'DATASETS.DATA.PHISHING.DESCRIPTION', 'DATASETS.DATA.PHISHING.DETAILS',
                    'WORKSHEETS.NOUGHTSANDCROSSES.TITLE', 'DATASETS.DATA.NOUGHTSANDCROSSES.SUMMARY', 'DATASETS.DATA.NOUGHTSANDCROSSES.DESCRIPTION', 'DATASETS.DATA.NOUGHTSANDCROSSES.DETAILS',
                    'DATASETS.DATA.TOPTRUMPS.TITLE', 'DATASETS.DATA.TOPTRUMPS.SUMMARY', 'DATASETS.DATA.TOPTRUMPS.DESCRIPTION', 'DATASETS.DATA.TOPTRUMPS.DETAILS',
                    'DATASETS.DATA.SONGLYRICS.TITLE', 'DATASETS.DATA.SONGLYRICS.SUMMARY', 'DATASETS.DATA.SONGLYRICS.DESCRIPTION', 'DATASETS.DATA.SONGLYRICS.DETAILS',
                    'DATASETS.DATA.HANDGESTURES.TITLE', 'DATASETS.DATA.HANDGESTURES.SUMMARY', 'DATASETS.DATA.HANDGESTURES.DESCRIPTION', 'DATASETS.DATA.HANDGESTURES.DETAILS',
                    'DATASETS.DATA.POKEMONSTATS.TITLE', 'DATASETS.DATA.POKEMONSTATS.SUMMARY', 'DATASETS.DATA.POKEMONSTATS.DESCRIPTION', 'DATASETS.DATA.POKEMONSTATS.DETAILS',
                    'DATASETS.DATA.POKEMONIMAGES.TITLE', 'DATASETS.DATA.POKEMONIMAGES.SUMMARY', 'DATASETS.DATA.POKEMONIMAGES.DESCRIPTION', 'DATASETS.DATA.POKEMONIMAGES.DETAILS',
                    'DATASETS.DATA.ARGO.TITLE', 'DATASETS.DATA.ARGO.SUMMARY', 'DATASETS.DATA.ARGO.DESCRIPTION', 'DATASETS.DATA.ARGO.DETAILS',
                    'DATASETS.DATA.STARS.TITLE', 'DATASETS.DATA.STARS.SUMMARY', 'DATASETS.DATA.STARS.DESCRIPTION', 'DATASETS.DATA.STARS.DETAILS',
                    'DATASETS.DATA.FAKENEWS.ID', 'DATASETS.DATA.FAKENEWS.TITLE', 'DATASETS.DATA.FAKENEWS.SUMMARY', 'DATASETS.DATA.FAKENEWS.DESCRIPTION', 'DATASETS.DATA.FAKENEWS.DETAILS',
                    'DATASETS.DATA.FAKENEWS.ID', 'DATASETS.DATA.CAPTCHA.TITLE', 'DATASETS.DATA.CAPTCHA.SUMMARY', 'DATASETS.DATA.CAPTCHA.DESCRIPTION', 'DATASETS.DATA.CAPTCHA.DETAILS'
                ]).then(function (translations) {
                    vm.datasets = [
                        {
                            id: 'titanic',
                            title: translations['DATASETS.DATA.TITANIC.TITLE'],
                            summary: translations['DATASETS.DATA.TITANIC.SUMMARY'],
                            description: translations['DATASETS.DATA.TITANIC.DESCRIPTION'],
                            details: translations['DATASETS.DATA.TITANIC.DETAILS'],
                            type: 'numbers',
                            image: 'static/images/dataset-titanic.png'
                        },
                        {
                            id: 'uk-newspaper-headlines',
                            title: translations['DATASETS.DATA.UKNEWSPAPERS.TITLE'],
                            summary: translations['DATASETS.DATA.UKNEWSPAPERS.SUMMARY'],
                            description: translations['DATASETS.DATA.UKNEWSPAPERS.DESCRIPTION'],
                            details: translations['DATASETS.DATA.UKNEWSPAPERS.DETAILS'],
                            type: 'text',
                            image: 'static/images/dataset-ukheadlines.png'
                        },
                        {
                            id: 'cats-and-dogs',
                            title: translations['DATASETS.DATA.CATSANDDOGS.TITLE'],
                            summary: translations['DATASETS.DATA.CATSANDDOGS.SUMMARY'],
                            description: translations['DATASETS.DATA.CATSANDDOGS.DESCRIPTION'],
                            details: translations['DATASETS.DATA.CATSANDDOGS.DETAILS'],
                            type: 'imgtfjs',
                            image: 'static/images/dataset-catsanddogs.png'
                        },
                        {
                            id: 'organic-waste',
                            title: translations['DATASETS.DATA.ORGANICWASTE.TITLE'],
                            summary: translations['DATASETS.DATA.ORGANICWASTE.SUMMARY'],
                            description: translations['DATASETS.DATA.ORGANICWASTE.DESCRIPTION'],
                            details: translations['DATASETS.DATA.ORGANICWASTE.DETAILS'],
                            type: 'imgtfjs',
                            image: 'static/images/dataset-organicwaste.png'
                        },
                        {
                            id: 'phishing',
                            title: translations['DATASETS.DATA.PHISHING.TITLE'],
                            summary: translations['DATASETS.DATA.PHISHING.SUMMARY'],
                            description: translations['DATASETS.DATA.PHISHING.DESCRIPTION'],
                            details: translations['DATASETS.DATA.PHISHING.DETAILS'],
                            type: 'numbers',
                            image: 'static/images/dataset-phishing.png'
                        },
                        {
                            id: 'noughts-and-crosses',
                            title: translations['WORKSHEETS.NOUGHTSANDCROSSES.TITLE'],
                            summary: translations['DATASETS.DATA.NOUGHTSANDCROSSES.SUMMARY'],
                            description: translations['DATASETS.DATA.NOUGHTSANDCROSSES.DESCRIPTION'],
                            details: translations['DATASETS.DATA.NOUGHTSANDCROSSES.DETAILS'],
                            type: 'numbers',
                            image: 'static/images/dataset-noughtsandcrosses.png',
                            template: true
                        },
                        {
                            id: 'top-trumps',
                            title: translations['DATASETS.DATA.TOPTRUMPS.TITLE'],
                            summary: translations['DATASETS.DATA.TOPTRUMPS.SUMMARY'],
                            description: translations['DATASETS.DATA.TOPTRUMPS.DESCRIPTION'],
                            details: translations['DATASETS.DATA.TOPTRUMPS.DETAILS'],
                            type: 'numbers',
                            image: 'static/images/dataset-toptrumps.png',
                            template: true
                        },
                        {
                            id: 'song-lyrics',
                            title: translations['DATASETS.DATA.SONGLYRICS.TITLE'],
                            summary: translations['DATASETS.DATA.SONGLYRICS.SUMMARY'],
                            description: translations['DATASETS.DATA.SONGLYRICS.DESCRIPTION'],
                            details: translations['DATASETS.DATA.SONGLYRICS.DETAILS'],
                            type: 'text',
                            image: 'static/images/dataset-songlyrics.png'
                        },
                        {
                            id: 'pokemon-stats',
                            title: translations['DATASETS.DATA.POKEMONSTATS.TITLE'],
                            summary: translations['DATASETS.DATA.POKEMONSTATS.SUMMARY'],
                            description: translations['DATASETS.DATA.POKEMONSTATS.DESCRIPTION'],
                            details: translations['DATASETS.DATA.POKEMONSTATS.DETAILS'],
                            type: 'numbers',
                            image: 'static/images/dataset-pokemonstats.png'
                        },
                        {
                            id: 'pokemon',
                            title: translations['DATASETS.DATA.POKEMONIMAGES.TITLE'],
                            summary: translations['DATASETS.DATA.POKEMONIMAGES.SUMMARY'],
                            description: translations['DATASETS.DATA.POKEMONIMAGES.DESCRIPTION'],
                            details: translations['DATASETS.DATA.POKEMONIMAGES.DETAILS'],
                            type: 'imgtfjs',
                            image: 'static/images/dataset-pokemonimages.png'
                        },
                        {
                            id: 'hand-gestures',
                            title: translations['DATASETS.DATA.HANDGESTURES.TITLE'],
                            summary: translations['DATASETS.DATA.HANDGESTURES.SUMMARY'],
                            description: translations['DATASETS.DATA.HANDGESTURES.DESCRIPTION'],
                            details: translations['DATASETS.DATA.HANDGESTURES.DETAILS'],
                            type: 'numbers',
                            image: 'static/images/dataset-handgestures.png',
                            template: true
                        },
                        {
                            id: 'argo',
                            title: translations['DATASETS.DATA.ARGO.TITLE'],
                            summary: translations['DATASETS.DATA.ARGO.SUMMARY'],
                            description: translations['DATASETS.DATA.ARGO.DESCRIPTION'],
                            details: translations['DATASETS.DATA.ARGO.DETAILS'],
                            type: 'numbers',
                            image: 'static/images/dataset-argo.png'
                        },
                        {
                            id: 'stars',
                            title: translations['DATASETS.DATA.STARS.TITLE'],
                            summary: translations['DATASETS.DATA.STARS.SUMMARY'],
                            description: translations['DATASETS.DATA.STARS.DESCRIPTION'],
                            details: translations['DATASETS.DATA.STARS.DETAILS'],
                            type: 'numbers',
                            image: 'static/images/dataset-stars.png'
                        },
                        {
                            id: translations['DATASETS.DATA.FAKENEWS.ID'],
                            title: translations['DATASETS.DATA.FAKENEWS.TITLE'],
                            summary: translations['DATASETS.DATA.FAKENEWS.SUMMARY'],
                            description: translations['DATASETS.DATA.FAKENEWS.DESCRIPTION'],
                            details: translations['DATASETS.DATA.FAKENEWS.DETAILS'],
                            type: 'text',
                            image: 'static/images/dataset-fakenews-upd.png'
                        },
                        {
                            id: 'captcha',
                            title: translations['DATASETS.DATA.CAPTCHA.TITLE'],
                            summary: translations['DATASETS.DATA.CAPTCHA.SUMMARY'],
                            description: translations['DATASETS.DATA.CAPTCHA.DESCRIPTION'],
                            details: translations['DATASETS.DATA.CAPTCHA.DETAILS'],
                            type: 'imgtfjs',
                            image: 'static/images/dataset-captcha.png'
                        }
                    ];

                    browserStorageService.isSupported()
                        .then((supported) => {
                            localStorageSupported = (supported === 1);
                        });

                    vm.loading = false;
                });
            })
            .catch(function (err) {
                displayAlert('errors', err.status, err.data);
            });


        vm.displayDataset = function (ev, dataset) {
            loggerService.debug('[ml4kds] Displaying dataset', dataset);
            if (vm.creating) {
                return;
            }

            // default to previous behaviour of not holding
            //  training data back for testing
            var defaultTestRatio = 0;

            $mdDialog.show({
                locals : {
                    dataset : dataset,
                    testratio : defaultTestRatio,
                    localStorageSupported : localStorageSupported
                },
                controller : function ($scope, locals) {
                    $scope.dataset = locals.dataset;
                    $scope.testratio = locals.testratio;
                    $scope.localStorageSupported = locals.localStorageSupported;
                    $scope.hide = function() {
                        $mdDialog.hide();
                    };
                    $scope.confirm = function(location) {
                        $scope.dataset.storage = location;
                        $scope.dataset.testratio = $scope.testratio;
                        $mdDialog.hide($scope.dataset);
                    };
                    $scope.cancel = function() {
                        $mdDialog.cancel();
                    };
                },
                templateUrl : 'static/components/datasets/dataset.tmpl.html',
                targetEvent : ev,
                clickOutsideToClose : true
            })
            .then(
                function (datasetToImport) {
                    vm.importProject(datasetToImport);
                },
                function() {
                    loggerService.debug('[ml4kds] Import cancelled');
                }
            );
        };


        function storeTestdataAsCsv(project) {
            try {
                storageService.setItem(
                    'testdata://' + project.id,
                    project.testdata.map((row) => {
                        return row.map((cell) => {
                            if (typeof cell === 'string') {
                                return '"' + cell.replaceAll('"', '""') + '"';
                            }
                            else {
                                return cell;
                            }
                        }).join(',');
                    }).join("\r\n"));
            }
            catch (err) {
                loggerService.error('[ml4kds] Failed to store test data in local storage', err);
            }
        }


        vm.importProject = function (dataset) {
            loggerService.debug('[ml4kds] Importing dataset', dataset);

            if (vm.creating) {
                return;
            }

            vm.creating = true;

            var importRequest = {
                type : dataset.type,
                dataset : dataset.id,
                testratio : dataset.testratio,
                storage : dataset.storage,
                name : dataset.title
            };

            if (dataset.storage === 'local') {
                vm.loading = true;

                let trainingdata = [];
                let projectid;

                datasetsService.getDataset(importRequest.type, importRequest.dataset)
                    .then((dataset) => {
                        trainingdata = dataset.trainingdata;
                        importRequest.language = dataset.language;
                        importRequest.labels = dataset.labels;
                        importRequest.fields = dataset.fields;
                        return projectsService.createProject(importRequest,
                                                             vm.profile.user_id,
                                                             vm.profile.tenant);
                    })
                    .then((project) => {
                        projectid = project.id;

                        if (project.type === 'numbers') {
                            return $q.all(
                                trainingdata.map((labeldata) => {
                                    return trainingService.bulkAddTrainingData(project, labeldata);
                                })
                            );
                        }
                        else {
                            return trainingService.bulkAddTrainingData(project, trainingdata,
                                // values only needed for imgtfjs projects, as they're needed
                                //  to send image resizing request API calls
                                vm.profile.user_id, vm.profile.tenant);
                        }
                    })
                    .then(() => {
                        $state.go('projects', { id : projectid });
                    })
                    .catch(function (err) {
                        loggerService.error('[ml4kds] Import failed', err);

                        displayAlert('errors', err.status, err.data);

                        vm.creating = false;
                        vm.loading = false;
                    });
            }
            else {

                projectsService.createProject(importRequest,
                                              vm.profile.user_id,
                                              vm.profile.tenant)
                    .then(function (created) {

                        if (created.testdata) {
                            storeTestdataAsCsv(created);
                        }

                        $state.go('projects', { id : created.id });
                    })
                    .catch(function (err) {
                        loggerService.error('[ml4kds] Import failed', err);

                        displayAlert('errors', err.status, err.data);

                        vm.creating = false;
                    });
            }
        };


    }
}());
