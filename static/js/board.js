function createNewBoard(boardName){
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

    console.log('-->', createBoardEndpoint)

    return none;
    //gets the token and the user id, also rendered with django
    var csrfToken = document.getElementById('csrfToken').getAttribute('data-token');    
    var userId = document.getElementById('userId').getAttribute('data-user');
    
    request.open('POST', endpoint, true);

    const data = new FormData();
    data.append('id', userId);
    data.append('boardName', boardName);
    data.append('csrfmiddlewaretoken', csrfToken);
    data.append('action', 'POST');

    request.send(data);

    // waits for the response then append to the list of boards
    request.onload = () => {
        if (request.readyState == 4 && request.status == 200) { // send the data to append after server response
          
          const data = JSON.parse(request.response);             
          // function that appends the new board to the list of projecs in the navbar 
          appendNewboardToHTML(data.board)
          
        } else {
          console.log(`Error: ${request.status}`);
        }
      };

    //fetchProjects();
}