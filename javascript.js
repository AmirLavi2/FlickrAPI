$(document).ready(()=>{

    // get form result
    $("#searchImagesByTags").submit((event)=>{
        event.preventDefault();
        let tags = $('#tagsInput').val();
        getThumbnails(tags);
        
    });

    // get JSON from Flickr API with user Tags
    const getThumbnails = (tags)=>{
        const FLICKR_API_URL = 'https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?';

        $.getJSON(FLICKR_API_URL, {
            tags,
            tagmode: 'any',
            format: 'json'
        }).done((data)=>{
            console.log('done');
            render(data);
        }).fail((err)=>{
            console.log('Error ! ', err);
        });
    }

    // render GET result on the DOM
    const render = (data)=>{
        $('#flickrItems').empty();
        $.each(data.items, (index, item)=>{
            filterResult = filterWithRegEx(item.link, item.author, item.date_taken);

            let title = $('<h3>').html(item.title).addClass('imgTitle');
            let author = $('<a>').attr({'href': filterResult.authorPage, 'target': '_blank'}).html(filterResult.authorName).addClass('author');
            let date = $('<span>').html(filterResult.imageDayTaken).addClass('date');
            let thumbnail = $('<a>').attr({'href': item.link, 'target': '_blank'}).html($('<img>').attr('src', item.media.m).addClass('thumbnail'));

            $('<div>').addClass('itemContainer').append(title, thumbnail, author, date).appendTo(`#flickrItems`);
        });
    }

    // using regEx to 'clean' the extra string 
    const filterWithRegEx = (imgOriginalSize, author, fullDate)=>{
        let findImageId = new RegExp('\\/\\d\+\\/'); 
        let authorPage = imgOriginalSize.replace(findImageId,''); // ...flickr.com/photos/AuthorName/123/ --> ...flickr.com/photos/AuthorName
        let findAuthorName = /\(([^)]+)\)/;
        let authorName = findAuthorName.exec(author)[1].replace(/['"]+/g, ''); // replace remove the quotes;
        let findTheDate = /\d{4}[-]\d{2}[-]\d{2}/;
        let imageDayTaken = findTheDate.exec(fullDate)[0];
        return {
            authorPage: authorPage,
            authorName: authorName,
            imageDayTaken: imageDayTaken
        }
    }

});


// https://www.flickr.com/photos/test/40790924705/