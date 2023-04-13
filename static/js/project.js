
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

    request.send(data)
    fetchProjects();
}

function fetchProjects(){
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