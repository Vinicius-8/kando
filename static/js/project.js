var Sortable = document.createElement('script');  
Sortable.setAttribute('src','https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js');
document.head.appendChild(Sortable);
// adding the Sortable lib to use with the boars

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
    data.append('projectName', projectName.replace(/[\n\t\r]/g, ''));
    data.append('csrfmiddlewaretoken', csrfToken);
    data.append('action', 'POST');

    request.send(data);

    // waits for the response then append to the list of projects
    request.onload = () => {
        if (request.readyState == 4 && request.status == 200) { // send the data to append after server response
          
          const data = JSON.parse(request.response);             
          // function that appends the new project to the list of projecs in the navbar 
          appendNewProjectToHTML(data.project);

          //append the project to the list of projects in session
          appendNewProjectToProjectsInSession(data.project);                      
          selectProject(data.project, attribute=false)
        
        } else {
          console.log(`Error: ${request.status}`);
        }
      };  
    
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

    //sets the token
    $.ajaxSetup({
        headers: { "X-CSRFToken": csrfToken }
      });

    return $.ajax({
        type: "GET",
        url: endpoint,
        headers: {
            'csrfmiddlewaretoken': csrfToken,           
        },
        data:{
            'userId':userId
        }
                
    })
}


function appendNewProjectToHTML(project){
    /**
     * Recieves the new project and appends to the existing list of projecs in the navbar
     * 
     * @param {object} project Objeto project that contains the id, name and user (project owner)
     * @returns {none}
     */


    var projectsList = document.getElementById("projectsListContainer");

    var firstElement = projectsList.firstElementChild;
    var newElement = firstElement.cloneNode(true);
    
    newElement.setAttribute('key', project.id)
    
    var aElement = newElement.querySelector("a");
    aElement.setAttribute('key', project.id)
    aElement.textContent = project.name;
    projectsList.append(newElement)

}

function appendNewProjectToProjectsInSession(project){    
    /**
     * Recieves the new project and appends to the existing JSON object of projecs in the session
     *
     *  
     * @param {object} project Objet project that contains the id, name and user (project owner)
     * @returns {none}   
     * */    
    var projectsList = JSON.parse(sessionStorage.getItem("projects"));
    projectsList.push(project)
    sessionStorage.setItem("projects", JSON.stringify(projectsList))
}


