const button = document.querySelector('button')
const userSearch = document.querySelector('#userSearch')
const userAmount = document.querySelector('#imageamount')
const userSize = document.querySelector('#size')
const userSort = document.querySelector('#sorting')
const resultContainer= document.querySelector('.resultContainer')
let h1Animation = anime({
  targets: '.h1Animation',
  autoplay: false,
  rotate: {
    value: 360,
    duration: 1000,
  },
  loop: 1,
})
button.addEventListener('click', (event)=>{
  event.preventDefault()
  resultContainer.innerHTML = " "
  let Search = userSearch.value
  let perPage = userAmount.value
  let size = userSize.value
  let sort = userSort.value
  h1Animation.play();
  
  let flickrURL = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=347a72743edd22fabc20b07c1e95bc92&text=${Search}&sort=${sort}&content_type=1&per_page=${perPage}&page=1&format=json&nojsoncallback=1`
  
  fetch(flickrURL).then((response) => {
    if(response.status >= 200 && response.status < 300){
      return response.json()
    }
    else{
      throw 'fetch failed'
    }
  }
  ).then((data)=>{
    if(data.photos.photo.length == 0){
      let noImage = document.createElement('h1')
      noImage.innerText = "Ingen bild kunde hittas."
      resultContainer.appendChild(noImage)
      throw 'no image found'

    }
    else{
      return data
    }
  })
  .then((data)=> {
    for(let i = 0; i < data.photos.photo.length; i++){
      let photoURL = `https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=347a72743edd22fabc20b07c1e95bc92&photo_id=${data.photos.photo[i].id}&format=json&nojsoncallback=1`
      fetch(photoURL).then((response) => {if(response.status >= 200 && response.status < 300){

        return response.json()
      }
      else{
        throw 'fetch failed'
    }
  }).then((data)=>{
    let photoDiv = document.createElement('div')
    resultContainer.appendChild(photoDiv)
    let aTag = document.createElement('a')
    aTag.href = data.sizes.size[size].source
    aTag.target = "_blank"
    let img = document.createElement('img')
    img.classList.add('photoClass')
    img.src = data.sizes.size[size].source
    aTag.appendChild(img)
    photoDiv.appendChild(aTag)
  }
  ).then(()=>{
    h1Animation.reverse();
  })
}
}).catch((error) => {
  console.log(error)
  let errorMessage = document.createElement('h1')
  resultContainer.appendChild(errorMessage)
  errorMessage.innerText = "Felaktig sökning."
})
})
