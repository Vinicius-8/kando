var Sortable = document.createElement('script');  
Sortable.setAttribute('src','https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js');
document.head.appendChild(Sortable);

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

    
    saveProjectsInSession(fetchProjects())
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

    return $.ajax({
        type: "POST",
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

    const projectsContainer = document.getElementById("projectsListContainer");
    var aElement = document.createElement("a");
    aElement.setAttribute('href', "#") // adding this makes the item color change to white ??
    aElement.setAttribute('key', project.id)
    aElement.setAttribute('onClick', "selectProject(this)")
    aElement.textContent = project.name;
    projectsContainer.append(aElement)

}


function selectProject(project, attribute=true){
    console.log('minlio: ', project);
    if(attribute){
        const proj = loadProjectFromSession(project.getAttribute("key"));    
        document.getElementById("selectedProjectTitle").textContent = project.textContent;
        sessionStorage.setItem("selectedProject", JSON.stringify({id: proj.id, name: proj.name}));

        // proj.then(resp=>{
        //     sessionStorage.setItem("selectedProject", JSON.stringify({id: resp.project.id, name: resp.project.name}));
        // })
        loadSelectedProject(loadProjectFromSession(project.getAttribute("key")));
    
    }else{       
        //gets a var called project, wich is a string and replace all the single apostrofe to a double apostrofe
        var replacedProject;
        var parsed_project;
       
        replacedProject = project.replace(/'/g, "\"");    
        parsed_project = JSON.parse(replacedProject);
        document.getElementById("selectedProjectTitle").textContent = parsed_project.name; 
        loadSelectedProject(loadProjectFromSession(parsed_project.id));
        
        
        sessionStorage.setItem("selectedProject", JSON.stringify(parsed_project));               
       
        
    }        

    
    closeNav();
    
}

function loadProjectFromSession(idProject){    
    var projects = JSON.parse(sessionStorage.getItem("projects"))    
    var project =  projects.find(proj => proj.id === parseInt(idProject));
    console.log('load id: ', idProject)
    console.log('load: ', project)
    return project;
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

function saveProjectsInSession(projects){    
    console.log('saveProjectsInSession;...')
    var replacedProject = projects.replace(/'/g, "\"");
    // parsed_projects = JSON.parse(replacedProject);
    sessionStorage.setItem("projects", replacedProject);
    return JSON.stringify(replacedProject)
}

function loadSelectedProject(project){ 
    if(project === undefined) return
    
    /**
     * This function resets the canva for another project take place
     */

    /* get item parent */
    const projectParent = document.getElementsByClassName("dashboard-container")[0]         

    /* Clone item element */     
    const modelElement = document.getElementById('parent-container-model');
    const elementClone = modelElement.cloneNode(true);


    /* removes old element */
    document.getElementById('parent-container').remove()

    elementClone.style.display = 'flex';
    elementClone.id = 'parent-container'

    const sortContainer = Sortable.create(elementClone, { // defining the boards inside the parent-container (boards list) as soartables
            animation: 150,
            group: 'shared-boards',
            ghostClass: 'hidden-placeholder', 
            filter: ".list-board-plus", // bypass the plus button                                   
    }); 

    /* define element title */ 
    //elementClone.textContent = newProjectName;                
    projectParent.append(elementClone);

    // creates all the boards in the canvas
    project.boards.forEach(board => {
        loadBoardsOnHTML(board, elementClone)
    })

}

function loadBoardsOnHTML(board, container){
    
        /* creating into the database */
           
          
          /* get container parent */
          const boardParent = container
          boardParent.getElementsByClassName("list-items-board-child")[0].textContent = ""; // cleaning the items

          /* Clone board element */
        //   const element = document.getElementsByClassName('list-board-container')[0];
          const element = document.getElementById("dropdown-modelBase").parentElement.parentElement;
          const boardClone = element.cloneNode(true);

          /* define element title */ 
          //boardClone.getElementsByClassName("title-list-board-container")[0].querySelector("span").textContent = newBoardName  // the box with title, items and plus button, then setting an specific span inside 
          boardClone.getElementsByClassName("title-list-board-container")[0].querySelector("span").textContent = board.name  // the box with title, items and plus button, then setting an specific span inside 
          boardClone.getElementsByClassName("title-list-board-container")[0].setAttribute('key', 'board'+board.id)
    

          /* define as a sortable */ 
          // Sortable.create(boardClone.getElementsByClassName("list-items-board")[0], { 
          Sortable.create(boardClone.getElementsByClassName("list-items-board-child")[0], {  // box just with the items
            animation: 150,
            group: 'shared-items',
            ghostClass: 'hidden-placeholder',          
          });


          
          /* generating id for dropdown*/
          boardClone.getElementsByClassName('dropdown')[0].id = 'drpdwn'+(Math.random() + 1).toString(36).substring(7)


          boardClone.style.display = 'block';
          boardParent.append(boardClone);
        
}