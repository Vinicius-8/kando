
function createNewProject(projectName){
    /**
     * Responsible for make a request to de backend, wich the item will be created in the database
     * then receives the new project created and append to the list of projects
     * 
     * @param {string} projectName
     * @returns {none}
     */

    // make the requests
    var request = new XMLHttpRequest();

    //gets the endpoint rendered with django
    var myDiv = document.getElementById('createProjectEndpoint');
    var endpoint = myDiv.getAttribute('data-endpoint');

    //gets the token and the user id, also rendered with django
    var csrfToken = document.getElementById('csrfToken').getAttribute('data-token');    
    var userId = document.getElementById('userId').getAttribute('data-user');
    
    request.open('POST', endpoint, true);

    const data = new FormData();
    data.append('id', userId);
    data.append('projectName', projectName);
    data.append('csrfmiddlewaretoken', csrfToken);
    data.append('action', 'POST');

    request.send(data);

    // waits for the response then append to the list of projects
    request.onload = () => {
        if (request.readyState == 4 && request.status == 200) { // send the data to append after server response
          
          const data = JSON.parse(request.response);             
          // function that appends the new project to the list of projecs in the navbar 
          appendNewProjectToHTML(data.project)
          
        } else {
          console.log(`Error: ${request.status}`);
        }
      };

    //fetchProjects();
}

function fetchProjects(){
    /**
     * Get all projects from a specific user at the backend django
     * 
     * @param {none}
     * @returns {list} list of projects
     */


    // gets infos rendered by django
    const endpoint = document.getElementById('getProjectsEndpoint').getAttribute('data-endpoint');
    var csrfToken = document.getElementById('csrfToken').getAttribute('data-token');
    var userId = document.getElementById('userId').getAttribute('data-user');

    // sets the token
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
        console.log(data)
        return data;
    });
}


function appendNewProjectToHTML(project){
    /**
     * Recieves the new project and appends to the existing list of projecs in the navbar
     * 
     * @param {object} project Objeto project that contains the id, name and user (project owner)
     * @returns {none}
     */

    const projectsContainer = document.getElementById("projectsListContainer");
    var aElement = document.createElement("a");
    aElement.setAttribute('href', "#") // adding this makes the item color change to white ??
    aElement.setAttribute('key', project.id)
    aElement.setAttribute('onClick', "selectProject(this)")
    aElement.textContent = project.name;
    projectsContainer.append(aElement)

}



function selectProject(project, attribute=true){
    if(attribute){
        const proj = fetchProject(project.getAttribute("key"));    
        document.getElementById("selectedProjectTitle").textContent = project.textContent;
        proj.then(resp=>{
            sessionStorage.setItem("selectedProject", JSON.stringify({id: resp.project.id, name: resp.project.name}));
        })
    }else{
        console.log(project);
        parsed_project = JSON.parse(project);
    }        
    
    closeNav();
    
}

function fetchProject(projectId){
    /**
     * fetch the backend and gets a specific project using its id
     * 
     * @param {number} projectId project id in the database
     * @returns {promise} returns a promise with the server response [project | none]
     */

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