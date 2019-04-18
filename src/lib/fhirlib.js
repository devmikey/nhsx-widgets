function getResourceByFullUrl(resources, fullUrl){
	return resources.filter(o => o.fullUrl == fullUrl).map(o=> o.resource)[0];
}

function getResourcesByType(resources,resourceType){
	return resources.filter(o => o.resource.resourceType == resourceType);
}

function getResourcesByCode(resources, codeScheme, code){
	return resources.filter(o => o.resource.code !==undefined).filter(o=> ((o.resource.code.coding[0].system == codeScheme) && (o.resource.code.coding[0].code == code)));
}

function getDependencies(resources, resource){
	var dependencies = [];
	var results = resource.result;
	var meds = resource.medicationReference;
	if (results) {
			results.forEach(function(el){
				dependencies.push(getResourceByFullUrl(resources, el.reference).resource);
		});
	}

	if (meds) {
			meds.forEach(function(el){
				dependencies.push(getResourceByFullUrl(resources, el.reference).resource);
		});
	}

	return dependencies;
}

function checkForRef(resource)
{
    if (resource.context) return resource.context.reference;
}

function getEncounter(resources, fullUrl){
        var linked = resources.filter(o => checkForRef(o.resource) == fullUrl);
        return linked;
}

function IsChildResource(resources, fullUrl){
	if (resources.filter(o=> o.resource.result).filter(o=> o.resource.result[0].reference == fullUrl).length>0) return true;
	if (resources.filter(o=> o.resource.medicationReference).filter(o=> o.resource.medicationReference.reference == fullUrl).length>0) return true;
    // work out all childResources
    // Care Plan missing fullUrl
    //if (resources.filter(o=> o.resource.goal).filter(o=> o.resource.goal[0].reference == fullUrl).length>0) return true;
	return false;
}

function getResourceArray(resources){
	newList =[];
	resources.forEach(function(el){
		if (IsChildResource(resources, el.fullUrl)){
			newList.push(el);
			var dependencies = getDependencies(resources, el.fullUrl);
			newList=newList.concat(dependencies);
		}
		else {
			if (el.resource.resourceType == "Encounter") {
				newList.push(el);
				var encounter = getEncounter(resources, el.fullUrl);
				newList=newList.concat(encounter);
			}	
		}
	})

	return newList.map(o=> o.resource);
}