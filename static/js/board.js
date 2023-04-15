function createNewBoard(boardName){
  return new Promise(function(resolve, reject) {
    /**
     * Responsible for make a request to de backend, wich the board will be created in the database
     * then receives the new board created and append to the list of boards
     * 
     * @param {string} boardName
     * @returns {none}
     */


    
    // make the requests
    var request = new XMLHttpRequest();

    //gets the endpoint rendered with django
    var divElement = document.getElementById('createBoardEndpoint');
    var createBoardEndpoint = divElement.getAttribute('data-endpoint');

    //gets the token and the user id, also rendered with django
    var csrfToken = document.getElementById('csrfToken').getAttribute('data-token');    
    var project = JSON.parse(sessionStorage.getItem("selectedProject"));

    if(!project){
      alert('No session storage found');
      return none;
    }
    
    request.open('POST', createBoardEndpoint, true);

    const data = new FormData();
    data.append('projectId', project.id);
    data.append('boardName', boardName);
    data.append('csrfmiddlewaretoken', csrfToken);
    data.append('action', 'POST');

    request.send(data);

    // waits for the response then append to the list of boards
    request.onload = () => {
        if (request.readyState == 4 && request.status == 200) { // send the data to append after server response
          
          const data = JSON.parse(request.response);             
          // function that appends the new board to the list of projecs in the navbar              
          //return data;   
          resolve(data)
          
        } else {
          console.log(`Error: ${request.status}`);
        }
    };

    request.onerror = function () {
      reject({
        status: xhr.status,
        statusText: xhr.statusText
      });
    };

  });
}