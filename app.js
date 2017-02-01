(function(){
    angular.module("NarrowItDownApp",[])
    .controller('NarrowItDownController', narrowItDownCtrl)
    .service("MenuSearchService", menuSearchService)
    .directive('foundItems', foundItemsDirective)
    .constant('BASE_URL','https://davids-restaurant.herokuapp.com');

    narrowItDownCtrl.$inject=["MenuSearchService"];
    menuSearchService.$inject=['$http','BASE_URL'];
    function narrowItDownCtrl(MenuSearchService){
        var ctrl=this;
        console.log("NarrowItDownController:");
        MenuSearchService.getMatchedMenuItems().then(function(data){
            ctrl.found=data;
        });
        ctrl.onClickNarrowItDown=function(){
            var searchItem=ctrl.search.toLowerCase();
            MenuSearchService.getMatchedMenuItems(searchItem).then(function(data){
                ctrl.found=data;
            });
        }
        ctrl.onRemoveItem=function(item){
            
            var idx=ctrl.found.indexOf(item);
            console.log("onRemove:", idx);
            if(idx>=0){
                ctrl.found.splice(idx,1);
            }
        }
    }
    function menuSearchService($http, BASE_URL){        
        var service=this;
        service.getMatchedMenuItems=function(searchItem){
            return $http({
                method:'GET',
                url:BASE_URL+'/menu_items.json'
            }).then(function(res){
                var result=res.data['menu_items'];
                if(searchItem){
                    var foundItems=[];
                    for(var i=0; i<result.length;i++){
                        var name=result[i].name.toLowerCase();
                        var idx=name.indexOf(searchItem);
                        console.log(idx);
                        if(idx>=0){
                            foundItems.push(result[i]);
                        }
                    }
                    result=foundItems;
                }
                return result;
            })
        }
    }

    function foundItemsDirective(){
        var ddo={
            restrict:"E",
            scope:{
                foundItems:"<",
                onRemove:"&"
            },
            templateUrl:"found-items.html",
            link:function(scope, elem,attrs){
            
            }
        }
        return ddo;
    }
})();