function createNewItem(boardId, itemName){    
      /**
       * Makes a request to the creation endpoint of items
       * 
       * @param {boardId} the board id in the database
       * @param {itemName} the name of the item
       * @returns {promise} returns a promise with the server response [item id | none]
       */
  
      const endpoint = document.getElementById('createItemEndpoint').getAttribute('data-endpoint');
      var csrfToken = document.getElementById('csrfToken').getAttribute('data-token');
  
  
        
      $.ajaxSetup({
          headers: { "X-CSRFToken": csrfToken }
        });
  
      return $.ajax({
          type: "POST",
          url: endpoint,
          data: {
            'itemName': itemName,
            'boardId': boardId,
            }                  
      });
    
  }


function deleteItemRequest(itemId){
    /**
     * Makes a request to the deletion endpoint of items
     * 
     * @param {itemId} the id in the database
     * @returns {promise} returns a promise with the server response [item id | none]
     */
  
    const endpoint = document.getElementById('deleteItemEndpoint').getAttribute('data-endpoint');
    var csrfToken = document.getElementById('csrfToken').getAttribute('data-token');
  
    // removin the last item from object
    var splited_endpoint = endpoint.split('/')
    splited_endpoint.pop()
    var joined_endpoint = splited_endpoint.join('/')
    
  
    console.log('hitting: ', joined_endpoint + '/' + itemId);

    $.ajaxSetup({
        headers: { "X-CSRFToken": csrfToken }
      });
  
    return $.ajax({
        type: "DELETE",
        url: joined_endpoint + '/' + itemId,
        headers: {
            'csrfmiddlewaretoken': csrfToken,           
        }
                
    });
}

function loadItemsOnBoard(item, container){
  /**
   * Uses the board canva to render the items. Creates all the elements and append to the parent board
   * 
   * @param {item} A item object 
   * @param {container} the parent element to the items be rendered in
   */
  
  /* get container parent */
  const boardParent = container.getElementsByClassName('list-items-board-child')[0]
  

  /* Clone board element */
  const element = document.getElementsByClassName('simple-item-box')[0];
  const itemClone = element.cloneNode(true);

  /* define element title */ 
  itemClone.getElementsByClassName('simple-item')[0].textContent = item.name; 
  itemClone.style.display="flex";
  itemClone.setAttribute("key", item.id);


  itemClone.getElementsByClassName('dropdown')[0].id = 'drpdwn'+item.name.split(' ').join(''); // set a new id for a child, with that the related function can find it          
  boardParent.append(itemClone);

}