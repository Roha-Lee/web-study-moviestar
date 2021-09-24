function getMoviestars() {
  $.ajax({
    type: "GET",
    url: "/api/list",
    data: {},
    success: function({result, moviestars}) {
      if (result === 'success') {
        moviestars.forEach((moviestar)=>{
          let {visible} = moviestar
          if (visible) generateCard(moviestar)
          else generateBtn(moviestar)
        })
      }
      else {
        alert('서버에서 정보를 불러오는 중 문제가 발생했습니다')
      }
    }
  })
}

function generateBtn({name, like}){
  let btnHtml = 
  `<button type="button" class="btn btn-secondary" onclick="showMoviestar('${name}')">
  ${name} <span class="badge badge-light">${like}</span>
  </button>`
  $('.badge-container').append(btnHtml)
}

function generateCard({url, image, name, like, movies}){
  let moviesStr = movies.join(', ')
  let cardHtml = 
  `<div class="card mb-3 is-show">
    <div class="card-body">
      <div class="badge badge-danger close-badge" onclick="hideMoviestar('${name}')">X</div>
      <img class="basic" src="${image}" alt="${name}" onclick="toggleImageSize(this)">
      <div class="card-body-container">
        <p class="card-title"><a href="${url}" target="_blank">${name}</a><span class="badge badge-pill badge-dark">${like}</span></p>
        <p class="card-text">최근 출연작: ${moviesStr}</p>
      </div>
    </div>
    <div class="card-footer">
      <div class="row no-gutters">
        <a href="#" class="col border like" onclick="thumbsUp('${name}')">좋아요
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
            class="bi bi-hand-thumbs-up-fill" viewBox="0 0 20 20">
            <path
              d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" />
          </svg>
        </a>
        <a href="#" class="col border hate" onclick="thumbsDown('${name}')">싫어요
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
            class="bi bi-hand-thumbs-down-fill" viewBox="0 0 20 20">
            <path
              d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.378 1.378 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.896 1.896 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2.094 2.094 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.162 3.162 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.823 4.823 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z" />
          </svg>
        </a>
        <a href="#" class="col border delete" onclick="deleteMoviestar('${name}')">삭제
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
            class="bi bi-slash-circle" viewBox="0 0 20 20">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="M11.354 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708z" />
          </svg>
        </a>
      </div>
    </div>
  </div>
  `
  $('.card-container').append(cardHtml)
}

function toggleImageSize(e) {
  let image_class = $(e).attr('class')
  if (image_class == 'basic') $(e).attr('class', 'enlarged') 
  else $(e).attr('class', 'basic')
}

function thumbsUp(name) {
  $.ajax({
    type: "POST",
    url: "/api/like",
    data: {"name_given":name},
    success: function({result}) {
      if (result === 'success'){
        alert(`${name} 좋아요 👍🏻`)
        window.location.reload();  
      }
    }
  })
}

function thumbsDown(name) {
  $.ajax({
    type: "POST",
    url: "/api/hate",
    data: {"name_given":name},
    success: function({result}) {
      if (result === 'success'){
        alert(`${name} 싫어요 👎🏻`)
        window.location.reload();  
      }
    }
  })
}

function resetDatabase() {
  $('.container').hide()
  $('.reset-msg').show()
  $.ajax({
    type: 'DELETE',
    url: '/api/reset',
    data: {},
    success: function({result}) {
      if (result === 'success') {
        alert('초기화에 성공하였습니다')
        window.location.reload()  
        $('.reset-msg').hide()
        $('.container').show()
      }
    }
  })
}

function deleteMoviestar(name) {
  $.ajax({
    type: 'DELETE',
    url: '/api/delete',
    data: {'name_given': name},
    success: function({result}) {
      if (result === 'success') {
        alert(`${name} 삭제 👋`)
        window.location.reload()  
      }
    }
  })
}

function hideMoviestar(name) {
  $.ajax({
    type: "POST",
    url: "/api/hide",
    data: {"name_given":name},
    success: function({result}) {
      if (result === 'success'){
        window.location.reload();  
      }
    }
  })
}

function showMoviestar(name) {
  $.ajax({
    type: "POST",
    url: "/api/show",
    data: {"name_given":name},
    success: function({result}) {
      if (result === 'success'){
        window.location.reload();  
      }
    }
  })
}

$(document).ready(function () {
  getMoviestars()
})