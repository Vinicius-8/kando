
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
        // $('#article-table').html(data.html_table);
        // change parent and
        console.log(data);        
    });
}

// function changeProjectsListHtml(projects){
//     const projectsContainer = getElementById("projectsListContainer");
    
//     for (let index = 0; index < projects.length; index++) {
//         var aElement = document.createElement("a");
//         aElement.textContent = projects[index].name;
//         projectsContainer.append(aElement)
//     }
        
// }

function appendNewProjectToHTML(project){
    const projectsContainer = document.getElementById("projectsListContainer");
    var aElement = document.createElement("a");
    aElement.setAttribute('href', "#") // adding this makes the item color change to white ??
    aElement.textContent = project.name;
    projectsContainer.append(aElement)

}