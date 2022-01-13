const container = document.querySelector(".container")
const userInfo = document.querySelector(".user_info")
const commentForm = document.querySelector('.comment_form')
const url = "http://localhost:3000/"

//get the data from api
const getUsers = async () => {
    const res = await fetch(`${url}comments`)
    const data = await res.json()
    renderUsers(data)
}

//set users info on UI
const renderUsers = data => {
    data.forEach((item, index) => {
        let template = ""
        const { image, username } = item.user

        template = `
        <div class="comment">
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
                        
                        ${item.currentUser ?
                `<div class="header_buutos_container">
                            <div onClick=edditComment() class="header_buttons">
                               <img src="assets/images/icon-edit.svg" alt="edit icon">
                               <p>Edit</p>
                           </div>
                           <div onClick=deleteComment(${item.id}) class="header_buttons">
                              <img src="assets/images/icon-delete.svg" alt="delete icon">
                              <p>Delete</p>
                           </div>
                        </div>`  :
                `<div onClick=handleReply() class="header_buttons" >
                              <img src="assets/images/icon-reply.svg" alt="reply icon">
                              <p>Reply</p>
                        </div>`
            } 

                    </div>
                    <p class="comment_text">${item.content}</p>  
                </div>
            </div>
           <div class="replies">
                <div class="reply_line"></div>
                <div class="replies_container">
                    
                </div>
           </div>
        </div>
        `
        container.insertAdjacentHTML('beforeend', template)

        if (item.replies.length) {
            setReply(item.replies, index)
        }
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

//add comment
const addComment = async (event) => {
    event.preventDefault()

    const doc = {
        currentUser: true,
        content: commentForm.comment.value,
        createdAt: 2,
        score: Math.floor(Math.random() * 20),
        user: {
            image: {
                "png": "./assets/images/avatars/image-juliusomo.png",
                "webp": "./assets/images/avatars/image-juliusomo.webp"
            },
            username: "juliusomo"
        },
        replies: []
    }

    await fetch(`${url}comments`, {
        method: 'POST',
        body: JSON.stringify(doc),
        headers: { 'Content-Type': 'application/json' }
    })
}

//eddit comment
const edditComment = () => {
    console.log(0);
}

//delete comment
const deleteComment = async(id) => {
    await fetch(`${url}comments/${id}`,{
        method: 'DELETE'
    })
}

// show the replies on the UI
const setReply = (reply, index) => {
    const repliesContainer = document.querySelectorAll('.replies_container')

    reply.forEach(item => {
        let template = document.createElement('div')
        const { image, username } = item.user

        template.innerHTML = `
            <div class="reply_container">
                <div class="vote">
                    <button class='vote_btn up_vote'><i class="far fa-thumbs-up"></i></button>  
                    <p class="score">${item.score}</p>
                    <button class='vote_btn down_vote'><i class="far fa-thumbs-down"></i></button>  
                </div>

                <div class="reply_info">
                        <div class="header">
                            <div class="user_info">
                                <img class=avatar src=${image.webp} alt="${username} image">
                                <h3 class="name">${username}</h3>
                                <p class="date">${item.createdAt}</p>
                            </div>

                            <div onClick=handleReply() class="header_buttons">
                                <img src="assets/images/icon-reply.svg" alt="reply icon">
                                <p>Reply</p>
                            </div>    
                    </div>
                    <p class="reply_text"><span>@${item.replyingTo}</span> ${item.content}</p>
                </div >
            </div >
    `
        repliesContainer[index].appendChild(template)
    })
}

// reply to oder comments
const handleReply = () => {
    console.log(0);
}

//events
window.addEventListener("load", getUsers())
commentForm.addEventListener('submit', addComment)
