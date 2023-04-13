
function createNewProject(projectName){
    var request = new XMLHttpRequest();

    var myDiv = document.getElementById('createProjectEndpoint');
    var endpoint = myDiv.getAttribute('data-endpoint');

    var csrfToken = document.getElementById('csrfToken').getAttribute('data-token');
    
    var userId = document.getElementById('userId').getAttribute('data-user');
    
    request.open('POST', endpoint, true);

    const data = new FormData();
    data.append('id', userId);
    data.append('projectName', projectName);
    data.append('csrfmiddlewaretoken', csrfToken);
    data.append('action', 'POST');

    request.send(data);
    request.onload = () => {
        if (request.readyState == 4 && request.status == 200) { // send the data to append after server response
          
          const data = JSON.parse(request.response);              
          appendNewProjectToHTML(data.project)
          
        } else {
          console.log(`Error: ${request.status}`);
        }
      };

    //fetchProjects();
}

function fetchProjects(){
    /**
     * Get all projects from a specific user
     */

    const endpoint = document.getElementById('getProjectsEndpoint').getAttribute('data-endpoint');
    var csrfToken = document.getElementById('csrfToken').getAttribute('data-token');
    var userId = document.getElementById('userId').getAttribute('data-user');

    $.ajaxSetup({
        headers: { "X-CSRFToken": csrfToken }
      });

    $.ajax({
        type: "POST",
        url: endpoint,
        headers: {
            'csrfmiddlewaretoken': csrfToken,           
        },
        data:{
            'userId':userId
        }
                
    }).done(function(data) {        
        return data;
    });
}


function appendNewProjectToHTML(project){
    const projectsContainer = document.getElementById("projectsListContainer");
    var aElement = document.createElement("a");
    aElement.setAttribute('href', "#") // adding this makes the item color change to white ??
    aElement.setAttribute('key', project.id)
    aElement.textContent = project.name;
    projectsContainer.append(aElement)

}


function selectProject(project){
    const proj = fetchProject(project.getAttribute("key"));    
    document.getElementById("selectedProjectTitle").textContent = project.textContent;
    // sessionStorage.setItem("selectedProject", {id: project.key, name: project.textContent});
    //sessionStorage.setItem("selectedProject", {id: proj.id, name: proj.name});
    proj.then(resp=>{
        sessionStorage.setItem("selectedProject", {id: resp.project.id, name: resp.project.name});
    })
    closeNav();
    
}

function fetchProject(projectId){
    const endpoint = document.getElementById('getProjectsEndpoint').getAttribute('data-endpoint');
    var csrfToken = document.getElementById('csrfToken').getAttribute('data-token');

    $.ajaxSetup({
        headers: { "X-CSRFToken": csrfToken }
      });

    return $.ajax({
        type: "POST",
        url: endpoint+'/'+projectId,
        headers: {
            'csrfmiddlewaretoken': csrfToken,           
        },
        data:{
            'projectId':projectId
        }
                
    });
}