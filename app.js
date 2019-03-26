//click handlers
$(document).ready(function () {




    var mainObj = {
        topic: "Reaction Gifs",
        searchArray: ["Yes", "Excited", "Gross", "What an idiot", "Not Funny", "Cool", "Happy", "Sad", "Betrayed", "Let down", "Disappointed"],
        //stores found ids so that we don't show the same gifs. that would be tragic
        compiledIds: [],
        userChoice: '',
        apiKey: 'Up6OpDyW3CFUD2IDFnUOsjlx6VO9QgPi',
        genButtons: function () {
            for (let index = 0; index < mainObj.searchArray.length; index++) {
                const element = mainObj.searchArray[index]
                console.log(element);
                // console.log(mainObj.searchArray);

                let ele = $('<button>');
                ele.addClass('topicButton');
                ele.val(element);
                ele.text(element)
                $('.button-stack').append(ele);
            }
        },

        fetchImages: function () {
            //this pertain to click button. Get val, do api call, make the magic happen

            let searchTerm = $(this).val();
            console.log(searchTerm)
            let z = 0;


            let queryUrl = "https://api.giphy.com/v1/gifs/search?api_key=Up6OpDyW3CFUD2IDFnUOsjlx6VO9QgPi&q=" + searchTerm + "&limit=100&offset=0&rating=G&lang=en";


            $.ajax(queryUrl, "GET").then(function (resp) {
                console.log(resp);



                for (let i = 0; i < 10 && z < 100 && z < resp.data.length; z++) {
                    if (mainObj.compiledIds.indexOf(resp.data[z].id) == -1) {

                        let newCont = $('<div>');
                        newCont.addClass('gifCont');
                        newCont.appendTo('.image-cont');
                        let newP  = $('<div>');
                        newP.addClass('imageRating');
                        newP.text("Rating: " +resp.data[z].rating)
                        newP.appendTo(newCont);
                        let newImg = $(`<img src="${resp.data[z].images.original.url}">`);
                        newImg.addClass("imgRes");
                        newImg.val(searchTerm);
                        newImg.appendTo($(newCont));
                        mainObj.compiledIds.push(resp.data[z].id);
                        i++;
                    }
                }
                console.log(mainObj.compiledIds);

            })
        }




        //end object
    }


    //call to start on page load when doc ready
    mainObj.genButtons();
    $('.topicButton').on('click', mainObj.fetchImages);
});