function selectProject(project, attribute=true){
    /**
     * Selects a project from a list of projecs in the session.
     * 
     * The first way uses the attribute of the html element selected (in this case in the list of projects in the nav bar)
     * to get the key value wich is the db id, and loads the selected project.
     * 
     * The second way uses the attribute=false, if the user reloads the page the project selected in the session will be loaded
     * if not, then the first project from the list of projects will be selected.
     * 
     * @param {project} the project to be selected, might be an object or an element html
     * @param {attribute} its optional, true means that's a html element, false is an ojbect
     * @returns {none}
     */

    if(attribute){
        const proj = loadProjectFromSession(project.getAttribute("key"));    
        document.getElementById("selectedProjectTitle").textContent = project.textContent;
        sessionStorage.setItem("selectedProject", JSON.stringify({id: proj.id, name: proj.name}));
        loadSelectedProject(loadProjectFromSession(project.getAttribute("key")));
    
    }else{               
        var replacedProject;        
        try {
            //gets a var called project, wich is a string and replace all the single apostrofe to a double apostrofe
            replacedProject = project.replace(/'/g, "\"");    
        } catch (error) {
            replacedProject = JSON.stringify(project);
        }
        
        var parsed_project = JSON.parse(replacedProject);
        document.getElementById("selectedProjectTitle").textContent = parsed_project.name; // defines the project title
        loadSelectedProject(loadProjectFromSession(parsed_project.id));        
        sessionStorage.setItem("selectedProject", JSON.stringify(parsed_project));                   
    }        

    
    closeNav();
    
}

function loadProjectFromSession(idProject){
    /**
     * Loads the project selecting it from the list of projects in the session
     * 
     * @param {idProject} id of an specifc project
     * @returns {object} returns an project object
     */        
    var projects = JSON.parse(sessionStorage.getItem("projects").replace(/[\n\t\r]/g, ''))       
    var project =  projects.find(proj => proj.id === parseInt(idProject));
    return project;
}

function loadFirstProjectFromSession(){
    /**
     * Loads the first project from the list of projects in the session
     * 
     * @param {none}
     * @returns {none}
     */    
    
    projectsList = JSON.parse(sessionStorage.getItem("projects").replace(/[\n\t\r]/g, ''))
    selectProject(projectsList[0], attribute=false);
}


function fetchProject(projectId){
    /**
     * fetch the backend using ajax and gets a specific project using its id
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
            'projectId' : projectId
        }
                
    });
}

function saveProjectsInSession(projects){    
    /**
     * Gets the list of projects given by django, changes the apostrofe, sets in the session and return the list setted
     * 
     * @param {projects} list of projects stringified by django
     * @return {replacedProjecs} list of altered projects
     */    
    
    if(typeof projects === 'string'){    
        var replacedProjects = projects.replace(/'/g, "\"");
        sessionStorage.setItem("projects", replacedProjects.replace(/[\n\t\r]/g, ''));
        return JSON.stringify(replacedProjects);

    }else{
    
        sessionStorage.setItem("projects", JSON.stringify(projects));
        return JSON.stringify(projects);
    }
    
}


function saveProjectsFromRequest() {
    /**
     * Gets the list of projects from the server and saves it in the session,
     * @param {none}
     * @returns {Promise} - the promise is resolved after the projects are saved in the session
     *
    **/

    return new Promise((resolve, reject) => {
        fetchProjects()
            .then(resp => {
                saveProjectsInSession(resp.projects)
                resolve();
            })
            .catch(err => {
                console.log('Fail to saveProjectsFromRequest', err)
                reject(err);
            })
    })
}

function loadSelectedProject(project){ 
    /**
     * This function resets the canva for another project take place. Creates all the elements necessary to render
     * the project properly. Uses the project param to load its boards
     * 
     * @param {project} Project object with a list of boards in it to be interated through
     * @returns {none}
     */

    if(project === undefined) return
    
   
    /* get item parent */
    const projectParent = document.getElementsByClassName("dashboard-container")[0]         

    /* Clone item element */     
    const modelElement = document.getElementById('parent-container-model');
    const elementClone = modelElement.cloneNode(true);


    /* removes old element */
    document.getElementById('parent-container').remove()

    elementClone.style.display = 'flex';
    elementClone.id = 'parent-container'
    elementClone.setAttribute("key", project.id)

    // defining the boards inside the parent-container (boards list) as soartables
    const sortContainer = Sortable.create(elementClone, { 
            animation: 150,
            group: 'shared-boards',
            ghostClass: 'hidden-placeholder', 
            filter: ".list-board-plus", // bypass the plus button

            onEnd: function(evt){
                onChangeItem(evt, ".list-board-container","board")
            }                                   
    }); 

    /* define element title */ 
    //elementClone.textContent = newProjectName;                
    projectParent.append(elementClone);

    // creates all the boards in the canvas
    if(project.boards){
        project.boards.forEach(board => {
            loadBoardsOnHTML(board, elementClone)
        })
    }

}


function deleteProjectRequest(projectId){
    /**
     * Makes a request to the deletion endpoint of project
     * 
     * @param {projectId} the id in the database
     * @returns {promise} returns a promise with the server response [item id | none]
     */
  
    const endpoint = document.getElementById('deleteProjectEndpoint').getAttribute('data-endpoint');
    var csrfToken = document.getElementById('csrfToken').getAttribute('data-token');
  
    // removin the last item from object
    var splited_endpoint = endpoint.split('/')
    splited_endpoint.pop()
    var joined_endpoint = splited_endpoint.join('/')
    

    $.ajaxSetup({
        headers: { "X-CSRFToken": csrfToken }
      });
  
    return $.ajax({
        type: "DELETE",
        url: joined_endpoint + '/' + projectId,
        headers: {
            'csrfmiddlewaretoken': csrfToken,           
        }
                
    });
}


