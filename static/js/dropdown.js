    //show the dropdown when clicked
    function toggleDropdown(id) {        
        var dropdown = document.querySelector("#" + id);    
        
        dropdown.classList.toggle("show");
    }

// leave the dropdown when is no longer focus
document.addEventListener("click", function(event) { 

        var dropdowns = document.querySelectorAll(".dropdown");

        dropdowns.forEach(function(dropdown) {
            console.log(dropdown)
            if (event.target.closest("#" + dropdown.id) !== dropdown) {
                dropdown.classList.remove("show");
            }
        });
    });