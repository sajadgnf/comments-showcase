const container = document.querySelector(".container")
const userInfo = document.querySelector(".user_info")

//get the data from api and set it on UI
const renderUsers = async () => {
    const url = "http://localhost:3000/comments"
    const res = await fetch(url)
    const data = await res.json()

    data.forEach(item => {
        let template = ""
        const { image, username } = item.user

        template = `
        <div class="comment_container">
           <div class="vote">
             <button class='vote_btn up_vote'><i class="far fa-thumbs-up"></i></button>  
               <p class="score">${item.score}</p>
             <button class='vote_btn down_vote'><i class="far fa-thumbs-down"></i></button>  
           </div>

           <div class="comment_info">
                <div class="header">
                    <div class="user_info">
                        <img class=avatar src=${image.webp} alt="${username} image">
                        <h3 class="name">${username}</h3>
                        <p class="date">${item.createdAt}</p>
                    </div>

                    <div class="reply_icon">
                         <img src="assets/images/icon-reply.svg" alt="reply icon">
                         <p>Reply</p>
                    </div>    
               </div>
               <p class="comment_text">${item.content}</p>
           </div>

        </ div>
        `
        container.insertAdjacentHTML('beforeend', template)
    })
    voting()
}

//user vote 
const voting = () => {

    const score = document.getElementsByClassName('score')
    const upVoteBtn = document.getElementsByClassName('up_vote')
    const downVoteBtn = document.getElementsByClassName('down_vote')
    let votes = []

    for (let i = 0; i < score.length; i += 1) {
        votes[i] = { upVote: false, downVote: false }

        //up vote function
        upVoteBtn[i].addEventListener('click', () => {

            //when user wants to reverse the vote
            if (votes[i].downVote) {
                score[i].innerHTML = Number(score[i].innerHTML) + 2
                upVoteBtn[i].classList.add("inactive")
                downVoteBtn[i].classList.remove('inactive')

                votes[i].upVote = true
                votes[i].downVote = false
            } else if (votes[i].upVote) {
                score[i].innerHTML = Number(score[i].innerHTML) - 1

                upVoteBtn[i].classList.remove("inactive")
                votes[i].upVote = false
            } else if (!votes[i].upVote) {
                score[i].innerHTML = Number(score[i].innerHTML) + 1

                upVoteBtn[i].classList.add("inactive")
                votes[i].upVote = true
            }
        })

        //down vote function
        downVoteBtn[i].addEventListener('click', () => {

            //when user wants to reverse the vote
            if (votes[i].upVote) {
                score[i].innerHTML = Number(score[i].innerHTML) - 2
                downVoteBtn[i].classList.add("inactive")
                upVoteBtn[i].classList.remove('inactive')

                votes[i].upVote = false
                votes[i].downVote = true
            } else if (votes[i].downVote) {
                score[i].innerHTML = Number(score[i].innerHTML) + 1

                downVoteBtn[i].classList.remove("inactive")
                votes[i].downVote = false
            }
            else if (!votes[i].downVote) {
                score[i].innerHTML = Number(score[i].innerHTML) - 1

                downVoteBtn[i].classList.add("inactive")
                votes[i].downVote = true
            }
        })
    }
}

window.addEventListener("load", renderUsers())