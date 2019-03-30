//click handlers
$(document).ready(function () {

    var mainObj = {
        topic: "Reaction Gifs",
        searchArray: ["Yes", "Excited", "Gross", "lol", "Not Funny", "Cool", "Happy", "Sad", "Betrayed", "Let down", "Disappointed"],
        userChoice: '',
      //  ratingChoice: ['g'],
      favArr: [],
      userButtonIds: [],
        apiKey: 'Up6OpDyW3CFUD2IDFnUOsjlx6VO9QgPi',
        genButtons: function () {
            for (let index = 0; index < mainObj.searchArray.length; index++) {
                const element = mainObj.searchArray[index]        

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
            //Removed rating options, not worth it since cannot select multiple. 
            // if (mainObj.ratingChoice.length ==0){
            //     alert("Must select at least one rating");
            //     return;
            // }
           // let searchRatings = mainObj.ratingChoice.toString();
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


            $.ajax(queryUrl,"GET").then(function(resp){
                console.log(resp);


                
                for (let z = 0; z < 10 && z < resp.data.length; z++) {
                    let stillUrl = resp.data[z].images.fixed_height_still.url;
                    let aniUrl = resp.data[z].images.fixed_height.url;
                    let id = resp.data[z].id;
                    let newCont = $('<div>');
                    newCont.addClass('gifCont');
                    newCont.prependTo('.image-cont');
                  
                    let newP = $('<div>');
                    newP.addClass('imageRating');
                    newP.text("Rating: " + resp.data[z].rating);
                    let favIco = $("<div>");
                    favIco.text("♥ Add to Favorites ♥");
                    favIco.addClass("favIco");
                    favIco.data("id", id);
                    //favIco.val(stillUrl);
                    favIco.appendTo($(newP))

                    newP.appendTo(newCont);
                    let newImg = $(`<img src="${resp.data[z].images.original_still.url}">`);
                    newImg.addClass("imgRes");
                    newImg.attr({ 'data-still': stillUrl, 'data-animate': aniUrl, 'data-ispaused': true });
                    newImg.val(searchTerm);
                    newImg.appendTo($(newCont));
                    // mainObj.compiledIds.push(resp.data[z].id);


                }
                // console.log(mainObj.compiledIds);

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
                mainObj.userButtonIds.push(newVal);
                localStorage.setItem("userButtons", JSON.stringify(mainObj.userButtonIds));
                $('.button-stack').empty();
                $("#addTxt").val('');
                mainObj.genButtons();
                // let newB = $("<button>").addClass("topicButton").val(newVal).attr("clickCount", 0).text(newVal);
                // newB.appendTo('.button-stack');
                // $("#addTxt").val('');

            }
        },
        setFavs: function(){
            let ele = $(this);
            let id = ele.data("id");
            if (mainObj.favArr.indexOf(id) == -1)
            mainObj.favArr.push(id);
           
            localStorage.setItem("favArr", JSON.stringify(mainObj.favArr));
            mainObj.buildFavs();
        },
        buildFavs: function(){
            //I know some of this is duplicated code but I'm out of time/energy to refactor it in a way to be reusable for the initial x10 loop and adhoc here
            let local = localStorage.getItem("favArr");
                let localFavs = JSON.parse(local);
                mainObj.favArr = localFavs;
            $("#favCont").empty();
            if (localFavs != undefined){
                if (localFavs.length !=0){
                    $("#favTag").css("display","block");
                localFavs.forEach(id => {
                    let queryURL = "https://api.giphy.com/v1/gifs/"+id+"?api_key=Up6OpDyW3CFUD2IDFnUOsjlx6VO9QgPi"
                    $.ajax(queryURL, "GET").then(function(resp){
                    let stillUrl = resp.data.images.fixed_height_still.url;
                    let aniUrl = resp.data.images.fixed_height.url;
                   
                    let newCont = $('<div>');
                    newCont.addClass('gifCont');
                    newCont.prependTo('#favCont');
                  
                    let newP = $('<div>');
                    newP.addClass('imageRating');
                    newP.text("Rating: " + resp.data.rating);
                    let favIco = $("<div>");
                    favIco.text("Remove Favorite");
                    favIco.addClass("remFav");
                    favIco.attr("data-id", id);
                    //favIco.val(stillUrl);
                    favIco.appendTo($(newP))
                    newP.appendTo(newCont);
                    let newImg = $(`<img src="${stillUrl}">`);
                    newImg.addClass("imgRes favorite");
                    newImg.attr({ 'data-still': stillUrl, 'data-animate': aniUrl, 'data-ispaused': true });
                    newImg.appendTo($(newCont));
                    let srcDiv = $("<div>");
                    srcDiv.addClass = "favSrcCont";
                    srcDiv.html("Source: ")
                    srcDiv.appendTo($(newCont));

                    let imgSrc = $("<input> ");
                    imgSrc.addClass("favSrc");
                    imgSrc.attr("id",id);
                    imgSrc.val(aniUrl);
                    imgSrc.appendTo($(srcDiv))  ;

                    let copyBut = $("<button> ");
                    copyBut.addClass("copyButton");
                    copyBut.text("Copy");
                    copyBut.val(id);
                    copyBut.appendTo($(srcDiv))  ;
                    });
                
                });
            }
            }
        }, 
        addUserButtons: function(){
            let local = localStorage.getItem("userButtons");
            let localButtons = JSON.parse(local);
            if (localButtons != undefined){
            localButtons.forEach(button => {
                mainObj.searchArray.push(button);
            });
        }
        },
        removeFav: function(){
            let ele = $(this);
            let id = ele.data('id');
          let ix =  mainObj.favArr.indexOf(id);
          mainObj.favArr.splice(ix, 1);
          if (mainObj.favArr.length == 0){
            $("#favTag").css("display","none");
          }
          localStorage.setItem("favArr", JSON.stringify(mainObj.favArr));
          mainObj.buildFavs();
        },

        copyToClip: function(){
            let ele = $(this);
            let id = $(this).val();
            var copyText = document.getElementById(id);
            copyText.select();

            /* Copy the text inside the text field */
            document.execCommand("copy");
            $(this).text("Copied!")
          
            /* Alert the copied text */
            setTimeout(function(){ 
                ele.text("Copy")
            }, 3000);

        }
        // },
        // setRatingChoice: function(){
        //     let ele = $(this);
        //     let sel = ele.val();           
        //     let ix = mainObj.ratingChoice.indexOf(sel);

        //     if (ele.hasClass("selected")){
        //         ele.removeClass("selected");
        //         mainObj.ratingChoice.splice(ix,1);
        //     } else {
        //         ele.addClass("selected");          
        //         mainObj.ratingChoice.push(sel);
        //     }
        //     console.log(mainObj.ratingChoice);
        // }
    }
    

    
    //call to start on page load when doc ready
    mainObj.addUserButtons();
    mainObj.genButtons();
   mainObj.buildFavs();
    $(document.body).on('click', '.topicButton', mainObj.fetchImages);
    $(document.body).on('click', '.imgRes', mainObj.imgUpdate);
    $('#addButton').on('click', mainObj.addButton);
    $(document.body).on('click', '.favIco',mainObj.setFavs);
    $(document.body).on('click', '.remFav',mainObj.removeFav);
    $(document.body).on('click', '.copyButton',mainObj.copyToClip);
});