const loadNews = () => {
    fetch('https://openapi.programming-hero.com/api/news/categories')
        .then(res => res.json())
        .then(data => displayNews(data.data.news_category))
        .catch((error) => console.log(error));
}

const displayNews = newses => {
    newsItem(parseInt(newses[7].category_id));
    const newsContentContainer = document.getElementById('news-content-container');
    newses.forEach(news => {
        // console.log(news);
        const newsDiv = document.createElement('div');
        newsDiv.classList.add('w-sm-auto');
        newsDiv.innerHTML = `            
            <button  class="fw-bold text-secondary border border-0" onclick="newsItem(${news.category_id})"><span id="btn-color" class="">${news.category_name}</span></button>            
        `;
        newsContentContainer.appendChild(newsDiv);
    })
}

//------------ Show News Item----------------------------
const newsItem = (id) => {
    showSpinner(true);
    const url = `https://openapi.programming-hero.com/api/news/category/0${id}`;
    // console.log(url);
    fetch(url)
        .then(res => res.json())
        .then(data => displaynewsItem(data.data))
        .catch(error => console.log(error))
}

//------------- sort news by view------------------------
function sortNewsItems(newsItems) {
    function compare(obj1, obj2) {
        return obj2.total_view - obj1.total_view;
    }
     return newsItems.sort(compare);
}

const displaynewsItem = (newsItems) => {
    // console.log(newsItems);
    let newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';

    const btnColor = document.getElementById('btn-color');
    // btnColor.classList.remove('text-decoration-none');
    btnColor.classList.add('text-decoration-underline');
    
    const sortNews = sortNewsItems(newsItems);
    // console.log(sortNews); 
    
    //-------------------- call item count function------------
    fetch('https://openapi.programming-hero.com/api/news/categories')
        .then(res => res.json())
        .then(data => showNewsItemCount(data.data.news_category,newsItems))
        .catch(error => console.log(error))

    // showNewsItemCount(newsItems);
    

    sortNews.forEach(newsItem => {
        // console.log(newsItem);
        const newsDiv = document.createElement('div');
        newsDiv.classList.add('card', 'mb-3');
        newsDiv.innerHTML = `
        <div class="row g-0" onclick="loadNewsDetails('${newsItem._id}')" type="button" data-bs-toggle="modal" data-bs-target="#detailNewsModal">
        <div class="col-md-4 p-3">
        <img class="w-100" src="${newsItem.thumbnail_url}" class="img-fluid rounded-start" alt="...">
        </div>
        <div class="col-lg-8 p-3">
            <div class="card-body">
                <h5 class="card-title">${newsItem.title}</h5>
                <p class="card-text">${newsItem.details.slice(0, 398)}...</p>
            </div>
            <div class="d-flex flex-column flex-lg-row justify-content-lg-between p-3">
                <div class="d-flex">
                    <div>
                        <img src="${newsItem.author.name ? newsItem.author.img : newsItem.author.img}" class="img-fluid rounded-circle h-75 img-size" alt="Photo">
                    </div>
                    <div class="ms-1">
                        <p class="fw-bold">${newsItem.author.name ? newsItem.author.name : 'No Author'}</p>
                        <p>${newsItem.author.published_date ? newsItem.author.published_date : 'No Date' }</p>
                    </div>
                </div>
                <div class="d-flex fw-bold mt-3">
                    <i class="fa-solid fa-eye"></i>
                    <p class="ms-2">${newsItem.total_view ? newsItem.total_view : 'No View'}</p>
                </div>
                <div class="mt-3">
                    <i class="fa-solid fa-star-half-stroke"></i>
                    <i class="fa-regular fa-star"></i>
                    <i class="fa-regular fa-star"></i>
                    <i class="fa-regular fa-star"></i>
                    <i class="fa-regular fa-star"></i>
                </div>
                <div class="mt-3">
                    <i class="fa-solid fa-arrow-right text-primary"></i>
                </div>
            </div>
        </div>
        </div>
        `;
        newsContainer.appendChild(newsDiv);
        showSpinner(false);
    })
}

//----------------- show News Details------------
const loadNewsDetails = async(newsDetailsId) => {
    // console.log(newsDetailsId);
    const url = `https://openapi.programming-hero.com/api/news/${newsDetailsId}`;
    const res = await fetch(url);
    const data = await res.json();
    displayNewsDetails(data.data[0]);
//     fetch(url)
//     .then(res => res.json())
//     .then(data => displayNewsDetails(data.data[0]))
}

// ----------------------Display News Details----------

const displayNewsDetails = news => {
    // console.log(news);
    const newsDetailContainer = document.getElementById('content-body');
    newsDetailContainer.innerHTML = `
        <div class="modal-header">
            <h5 class="modal-title" id="detailNewsModalLabel">${news.title}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body row">
            <div class="row">
                <div class="col">
                    <img class="w-100 h100" src="${news.image_url}">
                </div>
                <div class="col">
                    <p>${news.details.slice(0, 350)}...</P>
                </div>
            </div>
            <div class="d-flex justify-content-between mt-3">
            <div class="d-flex">
                    <div>
                        <img src="${news.author.name ? news.author.img : news.author.img}" class="img-fluid rounded-circle h-75 img-size" alt="Photo">
                    </div>
                    <div class="ms-1">
                        <p class="fw-bold">${news.author.name ? news.author.name : 'No Author'}</p>
                        <p>${news.author.published_date ? news.author.published_date : 'No Date' }</p>
                    </div>
            </div> 
            <div>
                <p>Rating:<strong>${news.rating.number}</strong></p>
                <p>Badge:<strong>${news.rating.badge}</strong></p>
            </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>       
    `;
    // newsDetailContainer.appendChild(detailNewsModal);
}


//-------------- add spinner--------------

const showSpinner = isLoading => {
    const spinner = document.getElementById('spinner');

    if (isLoading) {
        spinner.classList.remove('d-none');
    }
    else {
        spinner.classList.add('d-none');
    }
}

//---------------------item count start-------------------------------
function showNewsItemCount(names,newsItems){
    let catName ='';
    // console.log(newsItems)
    // console.log(names);
    
    for(const name of names){
        // console.log(name.category_name)        
        if(name.category_id === newsItems[0].category_id  && newsItems.length>0){
            if(newsItems[0].category_id === '03' && newsItems.length === 26){
                catName=names[7].category_name;
            }
            else{
                catName = name.category_name;
            }
            // if(newsItems.length === 26 && name.catagory_id===8){
            //     catName = name.category_name;
            // }
        }
    }       
    const itemCountContainer = document.getElementById('item-count-container');    
    if(newsItems.length>0){
        itemCountContainer.classList.remove('d-none');
        itemCountContainer.innerHTML = `
            <p class="px-4 py-3 fw-bold">${newsItems.length} items found for catagory ${catName}</p>
        `;
    }
    else
    {
        itemCountContainer.classList.add('d-none');
    }
}
loadNews();