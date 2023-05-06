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
      console.log('No session storage found');
      return none;
    }
    
    request.open('POST', createBoardEndpoint, true);

    const data = new FormData();
    data.append('projectId', project.id);
    data.append('boardName', boardName.replace(/[\n\t\r]/g, ''));
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




function loadBoardsOnHTML(board, container){    
  /**
   * Uses a project canva to render a single board. Creates all the elements and append to the parent project
   * 
   * @param {board} A board object 
   * @param {container} the parent element to the boards be rendered in
   * @returns {none}
   */
  
  
  /* get container parent */
  const boardParent = container
  boardParent.getElementsByClassName("list-items-board-child")[0].textContent = ""; // cleaning the items

  /* Clone board element */
  const element = document.getElementById("dropdown-modelBase").parentElement.parentElement;
  const boardClone = element.cloneNode(true);

  /* define element title */ 
  boardClone.getElementsByClassName("title-list-board-container")[0].querySelector("span").textContent = board.name.replace(/[\n\t\r]/g, '')  // the box with title, items and plus button, then setting an specific span inside 
  boardClone.getElementsByClassName("title-list-board-container")[0].setAttribute('key', 'board' + board.id)

  /* define items board as a sortable */ 
 Sortable.create(boardClone.getElementsByClassName("list-items-board-child")[0], {  // box just with the items
      animation: 150,
      group: 'shared-items',
      // ghostClass: 'hidden-placeholder',               
      onEnd: function(evt){
        onChangeItem(evt, ".item-board","item")
      } // function tha handles if the item is switched between list or the order changes

  });

 
  /* generating id for dropdown*/
  boardClone.getElementsByClassName('dropdown')[0].id = 'drpdwn'+(Math.random() + 1).toString(36).substring(7)


  boardClone.style.display = 'block';
  boardParent.append(boardClone);


  // boardClone is the parent of items
  if(board.items){
    board.items.forEach(item => {
      loadItemsOnBoard(item, boardClone)
    })
  }
  

}


function deleteBoardRequest(boardId){
  /**
   * Makes a request to the deletion endpoint of boards
   * 
   * @param {boardId} the id in the database
   * @returns {promise} returns a promise with the server response [board id | none]
   */

  const endpoint = document.getElementById('deleteBoardEndpoint').getAttribute('data-endpoint');
  var csrfToken = document.getElementById('csrfToken').getAttribute('data-token');

  // removin the las item from object
  var splited_endpoint = endpoint.split('/')
  splited_endpoint.pop()
  var joined_endpoint = splited_endpoint.join('/')
  
  $.ajaxSetup({
      headers: { "X-CSRFToken": csrfToken }
    });

  return $.ajax({
      type: "DELETE",
      url: joined_endpoint + '/' + boardId,
      headers: {
          'csrfmiddlewaretoken': csrfToken,           
      }
              
  });
}


function updateBoardNameRequest(newName, boardId){
  /**
   * Makes a request to the update endpoint of boards to update the name of the board
   * @param {newName} the new Name of board 
   * @param {boardId} the id of the board
   * @returns {promise} returns a promise with the server response [board id | none]
   */

  const endpoint = document.getElementById('updateBoardEndpoint').getAttribute('data-endpoint');
  var csrfToken = document.getElementById('csrfToken').getAttribute('data-token');

  
  $.ajaxSetup({
      headers: { "X-CSRFToken": csrfToken }
    });

  return $.ajax({
      type: "PUT",
      url: endpoint,     
      data: {
        boardId: boardId,
        newName: newName
      }
              
  });

}


function getItemsPositionOnCanvas(board, classFilter, type){
  /**
   * Gets an specific board an its items, then each items position in the board
   * 
   * @param {none}
   * @returns {list} list of keys and indexes of the items 
   *  
   */
  
  const container = board
  const children = Array.from(container.querySelectorAll(classFilter));
  
  // Sort the elements by the value of the propriety top of getBoundingClientRect()
  const sortedChildren = children.sort((a, b) => {
    const rectA = a.getBoundingClientRect();
    const rectB = b.getBoundingClientRect();
    return rectA.top - rectB.top;
  });
  

  // removes the top and end from the list
  sortedChildren.shift(); // removes the item/board model defined as none

  if(type === "item"){
    sortedChildren.pop(); // removes the + element from list of items
  }else{
    sortedChildren.shift(); // remove 2 more boards
    sortedChildren.shift();
  }


  var dataList = [];
  
  sortedChildren.forEach((child, index) => {
    
    // db key that's on html
    var key;

    // if-esle to get the key depending if item or board
    if (type === "item"){
      key = child.getAttribute('key');
      // console.log(`Elemento ${index + 1}: ${child.textContent.trim()}`)
    
    }else if(type === "board"){
      // getting the attribute and checking if exists 
      att = child.getElementsByClassName("title-list-board-container")[0].getAttribute('key');
      if(!att){
        return
      }
      
      key = att.replace("board","")
    }
    
    // create a list of objects with key and index
    dataList.push({
      'dbKey': key,
      'htmlIndex': index
    }); 
    
  });

  return dataList;
}

