//click handlers
$(document).ready(function () {

    var mainObj = {
        topic: "Reaction Gifs",
        searchArray: ["Yes", "Excited", "Gross", "lol", "Not Funny", "Cool", "Happy", "Sad", "Betrayed", "Let down", "Disappointed"],
        userChoice: '',
        apiKey: 'Up6OpDyW3CFUD2IDFnUOsjlx6VO9QgPi',
        genButtons: function () {
            for (let index = 0; index < mainObj.searchArray.length; index++) {
                const element = mainObj.searchArray[index]
                console.log(element);
                // console.log(mainObj.searchArray);

                let ele = $('<button>');
                ele.addClass('topicButton rounded');
                ele.val(element);
                ele.attr('clickCount', 0);
                ele.text(element)
                $('.button-stack').append(ele);
            }
        },

        fetchImages: function () {
            //this pertain to click button. Get val, do api call, make the magic happen
            let searchTerm = $(this).val();
            let clickCo = $(this).attr('clickCount');
            let offSetSearch = clickCo * 10;
            clickCo++
            $(this).attr('clickCount', clickCo);
            let z = 0;

            //offset allows you to push results back a bit so you don't get the same images.
            // This way I don't have to store ids, store count of each run of
            //button, then add that dynamically to the below queryURL (i.e. lol 2 times result in 3*10=30 offset)
            let queryUrl = "https://api.giphy.com/v1/gifs/search?api_key=Up6OpDyW3CFUD2IDFnUOsjlx6VO9QgPi&q=" + searchTerm + "&limit=100&offset=" + offSetSearch + "&rating=G&lang=en";


            $.ajax(queryUrl, "GET").then(function (resp) {
                console.log(resp);



                for (let z = 0; z < 10 && z < resp.data.length; z++) {
                    let stillUrl = resp.data[z].images.fixed_height_still.url;
                    let aniUrl = resp.data[z].images.fixed_height.url;
                    let newCont = $('<div>');
                    newCont.addClass('gifCont');
                    newCont.prependTo('.image-cont');
                    let newP = $('<div>');
                    newP.addClass('imageRating');
                    newP.text("Rating: " + resp.data[z].rating)
                    newP.appendTo(newCont);
                    let newImg = $(`<img src="${resp.data[z].images.original_still.url}">`);
                    newImg.addClass("imgRes");
                    newImg.attr({ 'data-still': stillUrl, 'data-animate': aniUrl, 'data-ispaused': true });
                    newImg.val(searchTerm);
                    newImg.appendTo($(newCont));
                    // mainObj.compiledIds.push(resp.data[z].id);


                }
                console.log(mainObj.compiledIds);

            })
        },
        imgUpdate: function () {
            let isPaused = $(this).data('ispaused');
            let stillUrl = $(this).data('still');
            let aniUrl = $(this).data('animate');
            console.log(isPaused);
            if (isPaused) {
                $(this).attr('src', aniUrl);
                $(this).data('ispaused', false);
            } else {
                $(this).attr('src', stillUrl);
                $(this).data('ispaused', true);
            }
        },
        addButton: function(){
            let newVal = $('#addTxt').val();
            if (mainObj.searchArray.indexOf(newVal) > -1){
                alert("Seems that button exists already. Give it a push!");
                $("#addTxt").val('');
            } else if (newVal ==''){

                alert("Add a value to search!");
            } else {
                mainObj.searchArray.push(newVal);
                $('.button-stack').empty();
                $("#addTxt").val('');
                mainObj.genButtons();
                // let newB = $("<button>").addClass("topicButton").val(newVal).attr("clickCount", 0).text(newVal);
                // newB.appendTo('.button-stack');
                // $("#addTxt").val('');

            }

        }
    }


    //call to start on page load when doc ready
    mainObj.genButtons();
    $(document.body).on('click', '.topicButton', mainObj.fetchImages);
    $(document.body).on('click', '.imgRes', mainObj.imgUpdate);
    $('#addButton').on('click', mainObj.addButton);
});