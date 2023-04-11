/*
<button onclick="basket_add(this)" id="{{ item.id }}"></button>


  function send_productId(id){
    var request = new XMLHttpRequest();
    request.open('POST', '{% url 'basket:basket_add' %}', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    const data = {
      id: id,
      csrfmiddlewaretoken:'{{ csrf_token }}',
      action: "POST",
    };
    request.send(data);
  };

  function basket_add(obj){
    send_productId(obj.id);
  };

*/

function createNewProject(userId, projectName){
    var request = new XMLHttpRequest();
    var myDiv = document.getElementById('createProjectEndpoint');
    var endpoint = myDiv.getAttribute('data-endpoint');
    
    request.open('POST', endpoint, true);
    request.getResponseHeader('Content-Type', 'applicantion/x-www-form-urlencoded; charset=UTF-8');
    const data = {
        id:userId,
        projectName: projectName,
        csrfmiddlewaretoken:'{{ csrf_token }}',
        action: "POST"
    };

    request.send(data)

}